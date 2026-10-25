import { ApiError } from '../util/ApiError.js';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return next(new ApiError('Validation failed', 400, details));
  }

  req.body = result.data;   
  next();
};