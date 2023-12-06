const mysql = require("mysql");
const util = require("util");
const data = require("../../data.json"); // The file where your JSON data is stored
const dbConfig = require("../../config.json").database;

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
      const insertCategoryQuery =
        "INSERT INTO Category (id, name) VALUES (?, ?)";
      await query(insertCategoryQuery, [category.id, category.category_name]);
    }

    // Insert Products and their Details
    for (const item of data.items) {
      const insertProductQuery =
        "INSERT INTO Product (id, name, category) VALUES (?, ?, ?)";
      await query(insertProductQuery, [item.id, item.name, item.category]);

      for (const detail of item.details) {
        const insertDetailQuery =
          "INSERT INTO Details (product, name, value) VALUES (?, ?, ?)";
        await query(insertDetailQuery, [
          item.id,
          detail.detail_name,
          detail.detail_value,
        ]);
      }
    }

    console.log("Data imported successfully.");
  } catch (err) {
    console.error("An error occurred: " + err.message);
  } finally {
    connection.end();
  }
})();
