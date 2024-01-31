const multer = require('multer');
const Profile = require('../models/profileModel');
const Review = require('../models/reviewModel');

exports.profileRegister = async (req, res) => {
  const { serviceProviderId, emailId, phoneNo, companyName, service, whatsappNumber, experience, address } = req.body; 
  const images = req.files.map(file => file.path); 
  
  const existingProfile = await Profile.findOne({ whatsappNumber: whatsappNumber });
  if (existingProfile) {
    return res.status(409).send('Profile with this phone number already exists');
  }

  const profile = new Profile({ serviceProviderId, emailId, phoneNo, companyName, service, whatsappNumber, experience, address, images }); 
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

exports.getProfileByEmailId = async (req, res) => {
  const emailId = req.params.emailId;  
  const profile = await Profile.findOne({ emailId: emailId });  
  if (!profile) {
    return res.status(404).send('Profile not found');
  }
  res.send(profile);
};

exports.profileUpdate = async (req, res) => {
  const emailId = req.params.emailId;
  const { companyName, service, whatsappNumber, experience, address } = req.body;

  const profile = await Profile.findOne({ emailId: emailId });
  if (!profile) {
    return res.status(404).send('Profile not found');
  }

  let images;
  if (req.files) {
      images = req.files.map(file => file.path);
  } else {
      images = profile.images;
  }

  profile.companyName = companyName;
  profile.service = service;
  profile.whatsappNumber = whatsappNumber;
  profile.experience = experience;
  profile.address = address;
  profile.images = images;

  await profile.save();
  res.send('Profile updated successfully');
};