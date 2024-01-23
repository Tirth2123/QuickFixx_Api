const Review = require('../models/reviewModel');

exports.submitReview = async (req, res) => {
  const { name, userEmail, serviceProviderContact, rating, review, date} = req.body; 
  const newReview = new Review({name, userEmail, serviceProviderContact, rating, review, date }); 
  await newReview.save();
  res.send('Review submitted successfully');
};

exports.getReviews = async (req, res) => {
  try {
    const serviceProviderContact = req.params.serviceProviderContact;
    const reviews = await Review.find({ serviceProviderContact: serviceProviderContact });
    res.json(reviews);
} catch (err) {
    res.status(500).json({ message: err.message });
}
};
