const pool = require('../db');

const userController = {
  // The method to handle user login
  login: async (req, res) => {
    const { username, password } = req.body;
    try {
      console.log('Received login request for:', username);
      const [rows] = await pool.query('select hex(id) as id, username, password, email, telephone, name, surname, longitude, latitude, is_admin, is_diasostis, is_citizen  from User where username = ?', [username]);
      if (rows.length === 0) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found'});
      }
      
      const user = rows[0];

      if (password !== user.password) {
        console.log('Invalid password');
        return res.status(401).json({ message: 'Invalid password'});
      }

      console.log('Login successful', user);
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

  // The method that lets us get the information of a user
  getUserInfo: async (req, res) => {
    const { username } = req.params;
    try {
      console.log('Received user request for:', username);
      const [rows] = await pool.query('SELECT * FROM User WHERE username = ?', [username]);
      if (rows.length === 0) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
      }
      const user = rows[0];
      console.log('User found:', user);
      res.json(user);
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }
  
};

module.exports = userController;
