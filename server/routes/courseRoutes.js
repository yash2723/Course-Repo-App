import express from 'express';
import { 
    addLecture,
    createCourse, 
    deleteCourse, 
    deleteLecture, 
    getAllCourses, 
    getCourseLectures
} from '../controllers/courseController.js';
import isAuthenticated, { authorizeAdmin, authorizeSubscriber } from '../middlewares/auth.js';
import singleUpload from '../middlewares/multer.js';

const courseRouter = express.Router();

courseRouter.route('/courses').get(getAllCourses);

courseRouter.route('/createcourse').post(isAuthenticated, authorizeAdmin, singleUpload, createCourse);

courseRouter.route('/lecture').delete(isAuthenticated, authorizeAdmin, deleteLecture);

courseRouter
.route('/:id')
.get(isAuthenticated, authorizeSubscriber, getCourseLectures)
.post(isAuthenticated, authorizeAdmin, singleUpload, addLecture)
.delete(isAuthenticated, authorizeAdmin, deleteCourse);


export default courseRouter;