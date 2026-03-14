import { Router } from 'express';
import * as testimonialController from '../controllers/testimonial.controller';
import { verifyToken as authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody as validate } from '../middleware/validate.middleware';
import { submitTestimonialSchema } from '../validators/testimonial.validator';
import { formLimiter } from '../middleware/ratelimit.middleware';

const router = Router();

// Public
router.post('/submit', formLimiter, validate(submitTestimonialSchema), testimonialController.submitTestimonial);
router.get('/approved', testimonialController.getApproved);

// Admin
router.get('/', authenticate, requireRole('admin', 'super_admin'), testimonialController.getAll);
router.patch('/:id/approve', authenticate, requireRole('admin', 'super_admin'), testimonialController.approve);
router.patch('/:id/reject', authenticate, requireRole('admin', 'super_admin'), testimonialController.reject);
router.delete('/:id', authenticate, requireRole('super_admin'), testimonialController.deleteTestimonial);

export default router;
