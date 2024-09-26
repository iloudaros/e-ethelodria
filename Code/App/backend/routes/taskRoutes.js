const express = require('express');
const taskController = require('../controllers/taskController');

const router = express.Router();

router.post('/complete/:id', taskController.completeTask);
router.post('/cancel/:id', taskController.cancelTask);

module.exports = router;