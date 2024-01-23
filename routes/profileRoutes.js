const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.post('/profile_register', profileController.profileRegister);
router.get('/profiles', profileController.getProfiles);

module.exports = router;
