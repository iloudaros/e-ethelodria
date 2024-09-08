const express = require('express');
const warehouseController = require('../controllers/warehouseController');

const router = express.Router();

router.get('/:admin', warehouseController.getBase);

module.exports = router;