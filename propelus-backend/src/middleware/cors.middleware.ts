/**
 * cors.middleware.ts — CORS configuration for allowed origins.
 * Reads ALLOWED_ORIGINS from env and permits requests from those domains.
 */
import cors from 'cors';
import env from '../config/env';

/**
 * CORS middleware configuration
 */
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    const allowed = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowed.includes(origin) || env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400, // 24 hours
});
