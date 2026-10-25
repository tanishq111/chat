import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { errorHandler } from '../middlewares/errorHandler.js';
import { notFound } from '../middlewares/notFound.js';
import authRoutes from '../routes/auth.routes.js';
import userRoutes from '../routes/user.route.js';
import conversationRoutes from '../routes/conversation.routes.js';
import messageRoutes from '../routes/messages.routes.js';

import cookieParser from 'cookie-parser';
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({  
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;