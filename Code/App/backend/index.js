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


// Ρύθμιση του bodyParser για την ανάλυση των αιτημάτων JSON
app.use(bodyParser.json());

// Routes

// Αναθέτει τις αιτήσεις που ξεκινούν με /api/users στο userRoutes
app.use('/api/users', userRoutes);



// Εκκίνηση του server
console.log('Starting server');
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
