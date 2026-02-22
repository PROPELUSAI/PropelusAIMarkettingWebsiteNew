import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodIssue } from 'zod';
import { ApiError } from '../utils/ApiError';

function formatZodErrors(error: ZodError): string {
  return error.issues.map(
    (e: ZodIssue) => `${e.path.join('.')}: ${e.message}`
  ).join(', ');
}

/**
 * Validate request body against a Zod schema
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(ApiError.badRequest(`Validation failed: ${formatZodErrors(error)}`, 'VALIDATION_ERROR'));
      } else {
        next(error);
      }
    }
  };
};

/**
 * Validate request query params against a Zod schema
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(ApiError.badRequest(`Query validation failed: ${formatZodErrors(error)}`, 'VALIDATION_ERROR'));
      } else {
        next(error);
      }
    }
  };
};

/**
 * Validate request params against a Zod schema
 */
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.params = schema.parse(req.params) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(ApiError.badRequest(`Params validation failed: ${formatZodErrors(error)}`, 'VALIDATION_ERROR'));
      } else {
        next(error);
      }
    }
  };
};
