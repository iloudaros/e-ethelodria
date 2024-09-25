const pool = require('../db');

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
    }

}

module.exports = requestController