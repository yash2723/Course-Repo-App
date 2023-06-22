import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import { Stats } from "../models/Stats.js";

export const contact = catchAsyncError(async (req, res, next) => {

    const { name, email, message } = req.body;

    if(!name || !email || !message) return next(new ErrorHandler('All Fields are Mandatory.', 400));

    const to = process.env.MY_MAIL;
    const subject = 'Contact From Course Repo App';
    const text = `I am ${name} and my email is ${email}. \n${message}`;

    await sendEmail(to, subject, text);

    res.status(200).json({
        success: true,
        msg: 'Your message has been recorded successfully. Thank you for reaching out to us.'
    });
    
});

export const courseRequest = catchAsyncError(async (req, res, next) => {

    const { name, email, course } = req.body;

    if(!name || !email || !message) return next(new ErrorHandler('All Fields are Mandatory.', 400));

    const to = process.env.MY_MAIL;
    const subject = 'Request for Course From Course Repo App';
    const text = `I am ${name} and my email is ${email}. \nRequested Course : ${course}`;

    await sendEmail(to, subject, text);

    res.status(200).json({
        success: true,
        msg: `Your request has been recorded successfully. Thank you for reaching out to us.`
    });
    
});

export const getDashboardStats = catchAsyncError(async (req, res, next) => {

    const stats = await Stats.find({}).sort({createdAt: 'desc'}).limit(12);

    const statsData = [];
    const requiredSize = 12 - stats.length;

    for(let i = 0 ; i < stats.length ; i++)
        statsData.unshift(stats[i]);

    for(let i = 0 ; i < requiredSize ; i++)
        statsData.unshift({
            users: 0,
            subscriptions: 0,
            views: 0,
        });

    const usersCount = statsData[11].users;
    const subscriptionsCount = statsData[11].subscriptions;
    const viewsCount = statsData[11].views;

    let usersProfit = true, subscriptionsProfit = true, viewsProfit = true;
    let usersPercent = 0, subscriptionsPercent = 0, viewsPercent = 0;
    
    const diff = {
        users: statsData[11].users - statsData[10].users,
        subscriptions: statsData[11].subscriptions - statsData[10].subscriptions,
        views: statsData[11].views - statsData[10].views,
    }

    if(statsData[10].users === 0) usersPercent = usersCount * 100;
    else usersPercent = (diff.users / statsData[10].users) * 100;
    
    if(statsData[10].subscriptions === 0) subscriptionsPercent = subscriptionsCount * 100;
    else subscriptionsPercent = (diff.subscriptions / statsData[10].subscriptions) * 100;

    if(statsData[10].views === 0) viewsPercent = viewsCount * 100;
    else viewsPercent = (diff.views / statsData[10].views) * 100;

    if(usersPercent < 0) usersProfit = false;
    if(subscriptionsPercent < 0) subscriptionsProfit = false;
    if(viewsPercent < 0) viewsProfit = false;

    res.status(200).json({
        success: true,
        stats: statsData,
        usersCount,
        subscriptionsCount,
        viewsCount,
        usersProfit,
        subscriptionsProfit,
        viewsProfit,
        usersPercent,
        subscriptionsPercent,
        viewsPercent
    });
    
});