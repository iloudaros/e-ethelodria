const express = require('express');
const announcementController = require('../controllers/announcementController');

const router = express.Router();
router.get('/all', announcementController.getAllAnnouncements);
router.post('/new', announcementController.createAnnouncement);


module.exports = router;