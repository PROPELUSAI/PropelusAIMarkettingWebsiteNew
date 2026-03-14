import { Router } from 'express';
import * as affiliateController from '../controllers/affiliate.controller';
import { verifyToken as authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody as validate } from '../middleware/validate.middleware';
import { registerAffiliateSchema, approveAffiliateSchema, rejectAffiliateSchema } from '../validators/affiliate.validator';
import { formLimiter } from '../middleware/ratelimit.middleware';

const router = Router();

// Public
router.post('/register', formLimiter, validate(registerAffiliateSchema), affiliateController.register);

// Admin
router.get('/', authenticate, requireRole('admin', 'super_admin'), affiliateController.getAll);
router.patch('/:id/approve', authenticate, requireRole('admin', 'super_admin'), validate(approveAffiliateSchema), affiliateController.approveAffiliate);
router.patch('/:id/reject', authenticate, requireRole('admin', 'super_admin'), validate(rejectAffiliateSchema), affiliateController.rejectAffiliate);
router.patch('/:id/status', authenticate, requireRole('super_admin'), affiliateController.updateStatus);

export default router;
