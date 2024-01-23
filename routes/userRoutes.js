const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/send_otp', userController.sendOtp);
router.post('/verify_otp', userController.verifyOtp);

module.exports = router;
