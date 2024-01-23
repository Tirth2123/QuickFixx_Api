const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  state: String,
  phoneNo: String,
  emailId: String,
  password: String,
  otp: Number,
  otpExpires: Date,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
