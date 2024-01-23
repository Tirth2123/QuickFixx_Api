const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/submit_review', reviewController.submitReview);
router.get('/reviews/:serviceProviderContact', reviewController.getReviews);

module.exports = router;
