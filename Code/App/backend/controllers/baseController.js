const pool = require('../db');

const baseController = {
    // This method gets the location and the id of the base of a certain admin
    getBase: async (req, res) => {
        const { admin } = req.params;
        console.log('Received base location request for admin:', admin);
        try {
            const [rows] = await pool.query('SELECT hex(id) as id, latitude, longitude FROM Base WHERE admin = UUID_TO_BIN(?)', [admin]);
            console.log('Query executed successfully:', rows.length);
            if (rows.length === 0 ) {
                console.log('Base not found');
                return res.status(404).json({ message: 'Base not found' });
            }
            const base = rows[0];
            console.log('Base location:', base);
            res.json(base);
        } catch (error) {
            console.error('Server error:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    },

    updateLocation: async (req, res) =>{
        const {id, latitude, longitude} = req.body;
        console.log('Received location update request for:', id);
        try {
            await pool.query('UPDATE Base SET latitude = ?, longitude = ? WHERE id = UUID_TO_BIN(?)', [latitude, longitude, id]);
            console.log('Location updated');
            res.json({ message: 'Location updated' });
        } catch (error) {
            console.error('Server error:', error);
        }
    },

    getBases: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT hex(id) as id, latitude, longitude FROM Base');
            res.json(rows);
        } catch (error) {
            console.error('Server error:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    }
};

module.exports = baseController;