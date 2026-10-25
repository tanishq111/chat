import { ApiError } from '../util/ApiError.js';

export const notFound = (req, res, next) => {
  next(new ApiError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};