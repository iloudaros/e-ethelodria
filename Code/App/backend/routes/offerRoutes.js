const express = require('express');
const offerController = require('../controllers/offerController');

const router = express.Router();

router.get('/all', offerController.getoffers);  

module.exports = router;
