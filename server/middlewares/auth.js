import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import ErrorHandler from '../utils/errorHandler.js';
import { catchAsyncError } from './catchAsyncError.js';

const isAuthenticated = catchAsyncError(async (req, res, next) => {

    const { token } = req.cookies;

    if(!token) return next(new ErrorHandler('User is not Logged in.', 401));

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedToken._id);

    next();

});

export const authorizeAdmin = (req, res, next) => {

    if(req.user.role !== "admin") 
        return next(new ErrorHandler(`${req.user.role} is not allowed to Access this Resource.`, 403));

    next();

}

export const authorizeSubscriber = (req, res, next) => {

    if(req.user.subscription.status !== "active" && req.user.role !== "admin") 
        return next(new ErrorHandler(`Only subscribers can allowed to Access this Resource.`, 403));

    next();

}

export default isAuthenticated;