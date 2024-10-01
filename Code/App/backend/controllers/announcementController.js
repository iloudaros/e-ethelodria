const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

const announcementController = {
    
    // Method to return all the announcements of the db
    getAllAnnouncements: async (req, res) => {
        let rows;
        try {
            [rows] = await pool.query('SELECT hex(id) as id, published_in, text FROM Announcement');
            console.log('ANNOUNCEMENTS');
            console.log(rows.length);
            
        } catch (error) {
            console.error('Error fetching announcements:', error);
            return res.status(500).json({ message: 'Server error', error });
        }
        
        // Also add the Product_List of each announcement
        try {
            const productListPromises = rows.map(async (row) => {
                const [productList] = await pool.query('SELECT product, quantity FROM Product_List WHERE id = UUID_TO_BIN(?)', [row.id]);
                row.productList = productList;
            });
            await Promise.all(productListPromises);
        } catch (error) {
            console.error('Error fetching product lists:', error);
            return res.status(500).json({ message: 'Server error', error });
        }

        // For every announcement's product list, find the names of the products from the product table and add them
        try {
            const productNamesPromises = rows.map(async (row) => {
                const productNames = await Promise.all(row.productList.map(async (product) => {
                    const [productName] = await pool.query('SELECT name FROM Product WHERE id = ?', [product.product]);
                    return productName[0].name;
                }));
                row.productList = row.productList.map((product, index) => ({
                    ...product,
                    name: productNames[index]
                }));
            });
            await Promise.all(productNamesPromises);
        } catch (error) {
            console.error('Error fetching product names:', error);
            return res.status(500).json({ message: 'Server error', error });
        }

        res.json(rows);
    },
        
    // Method to create a new announcement
    createAnnouncement: async (req, res) => {
        const { text, products } = req.body;
        try {
            const announcementId = uuidv4();

            // Insert the announcement text and today's date, then get the announcement ID
            const [result] = await pool.query('INSERT INTO Announcement (id, text, published_in) VALUES (UUID_TO_BIN(?), ?, CURDATE())', [announcementId, text]);
            
            const productInsertPromises = products.map(({ product, quantity }) => 
                pool.query('INSERT INTO Product_List (id, product, quantity) VALUES (UUID_TO_BIN(?), ?, ?)', [announcementId, product, quantity])
            );
            await Promise.all(productInsertPromises);

            res.status(201).json({ message: 'Announcement created successfully' });
        } catch (error) {
            console.error('Error creating announcement:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    }
}

module.exports = announcementController;
