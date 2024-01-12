import express from 'express';
import {
    createOrUpdateInventoryItem,
    getInventoryItemsByDateRange,
    getAllInventoryItems,
    getInventoryItemsByCategory
} from './db.js';

const router = express.Router();

// Get ALL Inventory Items for checking
router.get('/', async (req, res) => {
    const { success, data } = await getAllInventoryItems();

    if (success) {
        return res.json({ data });
    }
    return res.status(500).json({ success: false, message: "Error" });
});

// Task 1: Create or Update items in inventoryTable
// Create or Update Inventory Item based on req
router.post('/inventory', async (req, res) => {
    const { success, data } = await createOrUpdateInventoryItem(req.body);

    if (success) {
        return res.json({ id: data });
    }

    return res.status(500).json({ success: false, message: 'Error' });
});

// task 2: get inventory items based on date range in request
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

// Task 3: Get Inventory Items based on Category
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

export default router;