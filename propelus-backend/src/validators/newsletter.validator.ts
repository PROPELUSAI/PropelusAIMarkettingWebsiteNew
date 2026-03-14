import { z } from 'zod';

export const subscribeSchema = z.object({
  name: z.string().max(255).optional().default(''),
  email: z.string().email('Invalid email format'),
  phone: z.string().max(50).optional().default(''),
  source: z.enum(['footer', 'chatbot', 'popup', 'api']).optional().default('api'),
});

export const unsubscribeSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export const createCampaignSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(255),
  body_html: z.string().min(1, 'HTML body is required'),
  body_text: z.string().optional(),
  scheduled_for: z.string().datetime().optional(),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
