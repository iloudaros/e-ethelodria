const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/login', userController.login);
router.post('/location', userController.saveLocation);
router.get('/location/:username', userController.getLocation);

module.exports = router;
