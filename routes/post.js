const express = require('express');
const { protect } = require('../middleware/authProtect')
const { createNewPost, updatePost, getPost, deletePost, getFollowingPosts } = require('../controllers/post');

const router = express.Router();

/* CRUD POST*/
router.route('/').post(protect, createNewPost);
/* Get Post */
router.route('/').get(protect, getFollowingPosts);
router.route('/:id').get(protect, getPost).put(protect, updatePost).delete(protect, deletePost);

module.exports = router;
