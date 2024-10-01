const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Here we control the routes starting with /api/users



router.post('/login', userController.login);
router.post('/location', userController.saveLocation);
router.get('/location/:username', userController.getLocation);
router.get('/info/:id', userController.getUserInfo);
router.get('/rescuers', userController.getRescuers);
router.post('/new/rescuer', userController.createRescuer);
router.post('/reset-password/:id', userController.resetPassword);
router.delete('/delete/:id', userController.deleteUser);
router.get('/rescuerTasks/:id', userController.getRescuerTasks);
router.post('/rescuer/newTask', userController.createRescuerTask);
router.post('/signup', userController.signup);

module.exports = router;
