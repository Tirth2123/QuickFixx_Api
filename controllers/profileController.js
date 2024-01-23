const multer = require('multer');
const Profile = require('../models/profileModel');
const Review = require('../models/reviewModel');

exports.profileRegister = async (req, res) => {
  const { serviceProviderId, phoneNo, companyName, service, whatsappNumber, experience, address } = req.body; 
  const images = req.files.map(file => file.path); 
  
  const existingProfile = await Profile.findOne({ whatsappNumber: whatsappNumber });
  if (existingProfile) {
    return res.status(409).send('Profile with this phone number already exists');
  }

  const profile = new Profile({ serviceProviderId, phoneNo, companyName, service, whatsappNumber, experience, address, images }); 
  await profile.save();
  res.send('Profile registered successfully');
};

exports.getProfiles = async (req, res) => {
  const profiles = await Profile.find({});
  
  const profilesWithRatings = await Promise.all(profiles.map(async (profile) => {
    const reviews = await Review.find({ serviceProviderContact: profile.phoneNo });
    const ratings = reviews.map(review => review.rating);
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0 ? ratings.reduce((a, b) => a + b, 0) / totalRatings : 0;
    return { ...profile._doc, totalRatings, averageRating };
  }));

  res.send(profilesWithRatings);
};
