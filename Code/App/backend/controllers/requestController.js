const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

const requestController = {
    
    // Method to return all the requests into the db
    getRequests: async (req, res) =>{
        try {
            console.log('Fetching requests...');
            const [rows] = await pool.query('SELECT hex(id) as id, hex(user_id) as user, date_in, accepted_in, date_out, state, type FROM Task where type = "request"');
            // Add the corresponding user's location, name and phone number to each request
            const requestsWithUsers = await Promise.all(rows.map(async (request) => {
                const [userRow] = await pool.query('SELECT latitude, longitude, name, surname, telephone FROM User WHERE id = UUID_TO_BIN(?)', [request.user]);
                return {
                    ...request,
                    userLocation: {
                        latitude: userRow[0].latitude,
                        longitude: userRow[0].longitude
                    },
                    userName: userRow[0].name + ' ' + userRow[0].surname,
                    userTelephone: userRow[0].telephone
                };
                
            }));
            console.log('Requests fetched:', requestsWithUsers.length);
            res.json(requestsWithUsers);
        } catch (error) {
            console.error('Error fetching requests:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    },
    
    // Method to get the requests of a specific user
    getRequestsByUser: async (req, res) =>{
        try {
            const userId = req.params.userId;
            const [rows] = await pool.query('SELECT hex(id) as id, hex(user_id) as user, date_in, accepted_in, date_out, state, type FROM Task where user_id = UUID_TO_BIN(?) and type = "request"', [userId]);
            console.log('Requests fetched:', rows);
            
            // Add the products and the quantities found in the table Product_List, along with their names found in the table Product
            const requestsWithProducts = await Promise.all(rows.map(async (request) => {
                const [productRows] = await pool.query('SELECT product, quantity FROM Product_List WHERE id = UUID_TO_BIN(?)', [request.id]);
                console.log('Products fetched:', productRows.length);
                const [productNames] = await pool.query('SELECT name FROM Product WHERE id = ?', [productRows[0].product]);
                return {
                    ...request,
                    products: productRows.map(product => ({
                        product: product.product,
                        quantity: product.quantity,
                        name: productNames[0].name
                    }))
                }
            }));
            
            res.json(requestsWithProducts);
            
        }
        catch (error) {
            console.error('Error fetching requests:', error);
            res.status(500).json({ message: 'Server error', error });
        }
        
        
    },
    
    // Method to create a new request
    createRequest: async (req, res) => {
        try {
            const { user, products } = req.body;
            const uuid = uuidv4();
            
            const [result] = await pool.query('INSERT INTO Task (id, user_id, date_in, state, type) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), NOW(), "published", "request")', [uuid, user]);
            
            // Insert the products into the Product_List table
            for (const product of products) {
                const [productResult] = await pool.query('INSERT INTO Product_List (id, product, quantity) VALUES (UUID_TO_BIN(?), ?, ?)', [uuid, product.product, product.quantity]);
                console.log('Product inserted:', productResult);
            }
            //
            res.status(201).json({ message: 'Request created successfully' });
        } catch (error) {
            console.error('Error creating request:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    },

    // Method to delete a request
    deleteRequest: async (req, res) => {
        try {
            const { id } = req.params;
            console.log('Deleting request with id:', id);
            // Delete the request from the Task table
            const [result] = await pool.query('DELETE FROM Task WHERE id = UUID_TO_BIN(?)', [id]);
            // Delete the products from the Product_List table
            const [productResult] = await pool.query('DELETE FROM Product_List WHERE id = UUID_TO_BIN(?)', [id]);   
            res.status(200).json({ message: 'Request deleted successfully' });
        } catch (error) {
            console.error('Error deleting request:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    }
    
}

module.exports = requestController