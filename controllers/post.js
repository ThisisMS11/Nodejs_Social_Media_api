import Post from '../models/Post.js';
import asyncHandler from '../middleware/asyncHandler.js';
import errorHandler from '../utils/ErrorResponse.js';

export const createNewPost = asyncHandler(async (req, res, next) => {
    req.body.user = req.user._id;

    let newPost = await Post.create(req.body);

    newPost.user = req.user._id;

    newPost = await newPost.save();

    res.status(200).send({ success: true, data: newPost });
});

export const getPost = asyncHandler(async (req, res, next) => {
    const post = await Post.find({ _id: req.params.id });

    if (!post) {
        next(new errorHandler(`No post found with id ${req.params.id}`, 401));
    }

    res.status(200).send({ success: true, post: post });
});

export const getFollowingPosts = asyncHandler(async (req, res, next) => {
    try {
        // Extract follower IDs from req.user.followers (assuming it's an array of ObjectIds)
        const followerIds = req.user.following.map((follower) => follower._id);

        console.log({ followerIds });

        if (followerIds?.length == 0) {
            return res.status(200).json({ success: true, msg: "You have not followed anyone so far." });
        }

        // Find posts created by users in the followerIds array
        const posts = await Post.find({
            user: { $in: followerIds }, // Optimized $in operator for multiple IDs
        });

        return res.status(200).json({ success: true, data: posts });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export const deletePost = asyncHandler(async (req, res, next) => {
    // finding the post
    const post = await Post.findOne({ _id: req.params.id });

    if (!post) {
        next(new errorHandler(`No post found with id ${req.params.id}`, 401));
    }

    if (post.user.toString() !== req.user._id.toString()) {
        return res.status(401).send({ success: false, data: "You are not authorized to delete this Post." });
    }

    try {
        await Post.findOneAndDelete({ _id: req.params.id });
        res.status(200).send({ success: true, data: `The Post with ${post._id} has been deleted.` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export const updatePost = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedFields = req.body;

        if (!id || !updatedFields) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const post = await Post.findOne({ _id: id });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).send({ success: false, data: "You are not authorized to update this Post." });
        }

        const updatedPost = await Post.findOneAndUpdate(
            { _id: id },
            updatedFields,
            { new: true, runValidators: true } // Return the updated document and run validations
        );

        return res.status(200).json({ success: true, data: updatedPost });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' }); // Generic error for unexpected issues
    }
});
