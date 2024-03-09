import { Router } from 'express';
import { protect } from '../middleware/authProtect.js';
import { createNewPost, updatePost, getPost, deletePost, getFollowingPosts } from '../controllers/post.js';

const router = Router();

/* CRUD POST*/
router.route('/').post(protect, createNewPost);
/* Get Post */
router.route('/').get(protect, getFollowingPosts);
router.route('/:id').get(protect, getPost).put(protect, updatePost).delete(protect, deletePost);

export default router;
