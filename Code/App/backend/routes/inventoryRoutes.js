const express = require('express');
const inventoryController = require('../controllers/inventoryController');

const router = express.Router();

router.get('/all', inventoryController.getInventory);
router.get('/single/:id', inventoryController.getSingleInventory);
router.put('/move', inventoryController.moveProduct);
router.put('/update', inventoryController.changeQuantity);

module.exports = router;