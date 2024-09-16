const pool = require('../db');

const vehicleController = {

    // This method returns all the vehicles that are in the database
    getVehicles: async (req, res) => {
        try {
            console.log('Fetching vehicles...');
            const [rows] = await pool.query('SELECT hex(id) as id, username, hex(owner) as owner, latitude, longitude, state FROM Vehicle');
            console.log('Vehicles fetched:', rows.length);
            res.json(rows);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    }
  
};

module.exports = vehicleController;
