import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Replace with your backend API URL
    withCredentials: true, // Include cookies in requests
});

let refreshPromise = null;
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const excludedRoutes = [
            '/auth/login',
            '/auth/register',
            '/auth/refresh-token',
        ];

        const isExcludedRoute = excludedRoutes.some((route) =>
            originalRequest?.url?.includes(route)
        );
        if (!originalRequest || error.response?.status !== 401 || isExcludedRoute || originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;
        try {
            if (!refreshPromise) {
                refreshPromise = api.post('/auth/refresh-token').finally(() => {
                    refreshPromise = null;
                });
            }
            await refreshPromise;
            return api(originalRequest);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }
);

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);

export const getErrorMessage = (error) => {
    if (error.response && error.response.data && error.response.data.message) {
        return error.response.data.message;
    }
    return error.message || 'An unknown error occurred';
};