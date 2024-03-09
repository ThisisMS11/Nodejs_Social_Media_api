import asyncHandler from './asyncHandler.js';
import errorHandler from '../utils/ErrorResponse.js';
import User from '../models/User.js';
import pkg from 'jsonwebtoken';
const { verify } = pkg;

export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        next(new errorHandler('Token not found please try again. ', 401))
    }

    try {
        const decoded = verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.id, password: decoded.password }).select('-password')

        /*if a user is found, the middleware adds the user object to the req object and passes the control to the next middleware in the stack */

        if (user) {
            req.user = user;
        }
        else {
            next(new errorHandler('Not authorize to access the route', 478))
        }
        next();
    } catch (err) {
        next(new errorHandler('Not authorize to access the route', 401))
    }
})