import express from 'express';
import routes from './routes';
import { corsMiddleware } from './middleware/cors.middleware';
import { securityMiddleware } from './middleware/security.middleware';
import { generalLimiter } from './middleware/ratelimit.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

const app = express();

// ── Security middleware ──
app.use(...securityMiddleware);

// ── CORS ──
app.use(corsMiddleware);

// ── Body parsing ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Rate limiting (global) ──
app.use(generalLimiter);

// ── Routes ──
app.use(routes);

// ── 404 handler ──
app.use(notFoundHandler);

// ── Global error handler ──
app.use(errorHandler);

export default app;
