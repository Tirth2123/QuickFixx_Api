const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');

exports.register = async (req, res) => {
  const { name, address, city, state, phoneNo, emailId, password } = req.body;
  console.log(req.body);
  
  const existingUser = await User.findOne({ $or: [{ emailId: emailId }, { phoneNo: phoneNo }] });
  if (existingUser) {
    return res.status(409).send('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, address, city, state, phoneNo, emailId, password: hashedPassword });
  await user.save();
  res.send('User registered successfully');
};

exports.login = async (req, res) => {
  const { emailId, password } = req.body; 
  const user = await User.findOne({ emailId: emailId });
  if (!user) {
    return res.status(400).send('User not found');
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).send('Invalid password');
  }
  const token = jwt.sign({ _id: user._id }, 'secret_key');
  res.send({ token, name: user.name });
};

exports.sendOtp = async (req, res) => {
  const { emailId } = req.body;
  const user = await User.findOne({ emailId: emailId });
  if (!user) {
    return res.status(400).send('User not found');
  }

  const otp = Math.floor(100000 + Math.random() * 900000); 
  user.otp = otp;
  user.otpExpires = Date.now() + 60000; 
  await user.save();
  await user.save().catch((error) => console.log(error));
  console.log(`Generated OTP: ${otp}`); 
  console.log(`OTP Expiry Time: ${user.otpExpires}`);
  
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

exports.verifyOtp = async (req, res) => {
  const { emailId, otp, newPassword } = req.body;
  const user = await User.findOne({ emailId: emailId });
  if (!user) {
    return res.status(400).send('User not found');
}

if (user.otp !== Number(otp)) {
    return res.status(400).send('Invalid OTP');
}

if (user.otpExpires < Date.now()) {
    return res.status(400).send('OTP expired');
}
  console.log(`Received OTP: ${otp}`); 
  console.log(`OTP Expiry Time: ${user.otpExpires}`);

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.send('Password updated successfully');
};
