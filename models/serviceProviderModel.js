const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
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

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);

module.exports = ServiceProvider;
