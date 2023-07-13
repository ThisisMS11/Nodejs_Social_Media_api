const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authProtect')
const { login, register, logout, getUserInfo, VerifyEmail, resendEmailVerification, UpdateVerificationToken, getUserPosts, getAllUsers, getOtherUserInfo, getOtherUserPosts, followUser, unfollowUser, updateUserInfo, updateProfilePic } = require('../controllers/user');
const { mediaUpload } = require('../middleware/multer');


router.post('/login', login);
router.post('/register', register);

router.route('/logout').get(protect, logout);

// email verification stuff
router.route('/verify/:token').get(VerifyEmail);
router.route('/updateVerificationToken').put(UpdateVerificationToken);
router.route('/resendEmailVerification').put(resendEmailVerification);


// User Activites 
router.route('/follow/:userId').put(protect, followUser);
router.route('/unfollow/:userId').put(protect, unfollowUser);

/* Get user */
router.route('/').get(protect, getUserInfo);
router.route('/allusers').get(protect, getAllUsers);

/* Get another users info */
router.route('/other/info/:userId').get(protect, getOtherUserInfo);
router.route('/other/posts/:userId').get(protect, getOtherUserPosts);


/* Get User posts */
router.route('/posts').get(protect, getUserPosts);


/* Edit user profile */
router.route('/updateinfo').put(protect, updateUserInfo);
router.route('/updateProfilePic').put(protect, mediaUpload, updateProfilePic);

module.exports = router;
