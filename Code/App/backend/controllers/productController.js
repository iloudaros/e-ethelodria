const pool = require('../db');

const productController = {
    // This method returns all the products allong with their details
    getProducts : async (req, res) => {
        console.log("Received request for all products");
        
        // Query the database to get all products
        const [rows] = await pool.query('SELECT * FROM Product');
        
        // For each product, get the category name
        const products = await Promise.all(rows.map(async (product) => {
            const [category] = await pool.query('SELECT name FROM Category WHERE id = ?', [product.category]);
            return { ...product, category: category[0].name };
        }));
        
        // For each product, get all the details from the Details table
        const productsWithDetails = await Promise.all(products.map(async (product) => {
            const [details] = await pool.query('SELECT * FROM Details WHERE product = ?', [product.id]);
            return { ...product, details };
        }));
        
        // Return the products with their details
        console.log(`Returning products with details for ${productsWithDetails.length} products`);
        res.json(productsWithDetails);
    },
    
    // This method adds a new product to the database
    addProduct : async (req, res) => {
        console.log("Received request to add a new product");

        // Get the product details from the request body
        const { name, category, details } = req.body;

        // Insert the product into the database
        const [result] = await pool.query('INSERT INTO Product (name, category) VALUES (?, ?)', [name, category]);
        const productId = result.id;

        // Insert the details into the database
        const detailPromises = details.map(async (detail) => {
            const [result] = await pool.query('INSERT INTO Details (product, name, value) VALUES (?, ?, ?)', [productId, detail.name, detail.value]);
            return result.id;
        });
    },
    
    // This method updates an existing product in the database
    updateProduct : async (req, res) => {
        console.log("Received request to update a product");

        // Get the product details from the request body
        const { name, category, details } = req.body;

        // Update the product in the database
        await pool.query('UPDATE Product SET name = ?, category = ? WHERE id = ?', [name, category, req.params.id]);

        // Update the details in the database
        await pool.query('DELETE FROM Details WHERE product = ?', [req.params.id]);
        const detailPromises = details.map(async (detail) => {
            const [result] = await pool.query('INSERT INTO Details (product, name, value) VALUES (?, ?, ?)', [req.params.id, detail.name, detail.value]);
            return result.id;
        });
        
    },
    
    // This method deletes a product from the database
    deleteProduct : async (req, res) => {
        console.log("Received request to delete a product");

        // Delete the product from the database
        await pool.query('DELETE FROM Product WHERE id = ?', [req.params.id]);

        // Delete the details from the database
        await pool.query('DELETE FROM Details WHERE product = ?', [req.params.id]);
        
    },
    
    // This method returns all the categories
    getCategories : async (req,res) => {
        console.log("Received request for all categories");

        // Query the database to get all categories
        const [rows] = await pool.query('SELECT * FROM Category');
        
    },
    
    // This method adds a new category to the database
    addCategory : async (req, res) => {
        console.log("Received request to add a new category");

        // Get the category name from the request body
        const { name } = req.body;

        // Insert the category into the database
        const [result] = await pool.query('INSERT INTO Category (name) VALUES (?)', [name]);
        
    },
    
    // This method updates an existing category in the database
    updateCategory : async (req, res) => {
        console.log("Received request to update a category");

        // Get the category name from the request body
        const { name } = req.body;
        
        // Update the category in the database
        await pool.query('UPDATE Category SET name = ? WHERE id = ?', [name, req.params.id]);
        
    }
};

module.exports = productController;


