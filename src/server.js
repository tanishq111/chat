import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { errorHandler } from '../middlewares/errorHandler.js';
import { notFound } from '../middlewares/notFound.js';
import { asyncHandler } from '../util/asyncHandler.js';
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok' ,
    db: mongoose.connection.readyState
  });
});

app.get("/api/boom", asyncHandler((req, res) => {
    throw new Error("Test error");
}));


app.use(notFound);
app.use(errorHandler);

export default app;