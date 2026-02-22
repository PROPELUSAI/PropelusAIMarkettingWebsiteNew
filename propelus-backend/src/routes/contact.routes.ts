import { Router } from 'express';
import * as contactController from '../controllers/contact.controller';
import { verifyToken as authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody as validate } from '../middleware/validate.middleware';
import { submitContactSchema, updateContactSchema } from '../validators/contact.validator';
import { formLimiter } from '../middleware/ratelimit.middleware';

const router = Router();

// Public
router.post('/submit', formLimiter, validate(submitContactSchema), contactController.submitContact);

// Admin
router.get('/', authenticate, requireRole('admin', 'super_admin'), contactController.getContacts);
router.get('/:id', authenticate, requireRole('admin', 'super_admin'), contactController.getContact);
router.patch('/:id', authenticate, requireRole('admin', 'super_admin'), validate(updateContactSchema), contactController.updateContact);
router.delete('/:id', authenticate, requireRole('super_admin'), contactController.deleteContact);

export default router;
