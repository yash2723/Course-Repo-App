import express from 'express';
import {config} from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import courseRoutes from './routes/courseRoutes.js';
import userRoutes from './routes/userRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import otherRoutes from './routes/otherRoutes.js';
import { ErrorMiddleware } from './middlewares/errorMiddleware.js';

config({
    path: './config/config.env',
})
const app = express();

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cookieParser());

// Routes
app.use('/api/course/', courseRoutes);
app.use('/api/user/', userRoutes);
app.use('/api/payment/', paymentRoutes);
app.use('/api/other/', otherRoutes);

// Custom Error Middleware
app.use(ErrorMiddleware);

export default app;