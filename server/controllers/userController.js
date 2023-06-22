import { User } from '../models/User.js';
import { Course } from '../models/Course.js';
import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../utils/errorHandler.js'
import { sendToken } from '../utils/sendToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import getDataUri from '../utils/dataUri.js';
import cloudinary from 'cloudinary';
import crypto from 'crypto';
import { Stats } from '../models/Stats.js';

export const register = catchAsyncError(async (req, res, next) => {

    const { name, email, password } = req.body;
    const file = req.file;

    if(!name || !email || !password || !file) return next(new ErrorHandler("All Fields are mandatory.", 400));

    let user = await User.findOne({ email });

    if(user) return next(new ErrorHandler("User Already Exist.", 409));

    const fileUri = getDataUri(file);
    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

    user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    });

    sendToken(res, user, 'Registered Successfully.', 201);

});

export const login = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body;

    if(!email || !password) return next(new ErrorHandler("All Fields are mandatory.", 400));

    const user = await User.findOne({ email }).select("+password");

    if(!user) return next(new ErrorHandler("User does not exists.", 401));

    const isMatch = await user.comparePassword(password);

    if(!isMatch) return next(new ErrorHandler("Incorrect Email or Password.", 401));

    sendToken(res, user, `Welcome back, ${user.name}`, 200);

});

export const logout = catchAsyncError(async (req, res, next) => {

    res.status(200).cookie('token', '', {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: "none",
    }).json({
        success: true,
        msg: "Logout Successfully"
    });

});

export const getMyProfile = catchAsyncError(async (req, res, next) => {

    const { user } = req;

    res.status(200).json({
        success: true,
        user
    });

});

export const changePassword = catchAsyncError(async (req, res, next) => {

    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    if(!oldPassword || !newPassword) return next(new ErrorHandler('Please enter old & new password.', 400));

    const isMatch = await user.comparePassword(oldPassword);

    if(!isMatch) return next(new ErrorHandler('Old Password is incorrect.', 400));

    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        msg: "Password is changed successfully."
    });

});

export const updateProfile = catchAsyncError(async (req, res, next) => {

    const { name, email } = req.body;
    const { user } = await req;

    if(name) user.name = name;
    if(email) user.email = email;

    await user.save();

    res.status(200).json({
        success: true,
        msg: "User Profile updated successfully."
    });

});

export const updateProfilePicture = catchAsyncError(async (req, res, next) => {

    const { user } = await req;
    const file = req.file;

    if(!file) next(new ErrorHandler('Please select new Profile Image.', 409));

    const fileUri = getDataUri(file);
    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    user.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
    }

    await user.save();

    res.status(200).json({
        success: true,
        msg: "User Profile Picture updated successfully."
    });

});

export const forgetPassword = catchAsyncError(async (req, res, next) => {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if(!user) return next(new ErrorHandler('User Not Found.', 400));

    const resetToken = await user.getResetToken();

    await user.save();

    const message = `Click on the link to reset your password : ${process.env.FRONTEND_URL}/resetpassword/${resetToken}.`;
    await sendEmail(user.email, "Course Repo App Reset Password", message);

    res.status(200).json({
        success: true,
        msg: `Reset Link has been sent to ${user.email}`,
    });

});

export const resetPassword = catchAsyncError(async (req, res, next) => {

    const { token } = req.params;

    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {
            $gt: Date.now(),
        }
    });

    if(!user) return next(new ErrorHandler('Token is invalid or has been expired.'));

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        msg: 'Password has been reset successfully.',
    });

});

export const addToPlaylist = catchAsyncError(async (req, res, next) => {
    
    const { user } = await req;

    const course = await Course.findById(req.body.id);

    if(!course) return next(new ErrorHandler('Invalid Course ID.', 404));

    const courseExist = user.playlist.find((item) => {
        if(item.course.toString() === course._id.toString()) 
            return true;
    });

    if(courseExist) return next(new ErrorHandler('Course already added in Playlist.', 409));

    user.playlist.push({
        course: course._id,
        poster: course.url,
    });

    await user.save();

    res.status(200).json({
        success: true,
        msg: 'Course is added to Playlist.',
    });

});

export const removeFromPlaylist = catchAsyncError(async (req, res, next) => {

    const { user } = await req;

    const course = await Course.findById(req.query.id);

    if(!course) return next(new ErrorHandler('Invalid Course ID.', 404));

    const newPlaylist = user.playlist.filter((item) => {
        if(item.course.toString() !== course._id.toString()) return item;
    });

    user.playlist = newPlaylist;
    await user.save();

    res.status(200).json({
        success: true,
        msg: 'Remove from Playlist.',
    });

});

export const getAllUsers = catchAsyncError(async (req, res, next) => {

    const users = await User.find({});

    res.status(200).json({
        success: true,
        users,
    });

});

export const updateUserRole = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if(!user) return next(new ErrorHandler('User does not exist.', 404));

    if(user.role === "user") user.role = "admin";
    else user.role = "user";

    await user.save();

    res.status(200).json({
        success: true,
        msg: "User role is changed successfully."
    });

});

export const deleteUser = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if(!user) return next(new ErrorHandler('User does not exist.', 404));

    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    await User.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success: true,
        msg: "User deleted successfully."
    });

});

export const deleteMyProfile = catchAsyncError(async (req, res, next) => {

    const { user } = req;

    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    await User.deleteOne({ _id: user._id });

    res.status(200).cookie('token', '', {
        expires: new Date(Date.now()),
    }).json({
        success: true,
        msg: 'User deleted successfully.'
    });

});

User.watch().on("change", async () => {
    
    const stats = await Stats.find({}).sort({createdAt: "desc"}).limit(1);
    
    const subscription = await User.find({'subscription.status': 'active'});
    stats[0].users = await User.countDocuments();
    stats[0].subscriptions = subscription.length;
    stats[0].createdAt = new Date(Date.now());

    await stats[0].save();

});