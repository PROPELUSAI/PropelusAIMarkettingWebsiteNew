import { Router } from 'express';
import mongoose from 'mongoose';
import ChatConversation from '../models/ChatConversation.js';

const router = Router();

// GET /api/chats - List all chat conversations
router.get('/', async (req, res) => {
  try {
    const { search, leadQualified, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (leadQualified === 'true') filter.leadQualified = true;
    if (leadQualified === 'false') filter.leadQualified = false;

    if (search) {
      filter.$or = [
        { sessionId: { $regex: search, $options: 'i' } },
        { 'messages.content': { $regex: search, $options: 'i' } },
        { 'metadata.userEmail': { $regex: search, $options: 'i' } },
        { 'metadata.userName': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [conversations, total] = await Promise.all([
      ChatConversation.collection
        .find(filter)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray(),
      ChatConversation.collection.countDocuments(filter),
    ]);

    // Build list response — strip full messages for performance, add preview
    const list = conversations.map((conv) => {
      const messages = Array.isArray(conv.messages) ? conv.messages : [];
      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
      const lastMsg = messages[messages.length - 1];

      return {
        id: conv._id,
        sessionId: conv.sessionId || null,
        messageCount: messages.length,
        leadQualified: conv.leadQualified || false,
        leadScore: conv.leadScore || null,
        metadata: conv.metadata || {},
        lastMessagePreview: lastMsg
          ? (lastMsg.content || '').substring(0, 120) + ((lastMsg.content || '').length > 120 ? '...' : '')
          : null,
        lastMessageRole: lastMsg ? lastMsg.role : null,
        firstUserMessage: lastUserMsg
          ? (lastUserMsg.content || '').substring(0, 100) + ((lastUserMsg.content || '').length > 100 ? '...' : '')
          : null,
        createdAt: conv.createdAt || null,
        updatedAt: conv.updatedAt || null,
      };
    });

    res.json({
      conversations: list,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/chats/stats - Chat statistics
router.get('/stats', async (req, res) => {
  try {
    const [total, qualified, withMessages, empty] = await Promise.all([
      ChatConversation.collection.countDocuments({}),
      ChatConversation.collection.countDocuments({ leadQualified: true }),
      ChatConversation.collection.countDocuments({ 'messages.0': { $exists: true } }),
      ChatConversation.collection.countDocuments({
        $or: [
          { messages: { $size: 0 } },
          { messages: { $exists: false } },
        ],
      }),
    ]);

    res.json({ total, qualified, withMessages, empty });
  } catch (error) {
    console.error('Get chat stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/chats/:id - Single conversation with all messages
router.get('/:id', async (req, res) => {
  try {
    let conversation;
    try {
      conversation = await ChatConversation.collection.findOne({
        _id: new mongoose.Types.ObjectId(req.params.id),
      });
    } catch {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

    const messages = Array.isArray(conversation.messages) ? conversation.messages : [];

    res.json({
      id: conversation._id,
      sessionId: conversation.sessionId || null,
      messages,
      messageCount: messages.length,
      leadQualified: conversation.leadQualified || false,
      leadScore: conversation.leadScore || null,
      metadata: conversation.metadata || {},
      createdAt: conversation.createdAt || null,
      updatedAt: conversation.updatedAt || null,
    });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/chats/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await ChatConversation.collection.deleteOne({
      _id: new mongoose.Types.ObjectId(req.params.id),
    });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Conversation not found' });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
