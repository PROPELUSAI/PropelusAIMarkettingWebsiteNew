/**
 * ApiResponse.ts — Standardized JSON response helper.
 * Provides static methods for success, created, paginated, and error responses
 * ensuring a consistent response format across all endpoints.
 */
import { Response } from 'express';

export class ApiResponse {
  static success<T>(res: Response, data: T, message = 'Success', statusCode = 200): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created<T>(res: Response, data: T, message = 'Created successfully'): Response {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static paginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
    message = 'Success'
  ): Response {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  }

  static error(res: Response, message: string, statusCode = 500, code?: string): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(code && { code }),
    });
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }
}
