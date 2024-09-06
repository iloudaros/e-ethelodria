const pool = require('../db');

const userController = {
  // The method to handle user login
  login: async (req, res) => {
    const { username, password } = req.body;
    try {
      console.log('Received login request for:', username);
      const [rows] = await pool.query('SELECT * FROM User WHERE username = ?', [username]);
      if (rows.length === 0) {
        console.log('User not found');
        const [users] = await pool.query('SELECT username FROM User LIMIT 5');
        const usernames = users.map(user => user.username);
        return res.status(404).json({ message: 'User not found', usernames });
      }

      const user = rows[0];
      if (password !== user.password) {
        console.log('Invalid password');
        const [users] = await pool.query('SELECT username FROM User LIMIT 5');
        const usernames = users.map(user => user.username);
        return res.status(401).json({ message: 'Invalid password', usernames });
      }

      console.log('Login successful');
      res.json({ message: 'Login successful', user });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  },
  // The method that lets us save the new location of a user
  saveLocation: async (req, res) => {
    const { username, latitude, longitude } = req.body;
    try {
      console.log('Received location update request for:', username);
      const [rows] = await pool.query('SELECT * FROM User WHERE username = ?', [username]);
      if (rows.length === 0) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
      }
      await pool.query('UPDATE User SET latitude = ?, longitude = ? WHERE username = ?', [latitude, longitude, username]);
      console.log('Location updated');
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  },

  // The method that lets us get the location of a user
  getLocation: async (req, res) => {
    const { username } = req.params;
    try {
      console.log('Received location request for:', username);
      const [rows] = await pool.query('SELECT latitude, longitude FROM User WHERE username = ?', [username]);
      if (rows.length === 0) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
      }
      const { latitude, longitude } = rows[0];
      console.log('Location found:', latitude, longitude);
      res.json({ latitude, longitude });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  },

};

module.exports = userController;
