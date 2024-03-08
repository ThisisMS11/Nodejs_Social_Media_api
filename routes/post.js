const express = require('express');
const { protect } = require('../middleware/authProtect')
const { createNewPost, updatePost, getPost, deletePost } = require('../controllers/post');

const router = express.Router();


/* CRUD POST*/
router.route('/').post(protect, createNewPost);


/* Get Post */
router.route('/').get(protect, getAllPosts);
router.route('/:postID').get(protect, getPost);

/* delete the post */
router.route('/delete/:postId').delete(protect, deletePost);

module.exports = router;
