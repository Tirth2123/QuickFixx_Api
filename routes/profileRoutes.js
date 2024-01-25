const express = require('express');
const multer = require('multer');
const router = express.Router();
const profileController = require('../controllers/profileController');

const upload = multer({ dest: 'uploads/' });


router.post('/profile_register', upload.array('images'), profileController.profileRegister);
router.get('/profiles', profileController.getProfiles);
router.get('/profile/:phoneNo', profileController.getProfileByPhoneNo);

module.exports = router;
