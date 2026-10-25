import {api} from './client.js';
export const getConversations = () => api.get('/conversations');
export const createConversation = (userId) => api.post('/conversations', { userId });
export const searchUsers = (search) => api.get('/users', { params: { search } });

export const getMessages = (conversationId, params = {}) =>
  api.get(`/messages/${conversationId}`, { params });

export const sendMessage = (conversationId, text) =>
  api.post('/messages', { conversationId, text });