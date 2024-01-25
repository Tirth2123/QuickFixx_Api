const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  emailId: String,
  phoneNo: String,
  companyName: String,
  service: String,
  whatsappNumber: String,
  experience: String,
  address: String,
  images: [String], 
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
