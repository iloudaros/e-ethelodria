const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Εισαγωγή του cors
require('dotenv').config();

// Route Files
const userRoutes = require('./routes/userRoutes');
const baseRoutes = require('./routes/baseRoutes');
const productRoutes = require('./routes/productRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const requestRoutes = require('./routes/requestRoutes');
const offerRoutes = require('./routes/offerRoutes');
const statsRoutes = require('./routes/statsRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Ρύθμιση του CORS για να επιτρέπει αιτήσεις από το http://localhost:3001
app.use(cors({
  origin: 'http://localhost:3001',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));


// Ρύθμιση του bodyParser για την ανάλυση των αιτημάτων JSON
app.use(bodyParser.json());

// Routes

// Αναθέτει τις αιτήσεις που ξεκινούν με /api/users στο userRoutes
app.use('/api/users', userRoutes);

// Αναθέτει τις αιτήσεις που ξεκινούν με /api/base στο baseRoutes
app.use('/api/base', baseRoutes);

// Αναθέτει τις αιτήσεις που ξεκινούν με /api/product στο productRoutes
app.use('/api/product', productRoutes);

// Αναθέτει τις αιτήσεις που ξεκινούν με /api/inventory στο inventoryRoutes
app.use('/api/inventory', inventoryRoutes);

// Αναθέτει τις αιτήσεις που ξεκινούν με /api/vehicle στο vehicleRoutes
app.use('/api/vehicle', vehicleRoutes);

// Αναθέτει τις αιτήσεις που ξεκινούν με /api/requests στο requestRoutes
app.use('/api/requests', requestRoutes);

// Αναθέτει τις αιτήσεις που ξεκινούν με /api/offers στο offerRoutes
app.use('/api/offers', offerRoutes);

// Αναθέτει τις αιτήσεις που ξεκινούν με /api/stats στο statsRoutes
app.use('/api/stats', statsRoutes);

// Αναθέτει τις αιτήσεις που ξεκινούν με /api/task στο taskRoutes
app.use('/api/tasks', taskRoutes);



// Εκκίνηση του server
console.log('Starting server');
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
