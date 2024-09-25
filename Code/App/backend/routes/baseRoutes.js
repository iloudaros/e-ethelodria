const express = require('express');
const baseController = require('../controllers/baseController');

const router = express.Router();

router.get('/baseInfo/:admin', baseController.getBase);
router.post('/updateLocation', baseController.updateLocation);
router.get('/all', baseController.getBases);

module.exports = router;