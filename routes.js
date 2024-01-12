import express from 'express';
import {
    createOrUpdateInventoryItem,
    getInventoryItemsByDateRange,
    readAllInventoryItems,
    getInventoryItemsByCategory
} from './db.js';

const router = express.Router();

// READ ALL Inventory Items
router.get('/inventory', async (req, res) => {
    const { success, data } = await readAllInventoryItems();

    if (success) {
        return res.json({ data });
    }
    return res.status(500).json({ success: false, message: "Error" });
});



// Create or Update Inventory Item
router.post('/inventory', async (req, res) => {
    const { success, data } = await createOrUpdateInventoryItem(req.body);

    if (success) {
        return res.json({ id: data });
    }

    return res.status(500).json({ success: false, message: 'Error' });
});

// Get Inventory Items by Date Range
router.post('/inventory/date-range', async (req, res) => {
    const { dt_from, dt_to } = req.body;
    
    if (!dt_from || !dt_to) {
        return res.status(400).json({ success: false, message: "Missing date range parameters" });
    }

    const { success, data } = await getInventoryItemsByDateRange(dt_from, dt_to);

    if (success) {
        return res.json({ data });
    }

    return res.status(500).json({ success: false, message: "Error" });
});

// Get Inventory Items by Category
router.post('/inventory/category', async (req, res) => {
    const { category } = req.body;

    if (!category) {
        return res.status(400).json({ success: false, message: "Missing category parameter" });
    }

    const { success, data } = await getInventoryItemsByCategory(category);

    if (success) {
        return res.json({ data });
    }

    return res.status(500).json({ success: false, message: "Error" });
});

// Update Inventory Item by ID
router.put('/inventory/:id', async (req, res) => {
    const inventoryItem = req.body;
    const { id } = req.params;
    inventoryItem.id = parseInt(id);

    const { success, data } = await createOrUpdateInventoryItem(inventoryItem);

    if (success) {
        return res.json({ id: data });
    }

    return res.status(500).json({ success: false, message: "Error" });
});


export default router;