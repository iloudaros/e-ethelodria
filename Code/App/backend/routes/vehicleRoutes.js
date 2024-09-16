const express = require('express');
const vehicleController = require('../controllers/vehicleController');

const router = express.Router();

router.get('/all', vehicleController.getVehicles);

module.exports = router;
