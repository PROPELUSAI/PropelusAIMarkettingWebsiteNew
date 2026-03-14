/**
 * chatbot.service.ts — AI chatbot business logic.
 * Manages chat sessions in MongoDB, sends messages through Gemini AI,
 * tracks lead scores, retrieves conversation history, and provides analytics.
 */
import { ChatConversation, IChatConversation } from '../db/mongodb/models/ChatConversation';
import { geminiService } from './gemini.service';
import { logger } from '../utils/logger';

/**
 * Handle an incoming chat message
 */
export async function handleMessage(
  sessionId: string,
  userMessage: string,
  userName?: string,
  userEmail?: string
): Promise<{ response: string; sessionId: string; leadScore: string | null }> {
  // Find or create conversation
  let conversation = await ChatConversation.findOne({ sessionId });

  if (!conversation) {
    conversation = new ChatConversation({
      sessionId,
      messages: [],
      metadata: {
        userName: userName || null,
        userEmail: userEmail || null,
      },
    });
  } else {
    // Update metadata with any new info
    const meta = conversation.metadata || {};
    if (userName && !meta.userName) meta.userName = userName;
    if (userEmail && !meta.userEmail) meta.userEmail = userEmail;
    conversation.metadata = meta;
  }

  // Resolve name from metadata if not provided in this request
  const resolvedName = userName || conversation.metadata?.userName || undefined;

  // Add user message
  conversation.messages.push({
    role: 'user',
    content: userMessage,
    timestamp: new Date(),
  });

  // Generate response (rule-based first, then AI)
  const response = await geminiService.generateResponse(
    userMessage,
    conversation.messages.map((m) => ({ role: m.role, content: m.content })),
    resolvedName
  );

  // Add assistant response
  conversation.messages.push({
    role: 'assistant',
    content: response,
    timestamp: new Date(),
  });

  // Qualify lead if conversation is long enough
  if (conversation.messages.length >= 6 && !conversation.leadQualified) {
    const score = await geminiService.qualifyLead(
      conversation.messages.map((m) => ({ role: m.role, content: m.content }))
    );
    conversation.leadScore = score;
    conversation.leadQualified = true;
    logger.info(`Lead qualified: session=${sessionId}, score=${score}`);
  }

  await conversation.save();

  return {
    response,
    sessionId,
    leadScore: conversation.leadScore,
  };
}

/**
 * Get conversation history for a session
 */
export async function getSessionHistory(sessionId: string): Promise<IChatConversation | null> {
  return ChatConversation.findOne({ sessionId });
}

/**
 * Get chatbot analytics
 */
export async function getChatAnalytics(): Promise<{
  totalConversations: number;
  qualifiedLeads: number;
  avgMessagesPerConversation: number;
  leadScoreBreakdown: Record<string, number>;
}> {
  const [total, qualified, avgResult, breakdown] = await Promise.all([
    ChatConversation.countDocuments(),
    ChatConversation.countDocuments({ leadQualified: true }),
    ChatConversation.aggregate([
      { $project: { messageCount: { $size: '$messages' } } },
      { $group: { _id: null, avg: { $avg: '$messageCount' } } },
    ]),
    ChatConversation.aggregate([
      { $match: { leadQualified: true } },
      { $group: { _id: '$leadScore', count: { $sum: 1 } } },
    ]),
  ]);

  const leadScoreBreakdown: Record<string, number> = {};
  for (const item of breakdown) {
    leadScoreBreakdown[item._id || 'unknown'] = item.count;
  }

  return {
    totalConversations: total,
    qualifiedLeads: qualified,
    avgMessagesPerConversation: Math.round((avgResult[0]?.avg || 0) * 10) / 10,
    leadScoreBreakdown,
  };
}

export const chatbotService = {
  handleMessage,
  getSessionHistory,
  getChatAnalytics,
};
