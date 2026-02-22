import helmet from 'helmet';
import hpp from 'hpp';
import { RequestHandler } from 'express';

/**
 * Security middleware stack
 */
export const securityMiddleware: RequestHandler[] = [
  // Helmet sets various HTTP headers for security
  helmet(),

  // Protect against HTTP parameter pollution attacks
  hpp(),
];
