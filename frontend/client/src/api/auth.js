import { api } from './client.js';

export const register = (data) => api.post('/auth/register', data);// localhost:3000/api/auth/register
export const login = (data) => api.post('/auth/login', data); // localhost:3000/api/auth/login
export const getMe = () => api.get('/auth/me'); // localhost:3000/api/auth/me
export const logout = () => api.post('/auth/logout'); // localhost:3000/api/auth/logout
export const refreshToken = () => api.post('/auth/refresh-token'); // localhost:3000/api/auth/refresh-token