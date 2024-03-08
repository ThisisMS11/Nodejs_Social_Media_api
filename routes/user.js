const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authProtect')
const { login, register, logout, deleteUser, getUserInfo, followUser, unfollowUser } = require('../controllers/user');

router.post('/login', login);
router.post('/register', register);
router.route('/delete').delete(protect, deleteUser);
router.route('/logout').get(protect, logout);

/* GET USER INFORMATION */
router.route('/').get(protect, getUserInfo);

/* FOLLOW AND FOLLOWING */
router.route('/follow/:userId').put(protect, followUser);
router.route('/unfollow/:userId').put(protect, unfollowUser);

module.exports = router;
