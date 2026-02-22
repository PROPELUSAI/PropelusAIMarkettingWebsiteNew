import { Router } from 'express';
import contactRoutes from './contact.routes';
import testimonialRoutes from './testimonial.routes';
import affiliateRoutes from './affiliate.routes';
import newsletterRoutes from './newsletter.routes';
import adminRoutes from './admin.routes';
import chatbotRoutes from './chatbot.routes';
import analyticsRoutes from './analytics.routes';
import { healthCheck } from '../controllers/health.controller';

const router = Router();

// Root route — API info
router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'PropelusAI Backend API',
    version: '1.0.0',
    docs: {
      health: '/health',
      api: '/api/v1',
    },
    endpoints: {
      contact: '/api/v1/contact',
      testimonials: '/api/v1/testimonials',
      affiliates: '/api/v1/affiliates',
      newsletter: '/api/v1/newsletter',
      admin: '/api/v1/admin',
      chatbot: '/api/v1/chatbot',
      analytics: '/api/v1/analytics',
    },
  });
});

// Health check (no prefix)
router.get('/health', healthCheck);

// API v1 routes
router.use('/api/v1/contact', contactRoutes);
router.use('/api/v1/testimonials', testimonialRoutes);
router.use('/api/v1/affiliates', affiliateRoutes);
router.use('/api/v1/newsletter', newsletterRoutes);
router.use('/api/v1/admin', adminRoutes);
router.use('/api/v1/chatbot', chatbotRoutes);
router.use('/api/v1/analytics', analyticsRoutes);

export default router;
