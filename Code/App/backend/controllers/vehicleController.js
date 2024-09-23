const pool = require('../db');
const { get } = require('../routes/vehicleRoutes');

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
    },

    getVehicleTasks: async (req, res) => {
        try {
            const { id } = req.params;
            console.log(`Fetching tasks for vehicle with id: ${id}`);
            const [rows] = await pool.query('SELECT task FROM Task_List WHERE vehicle_id = UUID_TO_BIN(?)', [id]);
            console.log(`Tasks fetched: ${rows.length}`);

            // 


            res.json(rows);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    }
  
};

module.exports = vehicleController;
