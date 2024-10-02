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

  signup: async (req, res) => {
    const { username, password, email, name, surname, telephone, } = req.body;
    try {
      console.log('Received signup request for:', username);
      const [rows] = await pool.query('SELECT * FROM User WHERE username = ?', [username]);
      if (rows.length > 0) {
        console.log('User already exists');
        return res.status(400).json({ message: 'User already exists' });
      }
      const [result] = await pool.query('INSERT INTO User (username, password, email, name, surname, telephone, longitude, latitude, is_citizen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [username, password, email, name, surname, telephone, 37.983810, 23.727539, true]);
      console.log('User created with ID:', result.insertId);
      res.status(201).json({ message: 'User created', id: result.insertId });
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
  },

  getRescuerTasks: async (req, res) => {
    const { id } = req.params;
    console.log('Received rescuer tasks request for ID:', id);
    try {
      const [rows] = await pool.query('SELECT hex(task) as id FROM Task_List WHERE id = UUID_TO_BIN(?)', [id]);
      console.log('Rescuer tasks:', rows);
      res.json(rows);
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  },

  createRescuerTask: async (req, res) => {
    const { rescuerId, taskId } = req.body;
    console.log('Received rescuer task delegation request for rescuer ID:', rescuerId, 'and task ID:', taskId);

    //get the id of the vehicle 
  
    // check if the vehicle exists and and the task to its task list
    try{
      const [rows] = await pool.query('SELECT hex(id) as id FROM Vehicle WHERE owner = UUID_TO_BIN(?)', [rescuerId]);
      vehicleId = rows[0].id;
      if (rows.length === 0) {
        console.log('Rescuer is not the owner of any vehicle');
        return res.status(404).json({ message: 'Vehicle not found' });
      }
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Server error', error });
    }

    console.log('Vehicle found:', vehicleId);

    try{
      const [rows] = await pool.query('SELECT * FROM Vehicle WHERE id = UUID_TO_BIN(?)', [vehicleId]);
      if (rows.length === 0) {
        console.log('Vehicle not found');
        return res.status(404).json({ message: 'Vehicle not found' });
      }
      await pool.query('INSERT INTO Task_List (id, task) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?))', [vehicleId, taskId]);
      console.log('Task delegated');
      res.json({ message: 'Task delegated' });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Server error', error });
    }

    // update the task state to "pending"
    try {
      await pool.query('UPDATE Task SET state = "pending" WHERE id = UUID_TO_BIN(?)', [taskId]);
      console.log('Task status updated to "pending"');
    } catch (error) {
      console.error('Server error:', error);
    }

    // add todays date to the field "accepted_in" of the task
    try {
      await pool.query('UPDATE Task SET accepted_in = CURDATE() WHERE id = UUID_TO_BIN(?)', [taskId]);
      console.log('Task accepted date updated');
        } catch (error) {
      console.error('Server error:', error);
    }
  

  }
  
};

module.exports = userController;
