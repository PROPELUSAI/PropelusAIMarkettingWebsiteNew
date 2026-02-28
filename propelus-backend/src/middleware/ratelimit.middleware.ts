/**
 * ratelimit.middleware.ts — Rate limiting for API endpoints.
 * Provides general, form-specific, and chatbot-specific rate limiters
 * to prevent abuse and protect backend resources.
 */
import rateLimit from 'express-rate-limit';
import env from '../config/env';

/**
 * General rate limiter — 100 requests per 15 minutes
 */
export const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
    code: 'RATE_LIMITED',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter — 10 requests per 15 minutes (auth endpoints)
 */
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.',
    code: 'RATE_LIMITED',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Chatbot rate limiter — 30 requests per 15 minutes
 */
export const chatbotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Chatbot rate limit exceeded. Please wait before sending more messages.',
    code: 'RATE_LIMITED',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Form submission limiter — 5 submissions per 15 minutes
 */
export const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many submissions. Please try again later.',
    code: 'RATE_LIMITED',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
