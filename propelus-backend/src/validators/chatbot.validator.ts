import { z } from 'zod';

export const sendMessageSchema = z.object({
  session_id: z.string().min(1, 'Session ID is required').optional(),
  sessionId: z.string().min(1, 'Session ID is required').optional(),
  message: z.string().min(1, 'Message is required').max(2000, 'Message too long'),
  userName: z.string().max(255).optional(),
  userEmail: z.string().email().optional(),
}).refine(data => data.session_id || data.sessionId, {
  message: 'Session ID is required (session_id or sessionId)',
});

export const chatbotSubscribeSchema = z.object({
  name: z.string().max(255).optional().default(''),
  email: z.string().email('Invalid email format'),
  phone: z.string().max(50).optional().default(''),
  source: z.enum(['footer', 'chatbot', 'popup', 'api']).optional().default('chatbot'),
  sessionId: z.string().min(1).optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type ChatbotSubscribeInput = z.infer<typeof chatbotSubscribeSchema>;
