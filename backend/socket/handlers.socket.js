import { findConversationForUser } from '../util/conversationAccess.js';

export const registerSocketHandlers = (io, socket) => {
  const { id: userId, username } = socket.user;

  // Personal room: reaches every tab/device this user has open.
  socket.join(`user:${userId}`);
  console.log(`[socket] ${username} connected (${socket.id})`);

  socket.on('conversation:join', async (conversationId, ack) => {
    try {
      await findConversationForUser(conversationId, userId);
      socket.join(`conv:${conversationId}`);
      ack?.({ ok: true });
    } catch (error) {
      ack?.({ ok: false, error: error.message });
    }
  });



  socket.on('typing:start', (conversationId) => {
    if (!socket.rooms.has(`conv:${conversationId}`)) return;
    socket.to(`conv:${conversationId}`).emit('typing:start', { conversationId, userId, username });
  });

  socket.on('typing:stop', (conversationId) => {
    if (!socket.rooms.has(`conv:${conversationId}`)) return;
    socket.to(`conv:${conversationId}`).emit('typing:stop', { conversationId, userId });
  });

  socket.on('conversation:leave', (conversationId) => {
    socket.leave(`conv:${conversationId}`);
  });

  socket.on('disconnect', (reason) => {
    console.log(`[socket] ${username} disconnected (${reason})`);
  });
};