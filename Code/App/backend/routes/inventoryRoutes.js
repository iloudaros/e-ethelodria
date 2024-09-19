const express = require('express');
const inventoryController = require('../controllers/inventoryController');

const router = express.Router();

router.get('/all', inventoryController.getInventory);

module.exports = router;