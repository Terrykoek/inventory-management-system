import { db, Table } from './db.config.js';

// Create or Update items in inventoryTable
const createOrUpdateInventoryItem = async (data = {}) => {
    const params = {
        TableName: Table,
        Item: data
    };

    try {
        await db.put(params).promise();
        return { success: true };
    } catch (error) {
        console.error('Error in createOrUpdateInventoryItem:', error);
        return { success: false, message: error.message };
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

// Delete Item by ID from inventoryTable
const deleteInventoryItemById = async (value, key = 'id') => {
    const params = {
        TableName: Table,
        Key: {
            [key]: parseInt(value)
        }
    };

    try {
        await db.delete(params).promise();
        return { success: true };
    } catch (error) {
        console.error('Error in deleteInventoryItemById:', error);
        return { success: false };
    }
};

export {
    createOrUpdateInventoryItem,
    readAllInventoryItems,
    getInventoryItemById,
    deleteInventoryItemById
};