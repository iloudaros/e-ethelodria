const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Εισαγωγή του cors
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Ρύθμιση του CORS για να επιτρέπει αιτήσεις από το http://localhost:3001
app.use(cors({
  origin: 'http://localhost:3001',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_HOST:', process.env.DB_HOST);

console.log('Before middleware');

app.use(bodyParser.json());

console.log('Before routes');

app.use('/api/users', userRoutes);

console.log('Starting server');

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
