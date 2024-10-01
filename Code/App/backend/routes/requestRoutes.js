const express = require('express');
const requestController = require('../controllers/requestController');

const router = express.Router();

router.get('/all', requestController.getRequests);  
router.get('/user/:userId', requestController.getRequestsByUser);
router.post('/create', requestController.createRequest);
router.delete('/delete/:id', requestController.deleteRequest);

module.exports = router;
