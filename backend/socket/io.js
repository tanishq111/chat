import { Server } from 'socket.io';
import { socketAuth } from './auth.socket.js';
import { registerSocketHandlers } from './handlers.socket.js';
let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
      credentials: true,
    },
  });

  io.use(socketAuth);
  io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);
    registerSocketHandlers(io, socket);
  });

  return io;
};

// Throws rather than returning null — a silent no-op broadcast is the worst
// possible failure mode, you'd never notice messages weren't being delivered.
export const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialised. Call initSocket() first.');
  return io;
};
