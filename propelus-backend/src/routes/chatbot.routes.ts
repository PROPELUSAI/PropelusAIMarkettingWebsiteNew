import { Router } from 'express';
import * as chatbotController from '../controllers/chatbot.controller';
import { verifyToken as authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody as validate } from '../middleware/validate.middleware';
import { sendMessageSchema, chatbotSubscribeSchema } from '../validators/chatbot.validator';
import { chatbotLimiter } from '../middleware/ratelimit.middleware';

const router = Router();

// Public
router.post('/message', chatbotLimiter, validate(sendMessageSchema), chatbotController.sendMessage);
router.post('/subscribe-newsletter', chatbotLimiter, validate(chatbotSubscribeSchema), chatbotController.subscribeNewsletter);
router.get('/history/:sessionId', chatbotController.getConversationHistory);

// Admin
router.get('/analytics', authenticate, requireRole('admin', 'super_admin'), chatbotController.getAnalytics);

export default router;
