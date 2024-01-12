import { db, Table } from './db.config.js';
import { v4 as uuidv4 } from 'uuid';

// Function to get all items from inventoryTable for checking
const getAllInventoryItems = async () => {
    const params = {
        TableName: Table
    };

    try {
        const { Items = [] } = await db.scan(params).promise();
        return { success: true, data: Items };
    } catch (error) {
        console.error('Error in getAllInventoryItems:', error);
        return { success: false, data: null };
    }
};

// Task 1: Create or Update items in inventoryTable
// Function to get an inventory item by name
const getInventoryItemByName = async (name) => {
    const params = {
        TableName: Table,
        KeyConditionExpression: 'name = :name',
        ExpressionAttributeValues: {
            ':name': name
        }
    };

    try {
        const { Items = [] } = await db.query(params).promise(); //using query here based on name
        return { success: true, data: Items[0] || null };
    } catch (error) {
        console.error('Error in getInventoryItemByName:', error);
        return { success: false, message: error.message, data: null };
    }
};
// Function to create or updateinventoryitem based on name
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
                await db.update(params).promise(); // use .update
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

// task 2: get inventory items based on date range in request
const getInventoryItemsByDateRange = async (dtFrom, dtTo) => {
    const params = {
        TableName: Table,
        FilterExpression: "#last_updated_dt between :dtFrom and :dtTo",
        ExpressionAttributeNames: {
            "#last_updated_dt": "last_updated_dt"
        },
        ExpressionAttributeValues: {
            ":dtFrom": dtFrom,
            ":dtTo": dtTo
        }
    };

    try {
        const { Items = [] } = await db.scan(params).promise();

        const totalPrice = Items.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2);
        return { success: true, data: { items: Items, total_price: totalPrice } };
    } catch (error) {
        console.error('Error in getInventoryItemsByDateRange:', error);
        return { success: false, data: null };
    }
};

// Task 3: Get Inventory Items based on Category
const getInventoryItemsByCategory = async (category) => {
    const params = {
        TableName: Table,
        ProjectionExpression: "id, #name, category, price",
        ExpressionAttributeNames: {
            "#name": "name"
        }
    };

    try {
        const { Items = [] } = await db.scan(params).promise();

        let filteredItems = [];
        if (category && category.toLowerCase() !== 'all') {
            filteredItems = Items.filter(item => item.category === category);
        } else {
            filteredItems = Items;
        }

        // Aggregation
        const categoryAggregation = filteredItems.reduce((aggregation, item) => {
            const existingCategory = aggregation.find(cat => cat.category === item.category);

            if (existingCategory) {
                existingCategory.total_price = (parseFloat(existingCategory.total_price) + parseFloat(item.price)).toFixed(2);
                existingCategory.count += 1;
            } else {
                aggregation.push({
                    category: item.category,
                    total_price: item.price,
                    count: 1
                });
            }

            return aggregation;
        }, []);

        return { success: true, data: { items: categoryAggregation } };
    } catch (error) {
        console.error('Error in getInventoryItemsByCategory:', error);
        return { success: false, data: null };
    }
};

export {
    createOrUpdateInventoryItem,
    getInventoryItemByName,
    getInventoryItemsByDateRange,
    getInventoryItemsByCategory,
    getAllInventoryItems
};