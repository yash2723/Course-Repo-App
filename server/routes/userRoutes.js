import express from 'express';
import { 
    addToPlaylist,
    changePassword, 
    deleteMyProfile, 
    deleteUser, 
    forgetPassword, 
    getAllUsers, 
    getMyProfile, 
    login, 
    logout, 
    register, 
    removeFromPlaylist, 
    resetPassword, 
    updateProfile, 
    updateProfilePicture, 
    updateUserRole
} from '../controllers/userController.js';
import isAuthenticated, { authorizeAdmin } from '../middlewares/auth.js';
import singleUpload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.route('/register').post(singleUpload, register);

userRouter.route('/login').post(login);

userRouter.route('/logout').get(logout);

userRouter.route('/me')
.get(isAuthenticated, getMyProfile)
.delete(isAuthenticated, deleteMyProfile);

userRouter.route('/changePassword').put(isAuthenticated, changePassword);

userRouter.route('/updateprofile').put(isAuthenticated, updateProfile);

userRouter.route('/updateprofilepicture').put(isAuthenticated, singleUpload, updateProfilePicture);

userRouter.route('/forgetpassword').post(forgetPassword);

userRouter.route('/resetpassword/:token').put(resetPassword);

userRouter.route('/addtoplaylist').post(isAuthenticated, addToPlaylist);

userRouter.route('/removefromplaylist').delete(isAuthenticated, removeFromPlaylist);

userRouter.route('/admin/users').get(isAuthenticated, authorizeAdmin, getAllUsers);

userRouter.route('/admin/user/:id')
.put(isAuthenticated, authorizeAdmin, updateUserRole)
.delete(isAuthenticated, authorizeAdmin, deleteUser);

export default userRouter;