import { Resend } from 'resend';
import env from './env';
import { logger } from '../utils/logger';

let resend: Resend | null = null;

if (env.RESEND_API_KEY) {
  resend = new Resend(env.RESEND_API_KEY);
  logger.info('✅ Resend email service configured');
} else {
  logger.warn('⚠️ RESEND_API_KEY not set — email sending disabled');
}

export { resend };
export const emailFrom = env.EMAIL_FROM;
