import express from 'express';
import { 
    buySubscription, 
    cancelSubscription, 
    getRazorpayKey, 
    paymentVerification 
} from '../controllers/paymentController.js';
import isAuthenticated from '../middlewares/auth.js';

const paymentRouter = express.Router();

paymentRouter.route('/subscribe').get(isAuthenticated, buySubscription);

paymentRouter.route('/paymentverification').post(isAuthenticated, paymentVerification);

paymentRouter.route('/razorpaykey').get(getRazorpayKey);

paymentRouter.route('/subscribe/cancel').delete(isAuthenticated, cancelSubscription);

export default paymentRouter;