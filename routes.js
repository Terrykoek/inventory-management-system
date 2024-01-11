import express from 'express';
import {
    createOrUpdateInventoryItem,
    deleteInventoryItemById,
    getInventoryItemById,
    readAllInventoryItems
} from './db.js';

const router = express.Router();

// READ ALL Inventory Items
router.get('/inventory', async (req, res) => {
    const { success, data } = await readAllInventoryItems();

    if (success) {
        return res.json({ success, data });
    }
    return res.status(500).json({ success: false, message: "Error" });
});

// Get Inventory Item by ID
router.get('/inventory/:id', async (req, res) => {
    const { id } = req.params;
    const { success, data } = await getInventoryItemById(id);

    if (success) {
        return res.json({ success, data });
    }

    return res.status(500).json({ success: false, message: "Error" });
});

// Create or Update Inventory Item
router.post('/inventory', async (req, res) => {
    const { success, data } = await createOrUpdateInventoryItem(req.body);

    if (success) {
        return res.json({ success, data });
    }

    return res.status(500).json({ success: false, message: 'Error' });
});

// Update Inventory Item by ID
router.put('/inventory/:id', async (req, res) => {
    const inventoryItem = req.body;
    const { id } = req.params;
    inventoryItem.id = parseInt(id);

    const { success, data } = await createOrUpdateInventoryItem(inventoryItem);

    if (success) {
        return res.json({ success, data });
    }

    return res.status(500).json({ success: false, message: "Error" });
});

// Delete Inventory Item by Id
router.delete('/inventory/:id', async (req, res) => {
    const { id } = req.params;
    const { success, data } = await deleteInventoryItemById(id);

    if (success) {
        return res.json({ success, data });
    }

    return res.status(500).json({ success: false, message: 'Error' });
});

export default router;