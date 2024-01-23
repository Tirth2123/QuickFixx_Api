const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: String,
  userEmail: String, 
  serviceProviderContact: String, 
  rating: Number,
  review: String,
  date: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
