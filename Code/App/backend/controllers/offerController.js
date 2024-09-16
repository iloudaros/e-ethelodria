const pool = require('../db');

const offerController = {

    // Method to return all the offers into the db
    getoffers: async (req, res) =>{
        try {
            console.log('Fetching offers...');
            const [rows] = await pool.query('SELECT hex(id) as id, hex(user_id) as user, date_in, accepted_in, date_out, state, type FROM Task where type = "offering"');
            // Add the corresponding user's location to each offer
            const offersWithUsers = await Promise.all(rows.map(async (offer) => {
                const [userRow] = await pool.query('SELECT latitude, longitude FROM User WHERE id = UUID_TO_BIN(?)', [offer.user]);
                return {
                    ...offer,
                    userLocation: userRow[0]
                };
            }));
            console.log('offers fetched:', offersWithUsers.length);
            res.json(offersWithUsers);
        } catch (error) {
            console.error('Error fetching offers:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    }

}

module.exports = offerController