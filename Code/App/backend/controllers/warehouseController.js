const pool = require('../db');

const warehouseController = {
    // This method gets the location and the id of the base of a certain admin
    getBase: async (req, res) => {
        const { admin } = req.params;
        console.log('Received request for admin:', admin);
        try {
            const [rows] = await pool.query('SELECT latitude, longitude FROM Base WHERE admin = UUID_TO_BIN(?)', [admin]);
            if (rows.length === 0 ) {
                console.log('Base not found');
                return res.status(404).json({ message: 'Base not found' });
            }
            const base = rows[0];
            console.log('Base location:', base);
            res.json(base);
        } catch (error) {
            console.error('Server error:', error);}
        },
    };

    module.exports = warehouseController;
    
    
    