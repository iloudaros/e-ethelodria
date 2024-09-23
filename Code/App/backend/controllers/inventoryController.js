const pool = require('../db');

const inventoryController = {
    
    // This method gets all the products in any inventory
    getInventory: async (req, res) => {
        console.log('Received inventory request for everything');
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
    },
    
    getSingleInventory: async (req, res) => {
        const id = req.params.id;
        console.log('Received inventory request for id:', id);
        try {
            const [rows] = await pool.query('SELECT product, quantity FROM `Product_List` WHERE id = UUID_TO_BIN(?)', [id]);
            console.log('Query executed successfully. Inventory entries:', rows.length);
            
            // Add the product name from the Product table
            for (const row of rows) {
                const [product] = await pool.query('SELECT name FROM Product WHERE id = ?', [row.product]);
                row.product = product[0].name;
            }
            
            res.json(rows);
        } catch (error) {
            console.error('Server error:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    },
    
    // This method moves a product from one inventory to another
    moveProduct: async (req, res) => {
        var { sender, receiver, productId, amount } = req.body;
        console.log('Received moveProduct request for sender:', sender, 'receiver:', receiver, 'product:', productId, 'amount:', amount);
        if (sender=='Αποθήκη') sender = '4C7DA85B979211EEA1AC8C1645F10BCD';
        if (receiver=='Αποθήκη') receiver = '4C7DA85B979211EEA1AC8C1645F10BCD';
        try {
            // Check if the product exists in the source inventory
            const [rows] = await pool.query('SELECT quantity FROM `Product_List` WHERE id = UUID_TO_BIN(?) AND product = ?', [sender, productId]);
            if (rows.length === 0) {
                return res.status(404).json({ message: 'Product not found in the source inventory' });
            }
            const sourceQuantity = rows[0].quantity;
            if (amount > sourceQuantity) {
                return res.status(400).json({ message: 'Not enough quantity in the source inventory' });
            }
            // Update the source inventory
            await pool.query('UPDATE `Product_List` SET quantity = quantity - ? WHERE id = UUID_TO_BIN(?) AND product = ?', [amount, sender, productId]);
            // If the quantity reaches 0, delete the product from the inventory
            if (sourceQuantity - amount === 0) {
                await pool.query('DELETE FROM `Product_List` WHERE id = UUID_TO_BIN(?) AND product = ?', [sender, productId]);
            }

            // Check if the product exists in the destination inventory
            const [rows2] = await pool.query('SELECT quantity FROM `Product_List` WHERE id = UUID_TO_BIN(?) AND product = ?', [receiver, productId]);
            if (rows2.length === 0) {
                // If the product does not exist in the destination inventory, add it
                await pool.query('INSERT INTO `Product_List` (id, product, quantity) VALUES (UUID_TO_BIN(?), ?, ?)', [receiver, productId, amount]);
            }
            else {
                // If the product exists in the destination inventory, update the quantity
                await pool.query('UPDATE `Product_List` SET quantity = quantity + ? WHERE id = UUID_TO_BIN(?) AND product = ?', [amount, receiver, productId]);
            }

        } catch (error) {
            console.error('Server error:', error);
            res.status(500).json({ message: 'Server error', error });
        }
        // Send a response back to the client containing the updated inventory
        res.json({ message: 'Product moved successfully' });
        
    },
    
    // This method changes the quantity of a product in the inventory
    changeQuantity: async (req, res) => {
        const { id, productId, quantity } = req.body;
        console.log('Received changeQuantity request for id:', id, 'product:', productId, 'quantity:', quantity);
        try {
            // Check if the product exists in the inventory
            const [rows] = await pool.query('SELECT quantity FROM `Product_List` WHERE id = UUID_TO_BIN(?) AND product = ?', [id, productId]);
            if (rows.length === 0) {
                return res.status(404).json({ message: 'Product not found in the inventory' });
            }
            // Update the quantity of the product
            await pool.query('UPDATE `Product_List` SET quantity = ? WHERE id = UUID_TO_BIN(?) AND product = ?', [quantity, id, productId]);
            // If the quantity reaches 0, delete the product from the inventory
            if (quantity === 0) {
                await pool.query('DELETE FROM `Product_List` WHERE id = UUID_TO_BIN(?) AND product = ?', [id, productId]);
            }
        } catch (error) {
            console.error('Server error:', error);
            res.status(500).json({ message: 'Server error', error });
        }
        res.json({ message: 'Quantity changed successfully' });
    }
    
};

module.exports = inventoryController;