export class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// throw new ApiError("message", 400);
// throw new ApiError("Not Found", 404);
// throw new ApiError("Unauthorized", 401);
// throw new ApiError("Forbidden", 403);