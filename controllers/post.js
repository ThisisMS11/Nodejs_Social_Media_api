const Post = require('../models/Post');
const asyncHandler = require('../middleware/asyncHandler');
const errorHandler = require('../utils/ErrorResponse');

/* Create a New Post */
exports.createNewPost = asyncHandler(async (req, res, next) => {
    req.body.user = req.user._id;

    let newPost = await Post.create(req.body);

    newPost.user = req.user._id;

    newPost = await newPost.save();

    res.status(200).send({ success: true, data: newPost })
})

/* get a Indvidual Post */
exports.getPost = asyncHandler(async (req, res, next) => {
    const post = await Post.find({ _id: req.params.postId });

    if (!post) {
        next(new errorHandler(`No post found with id ${req.params.postId}`, 401));
    }

    res.status(200).send({ success: true, post: post });
})


/* Get all posts */
// ! implement the user follow following stuff now before actually testing this one .

exports.getFollowingPosts = asyncHandler(async (req, res, next) => {
    try {
        // Extract follower IDs from req.user.followers (assuming it's an array of ObjectIds)
        const followerIds = req.user.followers.map((follower) => follower._id);

        console.log({ followerIds });

        if (followerIds?.length == 0) {
            return res.status(200).json({ success: true, msg: "You have not followed anyone so far." },)
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


/* delete the post */
exports.deletePost = asyncHandler(async (req, res, next) => {
    // finding the post
    const post = await Post.findByIdAndDelete({ _id: req.params.postId });

    if (!post) {
        next(new errorHandler(`No post found with id ${req.params.postId}`, 401));
    }

    res.status(200).send({ success: true, data: post })
})

/* to update a post */
exports.updatePost = asyncHandler(async (req, res, next) => {
    try {
        const { postId } = req.params;
        const updatedFields = req.body;

        if (!postId || !updatedFields) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const updatedPost = await Post.findOneAndUpdate(
            { _id: postId },
            updatedFields,
            { new: true, runValidators: true } // Return the updated document and run validations
        );

        if (!updatedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        return res.status(200).json({ success: true, data: updatedPost });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' }); // Generic error for unexpected issues
    }
});

