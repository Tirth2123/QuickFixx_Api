const express = require('express');
const router = express.Router();
const serviceProviderController = require('../controllers/serviceProviderController');

router.post('/provider_register', serviceProviderController.providerRegister);
router.post('/provider_login', serviceProviderController.providerLogin);
router.post('/provider_send_otp', serviceProviderController.providerSendOtp);
router.post('/provider_verify_otp', serviceProviderController.providerVerifyOtp);

module.exports = router;
