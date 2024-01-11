import { db, Table } from './db.config.js';
import { v4 as uuidv4 } from 'uuid';

// Function to get an inventory item by name
const getInventoryItemByName = async (name) => {
    const params = {
        TableName: Table,
        IndexName: 'name-index', // Replace with your actual index name if you have one
        KeyConditionExpression: 'name = :name',
        ExpressionAttributeValues: {
            ':name': name
        }
    };

    try {
        const { Items = [] } = await db.query(params).promise();
        return { success: true, data: Items[0] || null };
    } catch (error) {
        console.error('Error in getInventoryItemByName:', error);
        return { success: false, message: error.message, data: null };
    }
};

// Create or Update items in inventoryTable
const createOrUpdateInventoryItem = async (data = {}) => {
    const { name, category, price } = data;
    const formattedPrice = parseFloat(price).toFixed(2);

    // Check if an item with the same name exists
    const { success: itemExists, data: existingItem } = await getInventoryItemByName(name);

    if (itemExists) {
        // If the item exists, update it only if the price is different
        if (existingItem.price !== formattedPrice) {
            const params = {
                TableName: Table,
                Key: {
                    id: existingItem.id
                },
                UpdateExpression: 'SET #p = :price, last_updated_dt = :last_updated_dt',
                ExpressionAttributeNames: {
                    '#p': 'price'
                },
                ExpressionAttributeValues: {
                    ':price': formattedPrice,
                    ':last_updated_dt': new Date().toISOString()
                }
            };

            try {
                await db.update(params).promise();
                return { success: true, data: existingItem.id };
            } catch (error) {
                console.error('Error in updateInventoryItem:', error);
                return { success: false, message: error.message };
            }
        } else {
            // If the price is the same, no update is needed
            return { success: true, data: existingItem.id };
        }
    } else {
        // If the item doesn't exist, create a new one
        const params = {
            TableName: Table,
            Item: {
                id: uuidv4(),
                name,
                category,
                price: formattedPrice,
                last_updated_dt: new Date().toISOString()
            }
        };

        try {
            await db.put(params).promise();
            return { success: true, data: params.Item.id };
        } catch (error) {
            console.error('Error in createInventoryItem:', error);
            return { success: false, message: error.message };
        }
    }
};


// Read all items from inventoryTable
const readAllInventoryItems = async () => {
    const params = {
        TableName: Table
    };

    try {
        const { Items = [] } = await db.scan(params).promise();
        return { success: true, data: Items };
    } catch (error) {
        console.error('Error in readAllInventoryItems:', error);
        return { success: false, data: null };
    }
};

// Read Item by ID from inventoryTable
const getInventoryItemById = async (value, key = 'id') => {
    const params = {
        TableName: Table,
        Key: {
            [key]: parseInt(value)
        }
    };

    try {
        const { Item = {} } = await db.get(params).promise();
        return { success: true, data: Item };
    } catch (error) {
        console.error('Error in getInventoryItemById:', error);
        return { success: false, data: null };
    }
};

// // Delete Item by ID from inventoryTable
// const deleteInventoryItemById = async (value, key = 'id') => {
//     const params = {
//         TableName: Table,
//         Key: {
//             [key]: parseInt(value)
//         }
//     };

//     try {
//         await db.delete(params).promise();
//         return { success: true };
//     } catch (error) {
//         console.error('Error in deleteInventoryItemById:', error);
//         return { success: false };
//     }
// };

export {
    createOrUpdateInventoryItem,
    getInventoryItemByName,
    readAllInventoryItems,
    getInventoryItemById,
    // deleteInventoryItemById
};