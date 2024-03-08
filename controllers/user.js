const User = require('../models/User.js');
const asyncHandler = require('../middleware/asyncHandler.js');
const ErrorResponse = require('../utils/ErrorResponse.js');
const bcrypt = require('bcrypt');
const SendEmail = require('../utils/EmailHandler.js');



exports.getUserInfo = asyncHandler(async (req, res, next) => {
    if (req.user)
        res.status(200).json(req.user);
});


exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    /* Find whether a user with the given email already exists in the db or not */
    const user = await User.findOne({ email: email }).select('+password');
    if (!user) {
        return next(new ErrorResponse('User not found with the given email', 404));
    }

    /* confirm password */
    const matchpasswordResult = await user.matchpassword(password);

    if (!matchpasswordResult) {
        return next(new ErrorResponse('Invalid Input', 404));
    }

    res.json({ success: true, token: user.getJwtToken() });

});


exports.register = asyncHandler(async (req, res, next) => {

    let { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    let user = await User.findOne({ email: email });

    if (user) {
        return next(new ErrorResponse('User with the given email already exists', 400));
    }

    /* creating user in database */

    const salt = bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password, salt);

    user = await User.create({ name: name, email: email, password: password });

    await user.save();
    /* ******************************** */


    /* Creating a url for verifying user email */
    const VerificationToken = user.getVerficationtoken();


    const verificationUrl = `${process.env.SERVER_URL}/api/v1/user/verify/${VerificationToken}`;

    const message = `Please verify your email by clicking on the link below: \n\n ${verificationUrl}`;

    // Sending the url to user email

    try {
        await SendEmail({
            email: user.email,
            subject: "Email Verification",
            message
        })
        await user.save({ validateBeforeSave: false });

        res.status(200).json({ success: true, data: `Email Sent with URL : ${verificationUrl}` });
    } catch (error) {
        console.log(error);
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;
        // user will still be saved but with unverified Email.
        await user.save({ validateBeforeSave: false });
        return next(new ErrorResponse('Email could not be sent', 500));
    }
});

exports.logout = (asyncHandler(async (req, res) => {
    /* To set the token cookie to none at the browser */

    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })

    res.status(200).send({ status: "success", data: {} })
}));


exports.deleteUser = asyncHandler(async (req, res) => {
    try {
        // Extract email from the request
        const { email } = req.user;

        // Check if email is provided
        if (!email) {
            return res.status(400).json({ status: 'error', message: 'Email is required' });
        }

        // Find the user by email and delete it
        const deletedUser = await User.deleteOne({ email: email });

        // Check if user was found and deleted
        if (!deletedUser) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Send success response
        res.status(200).json({ status: 'success', message: 'User deleted successfully', data: {} });
    } catch (err) {
        // Handle errors
        console.error('Error deleting user:', err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});


/* Follow a User */
exports.followUser = (asyncHandler(async (req, res, next) => {
    try {
        const userToFollow = await User.findById(req.params.userId);

        if (!userToFollow) {
            return next(new errorHandler('User not found', 404));
        }

        /* checking if whether our user already follows the userToFollow */
        let followedByUser = req.user.following.some((userid) => userid.equals(req.params.userId));

        if (followedByUser) {
            return next(new errorHandler('Already Following', 300));
        }

        userToFollow.followers.push(req.user._id);
        await userToFollow.save();

        req.user.following.push(userToFollow._id);
        await req.user.save();


        /* follow the user here */
        res.status(200).send({ status: "success", data: { msg: `you started following ${userToFollow.name}` } });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}));


/* Unfollow a User */
exports.unfollowUser = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const userToFollow = await User.findById(userId).select('followers');
        const myself = await User.findById(req.user._id).select('following');

        // check if user exists
        if (!userToFollow) {
            return next(new errorHandler('User not found', 404));
        }

        /* removing that user from the following array */
        let followedByUser = myself.following.some((userid) => userid.equals(userId));

        if (followedByUser) {
            myself.following.remove(userId);
            await myself.save();
        }

        /* checking if user is already present in the followers list of usertoFollow */
        followedByUser = userToFollow.followers.some((userid) => userid.equals(req.user._id));

        if (followedByUser) {
            userToFollow.followers.remove(req.user._id);
            await userToFollow.save();
        } else {
            return res.status(500).json({ message: 'The user is not being followed already.' });
        }

        res.status(200).send({ status: "success", data: { myself, userToFollow } });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

