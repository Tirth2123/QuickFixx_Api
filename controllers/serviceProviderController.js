const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const ServiceProvider = require('../models/serviceProviderModel');

exports.providerRegister = async (req, res) => {
  const { name, address, city, state, phoneNo, emailId, password } = req.body;
  console.log(req.body);
  
  const existingProvider = await ServiceProvider.findOne({ $or: [{ emailId: emailId }, { phoneNo: phoneNo }] });
  if (existingProvider) {
    return res.status(409).send('Provider already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const provider = new ServiceProvider({ name, address, city, state, phoneNo, emailId, password: hashedPassword });
  await provider.save();
  res.send('Provider registered successfully');
};

exports.providerLogin = async (req, res) => {
  const { emailId, password } = req.body; 
  console.log(req.body);
  const provider = await ServiceProvider.findOne({ emailId: emailId });
  if (!provider) {
    return res.status(400).send('Provider not found');
  }
  const isPasswordValid = await bcrypt.compare(password, provider.password);
  if (!isPasswordValid) {
    return res.status(400).send('Invalid password');
  }
  const token = jwt.sign({ _id: provider._id }, 'secret_key');
  res.send({ token });
};

exports.providerSendOtp = async (req, res) => {
  const { emailId } = req.body;
  const provider = await ServiceProvider.findOne({ emailId: emailId });
  if (!provider) {
    return res.status(400).send('Provider not found');
  }

  const otp = Math.floor(100000 + Math.random() * 900000); 
  provider.otp = otp;
  provider.otpExpires = Date.now() + 60000; 
  await provider.save();
  console.log(`Generated OTP: ${otp}`); 
  console.log(`OTP Expiry Time: ${provider.otpExpires}`);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'temporary.mail.21temp@gmail.com',
      pass: 'myue zlhn riqu qwgz',
    },
  });

  const mailOptions = {
    from: 'temporary.mail.21temp@gmail.com',
    to: emailId,
    subject: 'Your OTP',
    text: `Your OTP is ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.send('OTP sent');
};

exports.providerVerifyOtp = async (req, res) => {
  const { emailId, otp, newPassword } = req.body;
  const provider = await ServiceProvider.findOne({ emailId: emailId });
  if (!provider) {
    return res.status(400).send('Provider not found');
  }

  if (provider.otp !== Number(otp)) {
    return res.status(400).send('Invalid OTP');
  }

  if (provider.otpExpires < Date.now()) {
    return res.status(400).send('OTP expired');
  }

  console.log(`Received OTP: ${otp}`); 
  console.log(`OTP Expiry Time: ${provider.otpExpires}`);

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  provider.password = hashedPassword;
  provider.otp = undefined;
  provider.otpExpires = undefined;
  await provider.save();

  res.send('Password updated successfully');
};
