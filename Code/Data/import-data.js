const mysql = require("mysql");
const util = require("util");
const data = require("../../data.json"); // The file where your JSON data is stored
const dbConfig = require("./config.json").database;

// Create a connection to the database
const connection = mysql.createConnection(dbConfig);

// Promisify the connection.query method to use async/await
const query = util.promisify(connection.query).bind(connection);

(async function runQueries() {
  try {
    await connection.connect();
    console.log("Connected to the MySQL server.");

    // Insert Categories
    for (const category of data.categories) {
      // Adjust the object keys to match the database column names
      const categoryToInsert = {
        id: category.id, // Assuming 'id' is correct
        name: category.category_name, // Change 'category_name' to 'name'
      };
      const result = await query(
        "INSERT INTO Category SET ?",
        categoryToInsert
      );
      console.log("Category inserted", result.insertId);
    }

    // Insert Products and Details
    for (const item of data.items) {
      // Adjust item properties to match your Product table column names
      const productToInsert = {
        // Assuming item has properties that match the Product table columns
        id: item.id,
        name: item.name,
        category: item.category,
      };
      const resultProduct = await query(
        "INSERT INTO Product SET ?",
        productToInsert
      );
      console.log("Product inserted", resultProduct.insertId);

      // Now insert each detail for the current item
      for (const detail of item.details) {
        // Map detail properties to the Details table column names
        const detailToInsert = {
          product: item.id, // Foreign key linking to the Product
          name: detail.detail_name, // Adjust the key if necessary
          value: detail.detail_value, // Adjust the key if necessary
        };
        const resultDetail = await query(
          "INSERT INTO Details SET ?",
          detailToInsert
        );
        console.log("Detail inserted", resultDetail.insertId);
      }
    }
  } catch (err) {
    console.error("An error occurred: " + err.message);
  } finally {
    connection.end();
  }
})();
