import {
    createOrUpdateInventoryItem,
    getInventoryItemByName,
    getInventoryItemsByDateRange,
    getInventoryItemsByCategory,
    getAllInventoryItems,
} from './db'; 
import { db, Table } from './db.config';

// Mock the dependencies or set up the testing environment as needed
jest.mock('./db.config');
jest.mock('uuid', () => ({ v4: jest.fn(() => 'mocked-uuid') }));

describe('getAllInventoryItems', () => {
    it('should retrieve all items from the inventory table', async () => {
        const mockScan = jest.fn().mockReturnValueOnce({ promise: jest.fn().mockResolvedValueOnce({ Items: [{ id: 'item1' }, { id: 'item2' }] }) });
        db.scan.mockImplementation(mockScan);

        const result = await getAllInventoryItems();

        expect(result.success).toBe(true);
        expect(result.data).toEqual([{ id: 'item1' }, { id: 'item2' }]);
        expect(mockScan).toHaveBeenCalledWith({ TableName: Table });
    });
});

// Task 1: Create or Update items in inventoryTable
describe('getInventoryItemByName', () => {
    it('should retrieve an inventory item by name', async () => {
        const mockQuery = jest.fn().mockReturnValueOnce({ promise: jest.fn().mockResolvedValueOnce({ Items: [{ id: 'item1' }] }) });
        db.query.mockImplementation(mockQuery);


        const result = await getInventoryItemByName('item1');

        expect(result.success).toBe(true);
        expect(result.data).toEqual({ id: 'item1' });
        expect(mockQuery).toHaveBeenCalledWith({
            TableName: Table,
            KeyConditionExpression: 'name = :name',
            ExpressionAttributeValues: { ':name': 'item1' },
        });
    });

});

// task 2: get inventory items based on date range in request
describe('getInventoryItemsByDateRange', () => {
    it('should retrieve inventory items within a specified date range', async () => {
        const dtFrom = '2023-01-01T00:00:00.000Z';
        const dtTo = '2023-12-31T23:59:59.999Z';

        const mockScan = jest.fn().mockReturnValueOnce({
            promise: jest.fn().mockResolvedValueOnce({
                Items: [{ id: 'item1', price: '10.00' }, { id: 'item2', price: '20.00' }],
            }),
        });

        db.scan.mockImplementation(mockScan);

        const result = await getInventoryItemsByDateRange(dtFrom, dtTo);

        expect(result.success).toBe(true);
        expect(result.data.items).toEqual([{ id: 'item1', price: '10.00' }, { id: 'item2', price: '20.00' }]);
        expect(result.data.total_price).toBe('30.00');
        expect(mockScan).toHaveBeenCalledWith({
            TableName: Table,
            FilterExpression: '#last_updated_dt between :dtFrom and :dtTo',
            ExpressionAttributeNames: { '#last_updated_dt': 'last_updated_dt' },
            ExpressionAttributeValues: { ':dtFrom': dtFrom, ':dtTo': dtTo },
        });
    });
});

// Task 3: Get Inventory Items based on Category
describe('getInventoryItemsByCategory', () => {
    it('should retrieve inventory items aggregated by category', async () => {
        const category = 'Fitness Equipment';

        const mockScan = jest.fn().mockReturnValueOnce({
            promise: jest.fn().mockResolvedValueOnce({
                Items: [
                    { id: 'item1', category: 'Fitness Equipment', price: '10.00' },
                    { id: 'item2', category: 'Fitness Equipment', price: '20.00' },
                ],
            }),
        });

        db.scan.mockImplementation(mockScan);

        const result = await getInventoryItemsByCategory(category);

        expect(result.success).toBe(true);
        expect(result.data.items).toEqual([
            { category: 'Fitness Equipment', total_price: '30.00', count: 2 },
        ]);
        expect(mockScan).toHaveBeenCalledWith({
            TableName: Table,
            ProjectionExpression: 'id, #name, category, price',
            ExpressionAttributeNames: { '#name': 'name' },
        });
    });
});