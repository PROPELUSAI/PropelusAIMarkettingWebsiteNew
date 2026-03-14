/**
 * asyncHandler.ts — Wraps async Express handlers to auto-catch errors.
 * Eliminates the need for try-catch in every route handler.
 */
import { Request, Response, NextFunction } from 'express';

/**
 * Wraps an async Express handler to catch errors and pass them to next()
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
