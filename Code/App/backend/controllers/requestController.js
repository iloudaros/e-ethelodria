const pool = require('../db');

const requestController = {

    // Method to return all the requests into the db
    getRequests: async (req, res) =>{
        try {
            console.log('Fetching requests...');
            const [rows] = await pool.query('SELECT hex(id) as id, hex(user_id) as user, date_in, accepted_in, date_out, state, type FROM Task where type = "request"');
            // Add the corresponding user's location to each request
            const requestsWithUsers = await Promise.all(rows.map(async (request) => {
                const [userRow] = await pool.query('SELECT latitude, longitude FROM User WHERE id = UUID_TO_BIN(?)', [request.user]);
                return {
                    ...request,
                    userLocation: userRow[0]
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