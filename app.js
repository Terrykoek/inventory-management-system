const { DynamoDBClient, UpdateItemCommand, GetItemCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { v4: uuidv4 } = require('uuid');

const dynamoDBClient = new DynamoDBClient({
  region: 'region',
  credentials: {
    accessKeyId: 'accessKeyId',
    secretAccessKey: 'secretAccessKey',
  },
});

async function insertOrUpdateItem(request) {
  const { name, category, price } = request;

  const formattedPrice = Number.parseFloat(price).toFixed(2);
  const lastUpdatedDt = new Date().toISOString();
  const itemId = uuidv4(); // Generate a UUID for the item

  // Check if an item with the same name already exists
  const getItemParams = {
    TableName: 'inventoryTable',
    Key: {
      name: { S: name },
    },
  };

  try {
    const getItemCommand = new GetItemCommand(getItemParams);
    const existingItem = await dynamoDBClient.send(getItemCommand);

    if (existingItem.Item) {
      // Update the existing item with the new price and last_updated_dt
      const updateItemParams = {
        TableName: 'inventoryTable',
        Key: {
          name: { S: name },
        },
        UpdateExpression: 'SET price = :price, last_updated_dt = :lastUpdatedDt',
        ExpressionAttributeValues: {
          ':price': { N: formattedPrice },
          ':lastUpdatedDt': { S: lastUpdatedDt },
        },
      };

      const updateItemCommand = new UpdateItemCommand(updateItemParams);
      const updatedItem = await dynamoDBClient.send(updateItemCommand);

      return { id: updatedItem.Attributes.id.S, updatedPrice: updatedItem.Attributes.price.N };
    } else {
      // Insert a new item
      const putItemParams = {
        TableName: 'inventoryTable',
        Item: {
          id: { S: itemId },
          name: { S: name },
          category: { S: category },
          price: { N: formattedPrice },
          last_updated_dt: { S: lastUpdatedDt },
        },
      };

      const putItemCommand = new PutItemCommand(putItemParams);
      await dynamoDBClient.send(putItemCommand);

      return { id: itemId, updatedPrice: formattedPrice };
    }
  } catch (error) {
    console.error('Error inserting/updating item:', error);
    throw error;
  }
}

// Example usage
const request = {
  name: 'key chain',
  category: 'Gift',
  price: '1.5', // New price for the existing item
};

insertOrUpdateItem(request)
  .then(response => {
    console.log('Item inserted/updated successfully. ID:', response.id, 'Updated Price:', response.updatedPrice);
  })
  .catch(error => {
    console.error('Error:', error);
  });