import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { chatbotService } from '../services/chatbot.service';
import { NewsletterSubscriber } from '../db/mongodb/models/NewsletterSubscriber';
import { ChatConversation } from '../db/mongodb/models/ChatConversation';
import { AuthRequest } from '../types';
import { logger } from '../utils/logger';

/**
 * Send a chatbot message (public)
 */
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const { session_id, sessionId: sessionIdAlt, message, userName, userEmail } = req.body;
  const resolvedSessionId = session_id || sessionIdAlt;

  const result = await chatbotService.handleMessage(resolvedSessionId, message, userName || undefined, userEmail || undefined);

  // Map 'response' to 'reply' to match frontend expectations
  ApiResponse.success(res, {
    reply: result.response,
    sessionId: result.sessionId,
    leadScore: result.leadScore,
  });
});

/**
 * Subscribe to newsletter from chatbot (public)
 */
export const subscribeNewsletter = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, sessionId } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Save/update newsletter subscriber
  const existing = await NewsletterSubscriber.findOne({ email: normalizedEmail });

  if (existing) {
    if (existing.status !== 'active') {
      existing.status = 'active';
      existing.name = name;
      existing.phone = phone;
      existing.unsubscribedAt = null;
      await existing.save();
    }
  } else {
    await NewsletterSubscriber.create({
      name,
      email: normalizedEmail,
      phone,
      source: 'chatbot',
      status: 'active',
    });
  }

  // 2. Store lead info in ChatConversation so it's linked to the session
  if (sessionId) {
    try {
      let conversation = await ChatConversation.findOne({ sessionId });
      if (!conversation) {
        conversation = new ChatConversation({
          sessionId,
          messages: [],
          metadata: {
            userName: name?.trim() || null,
            userEmail: normalizedEmail,
            userPhone: phone || null,
            leadCapturedAt: new Date().toISOString(),
          },
        });
      } else {
        conversation.metadata = {
          ...conversation.metadata,
          userName: name?.trim() || conversation.metadata?.userName || null,
          userEmail: normalizedEmail,
          userPhone: phone || conversation.metadata?.userPhone || null,
          leadCapturedAt: conversation.metadata?.leadCapturedAt || new Date().toISOString(),
        };
      }
      await conversation.save();
      logger.info(`Chatbot lead captured: session=${sessionId}, email=${normalizedEmail}`);
    } catch (err: any) {
      logger.error(`Failed to save chatbot lead to conversation: ${err.message}`);
    }
  }

  ApiResponse.success(res, null, 'You have been subscribed to our newsletter! 🎉');
});

/**
 * Get conversation history (public)
 */
export const getConversationHistory = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  const conversation = await chatbotService.getSessionHistory(sessionId as string);

  // Return messages array for frontend compatibility
  const messages = conversation?.messages?.map((m) => ({
    role: m.role,
    content: m.content,
  })) || [];

  ApiResponse.success(res, messages);
});

/**
 * Get chatbot analytics (admin)
 */
export const getAnalytics = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const analytics = await chatbotService.getChatAnalytics();

  ApiResponse.success(res, analytics);
});
