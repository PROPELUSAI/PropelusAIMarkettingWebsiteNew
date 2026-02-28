/**
 * auth.middleware.ts — JWT authentication and role-based authorization.
 * verifyToken: extracts and validates Bearer token from Authorization header.
 * requireRole: restricts access to specific admin roles (e.g., 'admin', 'super_admin').
 */
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import { ApiError } from '../utils/ApiError';
import { AuthRequest, JwtPayload } from '../types';

/**
 * JWT authentication middleware
 * Extracts and verifies JWT token from Authorization header
 */
export const verifyToken = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No token provided');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw ApiError.unauthorized('No token provided');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(ApiError.unauthorized('Token expired'));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(ApiError.unauthorized('Invalid token'));
    } else {
      next(error);
    }
  }
};

/**
 * Role-based authorization middleware
 */
export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }

    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('Insufficient permissions'));
    }

    next();
  };
};
