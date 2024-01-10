const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({
  region: 'ap-southeast-1',
  credentials: {
    accessKeyId: 'AKIA47CRX2C4JZJE2YLT',
    secretAccessKey: 'NRvzD7HMs8F47Wl5GzveB8bgsdnLfHFGfyBRKzv1',
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