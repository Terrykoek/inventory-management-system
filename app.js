const AWS = require('aws-sdk');

// Update these with your AWS credentials and DynamoDB region
AWS.config.update({
  accessKeyId: 'YOUR_ACCESS_KEY',
  secretAccessKey: 'YOUR_SECRET_KEY',
  region: 'YOUR_REGION',
});

const dynamodb = new AWS.DynamoDB();

// Example: Listing tables
dynamodb.listTables({}, (err, data) => {
  if (err) {
    console.error('Error listing tables:', err);
  } else {
    console.log('Tables:', data.TableNames);
  }
});