import { Router } from 'express';
const router = Router();
import { protect } from '../middleware/authProtect.js';
import { login, register, logout, deleteUser, getUserInfo, followUser, unfollowUser, updateUserInfo, getFollowersAndFollowing } from '../controllers/user.js';

router.post('/login', login);
router.post('/register', register);
router.route('/logout').get(protect, logout);

/* GET USER INFORMATION */
router.route('/').get(protect, getUserInfo).put(protect, updateUserInfo).delete(protect, deleteUser);

/* FOLLOW AND FOLLOWING */
router.route('/follow/:userId').put(protect, followUser);
router.route('/unfollow/:userId').put(protect, unfollowUser);
router.route('/getFFdetails/').get(protect, getFollowersAndFollowing)

export default router;
