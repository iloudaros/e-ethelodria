const express = require('express');
const requestController = require('../controllers/requestController');

const router = express.Router();

router.get('/all', requestController.getRequests);  

module.exports = router;
