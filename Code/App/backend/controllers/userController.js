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
  },

  // This method returns all the rescuers
  getRescuers: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT hex(id) as id, name, surname, telephone, password FROM User WHERE is_diasostis = 1');
      res.json(rows);
    } catch (error) {
      console.error('Server error:', error);
    }
  },

  // This method lets us create a new rescuer
  createRescuer: async (req, res) => {
    const {username, name, surname, telephone, password } = req.body;
    try {
      const [rows] = await pool.query('SELECT * FROM User WHERE username = ?', [username]);
      if (rows.length > 0 ) {
        console.log('User already exists');
        return res.status(400).json({ message: 'User already exists' });
      }
      const [result] = await pool.query('INSERT INTO User (username , name, surname, telephone, password, is_diasostis) VALUES (?, ?, ?, ?, ?, 1)', [username, name, surname, telephone, password]);
      console.log('Rescuer created with ID:', result.insertId);
      res.status(201).json({ message: 'Rescuer created', id: result.insertId });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  },

  resetPassword: async (req, res) => {
    const { password } = req.body;
    const { id } = req.params;

    console.log('Received password reset request for ID:', id);
    try {
      const [rows] = await pool.query('SELECT * FROM User WHERE id = UUID_TO_BIN(?)', [id]);
      if (rows.length === 0) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
      }
      await pool.query('UPDATE User SET password = ? WHERE id = UUID_TO_BIN(?)', [password, id]);
      console.log('Password reset');
      res.json({ message: 'Password reset' });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  },

  deleteUser: async (req, res) => {
    const { id } = req.params;

    console.log('Received delete request for ID:', id);
    try {
      const [rows] = await pool.query('SELECT * FROM User WHERE id = UUID_TO_BIN(?)', [id]);
      if (rows.length === 0) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
      }
      await pool.query('DELETE FROM User WHERE id = UUID_TO_BIN(?)', [id]);
      console.log('User deleted');
      res.json({ message: 'User deleted' });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }

  
};

module.exports = userController;
