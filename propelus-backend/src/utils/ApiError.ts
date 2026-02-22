export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;

  constructor(
    statusCode: number,
    message: string,
    code?: string,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;

    Object.setPrototypeOf(this, ApiError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, code?: string): ApiError {
    return new ApiError(400, message, code);
  }

  static unauthorized(message = 'Unauthorized'): ApiError {
    return new ApiError(401, message, 'UNAUTHORIZED');
  }

  static forbidden(message = 'Forbidden'): ApiError {
    return new ApiError(403, message, 'FORBIDDEN');
  }

  static notFound(message = 'Resource not found'): ApiError {
    return new ApiError(404, message, 'NOT_FOUND');
  }

  static conflict(message: string): ApiError {
    return new ApiError(409, message, 'CONFLICT');
  }

  static tooManyRequests(message = 'Too many requests'): ApiError {
    return new ApiError(429, message, 'RATE_LIMITED');
  }

  static internal(message = 'Internal server error'): ApiError {
    return new ApiError(500, message, 'INTERNAL_ERROR', false);
  }
}
