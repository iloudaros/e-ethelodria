const pool = require('../db');

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
    }

}

module.exports = offerController