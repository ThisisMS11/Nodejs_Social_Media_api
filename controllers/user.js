const User = require('../models/User.js');
const asyncHandler = require('../middleware/asyncHandler.js');
const ErrorResponse = require('../utils/ErrorResponse.js');
const bcrypt = require('bcrypt');
const SendEmail = require('../utils/EmailHandler.js');

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

