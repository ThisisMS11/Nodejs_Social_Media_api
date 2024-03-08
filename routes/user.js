const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authProtect')
const { login, register, logout, deleteUser} = require('../controllers/user');


router.post('/login', login);
router.post('/register', register);
router.route('/delete').delete(protect, deleteUser);
router.route('/logout').get(protect, logout);

module.exports = router;
