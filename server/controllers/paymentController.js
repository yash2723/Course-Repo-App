import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { instance } from '../server.js';
import crypto from 'crypto';
import { Payment } from "../models/Payment.js";

export const buySubscription = catchAsyncError(async (req, res, next) => {

    const { user } = req;

    if(user.role === "admin") return next(new ErrorHandler("Admin can't buy subscription.", 400));

    const subscription = await instance.subscriptions.create({
        plan_id: process.env.PLAN_ID,
        total_count: 12,
        customer_notify: 1,
    });
      
    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;

    await user.save();

    res.status(201).json({
        success: true,
        subscriptionId: subscription.id,
    })

});

export const paymentVerification = catchAsyncError(async (req, res, next) => {

    const { razorpay_signature, razorpay_payment_id, razorpay_subscription_id } = req.body;

    const { user } = req;

    const subscription_id = user.subscription.id;

    const generated_signature = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(razorpay_payment_id + "|" + subscription_id, "utf-8")
    .digest("hex");

    const isValid = generated_signature === razorpay_signature;

    if(!isValid) return res.redirect(`${process.env.FRONTEND_URL}/paymentfail`);

    await Payment.create({
        razorpay_signature,
        razorpay_payment_id,
        razorpay_subscription_id,
    })

    user.subscription.status = "active";
    await user.save();

    res.redirect(`${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`);

});

export const getRazorpayKey = catchAsyncError(async (req, res, next) => {

    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_API_KEY,
    });

})

export const cancelSubscription = catchAsyncError(async (req, res, next) => {

    const { user } = req;

    const subscriptionId = user.subscription.id;

    await instance.subscriptions.cancel(subscriptionId);

    const payment = await Payment.findOne({
        razorpay_subscription_id: subscriptionId,
    });

    const dateDiff = Date.now() - payment.createdAt;
    const refundTime = process.env.REFUND_DAYS * 24 * 60 * 60 * 1000;
    let refund = false;

    if(refundTime > dateDiff) {
        await instance.payments.refund(payment.razorpay_payment_id);
        refund = true;
    }

    await Payment.deleteOne({ razorpay_subscription_id: payment.razorpay_subscription_id });
    user.subscription.id = undefined;
    user.subscription.status = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        msg: refund ? ('Subscription cancelled, You will receive full refund within 7 days.') : ('Subscription Cancelled, No refund initiated as subscription cancelled after 7 days.'),
    });

});