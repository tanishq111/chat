import dotenv from 'dotenv';
dotenv.config();
import app from './server.js';
import { connectDB } from '../config/db.js';

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectDB();
};

start().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
});
