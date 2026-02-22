import { Router } from 'express';
import * as newsletterController from '../controllers/newsletter.controller';
import { verifyToken as authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody as validate } from '../middleware/validate.middleware';
import { subscribeSchema, unsubscribeSchema, createCampaignSchema } from '../validators/newsletter.validator';
import { formLimiter } from '../middleware/ratelimit.middleware';

const router = Router();

// Public
router.post('/subscribe', formLimiter, validate(subscribeSchema), newsletterController.subscribe);
router.post('/unsubscribe', validate(unsubscribeSchema), newsletterController.unsubscribe);

// Admin
router.get('/subscribers', authenticate, requireRole('admin', 'super_admin'), newsletterController.getSubscribers);
router.get('/campaigns', authenticate, requireRole('admin', 'super_admin'), newsletterController.getCampaigns);
router.post('/campaigns', authenticate, requireRole('admin', 'super_admin'), validate(createCampaignSchema), newsletterController.createCampaign);
router.post('/campaigns/:id/send', authenticate, requireRole('super_admin'), newsletterController.sendCampaign);

export default router;
