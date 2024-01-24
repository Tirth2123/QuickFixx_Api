const express = require('express');
const multer = require('multer');
const router = express.Router();
const profileController = require('../controllers/profileController');

const upload = multer({ dest: 'uploads/' });


router.post('/profile_register', upload.array('files'), profileController.profileRegister);
router.get('/profiles', profileController.getProfiles);

module.exports = router;
