const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

const offerController = {
    
    // Method to return all the offers into the db
    getoffers: async (req, res) =>{
        try {
            console.log('Fetching offers...');
            const [rows] = await pool.query('SELECT hex(id) as id, hex(user_id) as user, date_in, accepted_in, date_out, state, type FROM Task where type = "offering"');
            // Add the corresponding user's location to each offer
            const offersWithUsers = await Promise.all(rows.map(async (offer) => {
                const [userRow] = await pool.query('SELECT latitude, longitude, name, surname, telephone FROM User WHERE id = UUID_TO_BIN(?)', [offer.user]);
                return {
                    ...offer,
                    userLocation: {
                        latitude: userRow[0].latitude,
                        longitude: userRow[0].longitude
                    },
                    userName: userRow[0].name + ' ' + userRow[0].surname,
                    userTelephone: userRow[0].telephone
                };
            }));
            console.log('offers fetched:', offersWithUsers.length);
            res.json(offersWithUsers);
        } catch (error) {
            console.error('Error fetching offers:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    },
    
    // Method to get the offers of a specific user
    getOffersByUser: async (req, res) =>{
        try {
            const userId = req.params.userId;
            const [rows] = await pool.query('SELECT hex(id) as id, hex(user_id) as user, date_in, accepted_in, date_out, state, type FROM Task where user_id = UUID_TO_BIN(?) and type = "offering"', [userId]);
            console.log('Offers fetched:', rows.length);
            
            // Add the products and the quantities found in the table Product_List and for each product add its name found in the table Product
            const offersWithProducts = await Promise.all(rows.map(async (offer) => {
                const [productRows] = await pool.query('SELECT product, quantity FROM Product_List WHERE id = UUID_TO_BIN(?)', [offer.id]);
                console.log('Products fetched:', productRows.length);
                // for each product in productRows, get the name of the product from the table Product
                for (const product of productRows) {
                    const [productRow] = await pool.query('SELECT name FROM Product WHERE id = ?', [product.product]);
                    product.name = productRow[0].name;
                }
                return {
                    ...offer,
                    products: productRows
                };


            }));
            
            res.json(offersWithProducts);
            
        }
        catch (error) {
            console.error('Error fetching offers:', error);
            res.status(500).json({ message: 'Server error', error });
        }
        
        
    },
    
    
    // Method to create a new offer
    createOffer: async (req, res) => {
        try {
            const { user, products } = req.body;
            const uuid = uuidv4();

            console.log('Creating offer:', { user, products });
            
            const [result] = await pool.query('INSERT INTO Task (id, user_id, date_in, state, type) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), NOW(), "published", "offering")', [uuid, user]);
            
            // Insert the products into the Product_List table
            for (const product of products) {
                const [productResult] = await pool.query('INSERT INTO Product_List (id, product, quantity) VALUES (UUID_TO_BIN(?), ?, ?)', [uuid, product.product, product.quantity]);
            }
            //
            res.status(201).json({ message: 'offer created successfully' });
        } catch (error) {
            console.error('Error creating offer:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    },
    
    
    // Method to delete a offer
    deleteOffer: async (req, res) => {
        try {
            const { offerId } = req.params;
            console.log('Deleting offer with id:', offerId);
            // Delete the offer from the Task table
            const [result] = await pool.query('DELETE FROM Task WHERE id = UUID_TO_BIN(?)', [offerId]);
            // Delete the products from the Product_List table
            const [productResult] = await pool.query('DELETE FROM Product_List WHERE id = UUID_TO_BIN(?)', [offerId]);   
            res.status(200).json({ message: 'offer deleted successfully' });
        } catch (error) {
            console.error('Error deleting offer:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    }
    
    
    
}

module.exports = offerController