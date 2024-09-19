const pool = require('../db');

const inventoryController = {
    
    // This method gets all the products in any inventory
    getInventory: async (req, res) => {
        console.log('Received inventory request for warehouse');
        try {
            const [rows] = await pool.query('SELECT hex(id) as id, product, quantity FROM `Product_List`');
            console.log('Query executed successfully. Inventory entries:', rows.length);
            
            // Filter rows to include only those that belong to a base or a vehicle
            const validRows = [];
            for (const row of rows) {
                const [base] = await pool.query('SELECT * FROM Base WHERE id = UUID_TO_BIN(?)', [row.id]);
                const [vehicle] = await pool.query('SELECT * FROM Vehicle WHERE id = UUID_TO_BIN(?)', [row.id]);
                if (base.length > 0) {
                    row.location = 'Base';
                    validRows.push(row);
                } else if (vehicle.length > 0) {
                    row.location = vehicle[0].username;
                    validRows.push(row);
                } else {
                    //console.log('Invalid row:', row);
                }
            }
            
            // Add the product name and category to each row from the Product and Category tables
            for (const row of validRows) {
                const [product] = await pool.query('SELECT * FROM Product WHERE id = ?', [row.product]);
                const [category] = await pool.query('SELECT name FROM Category WHERE id = ?', [product[0].category]);
                row.product = product[0].name;
                row.category = category[0].name;
                row.productId = product[0].id;
                row.categoryId = product[0].category;
            }
            console.log('Query executed successfully. Valid Rows:', validRows.length);
            res.json(validRows);
        } catch (error) {
            console.error('Server error:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    }
    
};

module.exports = inventoryController;