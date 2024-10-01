const express = require('express');
const offerController = require('../controllers/offerController');

const router = express.Router();

router.get('/all', offerController.getoffers);  
router.get('/user/:userId', offerController.getOffersByUser);
router.post('/create', offerController.createOffer);
router.delete('/delete/:offerId', offerController.deleteOffer);

module.exports = router;
