import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { verifyToken as authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody as validate } from '../middleware/validate.middleware';
import { loginSchema, changePasswordSchema, updateProfileSchema } from '../validators/auth.validator';
import { strictLimiter } from '../middleware/ratelimit.middleware';

const router = Router();

// Auth
router.post('/login', strictLimiter, validate(loginSchema), adminController.login);

// Protected
router.get('/profile', authenticate, adminController.getProfile);
router.patch('/profile', authenticate, validate(updateProfileSchema), adminController.updateProfile);
router.post('/change-password', authenticate, validate(changePasswordSchema), adminController.changePassword);
router.get('/dashboard', authenticate, requireRole('admin', 'super_admin'), adminController.getDashboard);

export default router;
