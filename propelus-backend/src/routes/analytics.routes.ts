import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import { verifyToken as authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Public - track events (no auth required, just rate limiting via global limiter)
router.post('/track', analyticsController.trackEvent);

// Admin
router.get('/events/:eventType', authenticate, requireRole('admin', 'super_admin'), analyticsController.getEventsByType);
router.get('/dashboard', authenticate, requireRole('admin', 'super_admin'), analyticsController.getDashboardMetrics);

export default router;
