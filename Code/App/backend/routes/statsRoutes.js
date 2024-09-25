const express = require('express');
const statsController = require('../controllers/statsController');

const router = express.Router();

router.get('/getData', statsController.getData);

module.exports = router;