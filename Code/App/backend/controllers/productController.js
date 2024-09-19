const pool = require('../db');
const axios = require('axios'); 


const productController = {
    // This method returns all the products allong with their details
    getProducts : async (req, res) => {
        console.log("Received request for all products");
        
        // Query the database to get all products
        const [rows] = await pool.query('SELECT * FROM Product');
        
        // For each product, get the category name
        const products = await Promise.all(rows.map(async (product) => {
            const [category] = await pool.query('SELECT name FROM Category WHERE id = ?', [product.category]);
            return { ...product, category: category[0].name , categoryId: product.category};
        }));
        
        // For each product, get all the details from the Details table
        const productsWithDetails = await Promise.all(products.map(async (product) => {
            const [details] = await pool.query('SELECT * FROM Details WHERE product = ?', [product.id]);
            return { ...product, details };
        }));
        
        // Return the products with their details
        console.log(`Returning products with details for ${productsWithDetails.length} products`);
        console.log('Sample:');
        console.log(productsWithDetails[0]);
        res.json(productsWithDetails);
    },
    
    // This method adds a new product to the database
    addProduct : async (req, res) => {
        console.log("Received request to add a new product");
        
        // Get the product details from the request body
        const { name, category, details } = req.body;
        try{
            // Insert the product into the database
            const [result] = await pool.query('INSERT INTO Product (name, category) VALUES (?, ?)', [name, category]);
            const productId = result.insertId;
            console.log(result);
            
            // Insert the details into the database
            const detailPromises = details.map(async (detail) => {
                const [result] = await pool.query('INSERT INTO Details (product, name, value) VALUES (?, ?, ?)', [productId, detail.name, detail.value]);
            });
            res.status(200).json({ message: 'Product added successfully' });
        } catch (error) {
            console.error('Error adding product:', error);
            res.status(500).json({ message: 'Error adding product', error });
        }
    },
    
    // This method updates an existing product in the database
    updateProduct : async (req, res) => {
        console.log("Received request to update a product");
        
        // Get the product details from the request body
        const { id, name, category, categoryId, details } = req.body;
        console.log(id, name, category, details);
        
        // Update the product in the database
        await pool.query('UPDATE Product SET name = ?, category = ? WHERE id = ?', [name, categoryId, id]);
        
        // Update the details in the database
        await pool.query('DELETE FROM Details WHERE product = ?', [id]);
        const detailPromises = details.map(async (detail) => {
            const [result] = await pool.query('INSERT INTO Details (product, name, value) VALUES (?, ?, ?)', [id, detail.name, detail.value]);
            return result.id;
        });
        
        res.status(200).json({ message: 'Product updated successfully' });
        
    },
    
    // This method deletes a product from the database
    deleteProduct : async (req, res) => {
        const productId = req.params.id;
        console.log("Received request to delete a product", productId);
        
        try {
            // Delete the details from the database
            await pool.query('DELETE FROM Details WHERE product = ?', [req.params.id]);
            // Delete the product from the database
            await pool.query('DELETE FROM Product WHERE id = ?', [req.params.id]);
            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ message: 'Error deleting product', error });
        }
        
    },
    
    // This method returns all the categories
    getCategories : async (req,res) => {
        console.log("Received request for all categories");
        
        // Query the database to get all categories
        const [rows] = await pool.query('SELECT * FROM Category');
        
        res.json(rows);
        
    },
    
    // This method adds a new category to the database
    addCategory : async (req, res) => {
        console.log("Received request to add a new category");
        
        // Get the category name from the request body
        const {name}  = req.body;
        console.log(name);

        
        // Insert the category into the database
        try {
            await pool.query('INSERT INTO Category (name) VALUES (?)', name);
            res.status(200).json({ message: 'Category added successfully' });
        } catch (error) {
            console.error('Error adding category:', error);
            res.status(500).json({ message: 'Error adding category', error });
        }
    },
    
    // This method updates an existing category in the database
    updateCategory : async (req, res) => {
        console.log("Received request to update a category");
        
        // Get the category name from the request body
        const {id, name } = req.body;
        console.log(id, name);
        
        // Update the category in the database
        try {
            await pool.query('UPDATE Category SET name = ? WHERE id = ?', [name, id]);
            res.status(200).json({ message: 'Category updated successfully' });
        }
        catch (error) {
            console.error('Error updating category:', error);
            res.status(500).json({ message: 'Error updating category', error });
        }
    },
    
    // This method deletes a category from the database
    deleteCategory : async (req, res) => {
        // Get the category id from the request parameters
        const categoryId = req.params.categoryId;
        
        console.log("Received request to delete a category", categoryId);
        
        
        
        // Delete the category from the database. In case of an error, the error is caught and logged
        try {
            await pool.query('DELETE FROM Category WHERE id = ?', [categoryId]);
            res.status(200).json({ message: 'Category deleted successfully' });
        } catch (error) {
            console.error('Error deleting category:', error);
            res.status(500).json({ message: 'Error deleting category', error });
        }
    },
    
    // This method imports Products, Product details and Categories from a json file provided from the front-end, into the database
    importProducts: async (req, res) => {
        console.log('Received request to import products');
        const products = req.body.items;
        const categories = req.body.categories;
        console.log('Received products:', products);
        console.log('Received categories:', categories);

        batchInsert(categories, products)
        .then(() => {
            res.status(200).json({ message: 'Everything imported successfully' });
        })
        .catch((error) => {
            console.error('Error importing products:', error);
            res.status(500).json({ message: 'Error importing products', error });
        });

    },
    
    // This method downloads a json file provided by http://usidas.ceid.upatras.gr/web/2023/export.php and then imports Products, Product details and Categories from that fiel, into the database
    syncWithCeid: async (req, res) => {
        console.log('Received request to sync with CEID');
        const url = 'http://usidas.ceid.upatras.gr/web/2023/export.php';
        try {
            const response = await axios.get(url);
            const data = response.data;

            console.log('Received data from CEID:');
            console.log(data);
            const products = data.items;
            console.log('Received products. Samlpe:', products[0]);
            const categories = data.categories;
            console.log('Received categories. Sample:', categories[0]);

            batchInsert(categories, products)
            .then(() => {
                res.status(200).json({ message: 'Everything imported successfully' });
            })
            .catch((error) => {
                console.error('Error importing products:', error);
                res.status(500).json({ message: 'Error importing products', error });
            });

        } catch (error) {
            console.error('Server error:', error)
            res.status(500).json({ message: 'Server error', error });
        }

    }
    
};

async function batchInsert(categories, products) {
    // Insert categories into the database
    for (const category of categories) {
        const [existingCategory] = await pool.query('SELECT * FROM Category WHERE id = ?', [category.id]);
        if (existingCategory.length > 0) {
            console.log('Category already exists:', category.category_name);
            continue;
        }
        const [newCategory] = await pool.query('INSERT INTO Category (id, name) VALUES (?,?)', [category.id, category.category_name]);
        console.log('New category inserted:', newCategory);
    }
    console.log('Categories imported successfully');

    // Insert products into the database
    for (const product of products) {
        const [existingProduct] = await pool.query('SELECT * FROM Product WHERE id = ?', [product.id]);
        // Check if the product already exists in the database
        if (existingProduct.length > 0) {
            console.log('Product already exists:', product.name);
            continue;
        }
        // Check if the category exists in the database
        const [category] = await pool.query('SELECT * FROM Category WHERE id = ?', [product.category]);
        if (category.length === 0) {
            console.log('Category does not exist:', product.category);
            continue;
        }
        // Check if the product has empty name or category, if so, skip the product
        if (product.name === '' || product.category === '') {
            console.log('Product has empty name or category, skipping:', product.name);
            continue;
        }
        const [newProduct] = await pool.query('INSERT INTO Product (id, name, category) VALUES (?, ?, ?)', [product.id, product.name, product.category]);
        console.log('New product inserted:', newProduct);

        // Insert product details into the database
        const productDetails = product.details;
        console.log('Received product details:', productDetails);
        for (const detail of productDetails) {
            // if both the name and the value are not empty, insert the detail into the database
            if (detail.detail_name !== '' || detail.detail_value !== '') {
            const [newDetail] = await pool.query('INSERT INTO Details (product, name, value) VALUES (?, ?, ?)', [product.id, detail.detail_name, detail.detail_value]);
            console.log('New detail inserted:', newDetail);
            }
        }
        console.log('Product details imported successfully');                
    }
    console.log('Products imported successfully');
}

module.exports = productController;


