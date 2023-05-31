const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authProtect')
const { login, register, logout, getUserInfo, VerifyEmail, resendEmailVerification } = require('../controllers/user');


router.post('/login', login);
router.post('/register', register);
router.route('/').get(protect, getUserInfo);

router.route('/logout').get(protect, logout);

// email verification stuff
router.route('/verify/:token').get(VerifyEmail);
router.route('/update').get(UpdateVerificationToken);
router.route('/resendEmailVerification').put(resendEmailVerification);



module.exports = router;
