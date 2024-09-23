const express = require('express');
const vehicleController = require('../controllers/vehicleController');

const router = express.Router();

router.get('/all', vehicleController.getVehicles);
router.get('/tasks/:id', vehicleController.getVehicleTasks);

module.exports = router;
