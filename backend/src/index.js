import dotenv from 'dotenv';
dotenv.config();
import { createServer } from 'node:http';
import app from './server.js';
import { connectDB } from '../config/db.js';
import { initSocket } from '../socket/io.js';


const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);
initSocket(httpServer);

const start = async () => {
  await connectDB();
};

start().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
});
