const express = require('express');
const baseController = require('../controllers/baseController');

const router = express.Router();

router.get('/baseInfo/:admin', baseController.getBase);

module.exports = router;