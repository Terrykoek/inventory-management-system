## Inventory management system

## Tools used
1. Node.JS
2. AWS DynamoDB
3. Jest for unit test

## Instructions for local setup

1. Clone the project
2. Configure AWS Credentials

    Add your AWS Credentials in .env file 
    ```sh
    AWS_ACCESS_KEY_ID=your-access-key-id

    AWS_SECRET_ACCESS_KEY=your-secret-access-key
    ```

    Replace your region in db.config.js if required
    ```sh
    region=your-aws-region
    ```

    Else, you can contact me for my AWS credentials which i am happy to share (PS: i'm not able to share via github as Github and AWS will chase me to remove)

3. Create a DynamoDB table in AWS

    Create a table in your AWS DynamoDB console with the following specifications:

    e.g

    Table Name: inventoryTable

    | name (String)(Partition key) | category (String) | id (String) | last_updated_dt(String) | price(String) |
    | ---------| ---------| ---------| ---------| ---------|
    | notebook  | Stationary | 37180ccd-fe08-47b2-967b-b68b34dca7a5 | 2024-01-12T14:08:07.169Z | 5.12 |


4. Install Dependencies

    ```sh
    npm install 
    ```

5. Run project locally

    To run the project locally:

    ```sh
    node index.js
    ```

    To run unit test:

    ```sh
    npm test
    ```

6. Test all 3 functions with Postman

    Task 1: Create a function to insert a new item. If re-inserting an item with the same name, the record should be updated with the new price. The record should include a "last_updated_dt" field to indicate the date of insertion/update. The "price" should be stored as a string and formatted with two decimal places in the database. Return the server-assigned ID for the newly created item; the server-assigned ID can also be a UUID.

    To Create or Update Inventory Item

    POST http://localhost:8000/api/inventory

    Request Body Example:
    ```sh
    {
    "name": "Notebook",
    "category": "Stationary",
    "price": "5.5"
    }
    ```

    Task 2: By passing a date range as a filter, query all the items with the "last_updated_dt" within the specified date range. The response should include an additional field indicating the total price of all the items.
    
    To Get Inventory Items by Date Range

    POST http://localhost:8000/api/inventory/date-range

    Request Body Example:
    ```sh
    {
    "dt_from": "2022-01-01 10:00:00",
    "dt_to": "2022-01-25 10:00:00"
    }
    ```

    Task 3: Perform aggregation on the data by passing in a category. Return items by category along with the total price in the response format below. If the category "all" is passed, it should return all categories; otherwise, it should return items belonging to that category.
    
    To Get Inventory Items by Category

    POST http://localhost:8000/api/inventory/category

    Request Body Example:
    ```sh
    {
    "category": "all"
    }
    or
    {
    "category": "Gift"
    }
    ```

    Additional function for checking all items in table: 
    
    To Get all items from inventoryTable

    GET http://localhost:8000/api

    View the respective responses in postman

    Run unit test to test the functions