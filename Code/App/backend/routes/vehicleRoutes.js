const express = require('express');
const vehicleController = require('../controllers/vehicleController');

const router = express.Router();

router.get('/all', vehicleController.getVehicles);
router.get('/single/:owner', vehicleController.getSingleVehicle);
router.post('/updateLocation', vehicleController.updateLocation);


module.exports = router;
