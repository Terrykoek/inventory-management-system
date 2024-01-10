const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({
  region: 'ap-southeast-1',
  credentials: {
    accessKeyId: 'YOUR_ACCESS_KEY',
    secretAccessKey: 'YOUR_SECRET_KEY',
  },
});

// Example: Listing tables
const command = new ListTablesCommand({});
client.send(command)
  .then(data => {
    console.log('Tables:', data.TableNames);
  })
  .catch(error => {
    console.error('Error listing tables:', error);
  });