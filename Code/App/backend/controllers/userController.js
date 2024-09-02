const pool = require('../db');

const userController = {
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
};

module.exports = userController;
