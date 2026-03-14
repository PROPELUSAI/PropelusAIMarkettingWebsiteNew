import mongoose from 'mongoose';

// Schema matches the actual chatconversations collection in MongoDB
// Fields: sessionId, messages[], leadQualified, leadScore, metadata, createdAt, updatedAt

const chatMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
  },
  content: {
    type: String,
  },
  timestamp: {
    type: Date,
  },
}, { _id: false, strict: false });

const chatConversationSchema = new mongoose.Schema({
  sessionId: { type: String, default: null },
  messages: { type: [chatMessageSchema], default: [] },
  leadQualified: { type: Boolean, default: false },
  leadScore: { type: mongoose.Schema.Types.Mixed, default: null },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, {
  timestamps: true,  // createdAt, updatedAt
  strict: false,     // allow any extra fields from the actual collection
  collection: 'chatconversations',  // exact collection name in MongoDB
});

// Indexes
chatConversationSchema.index({ sessionId: 1 });
chatConversationSchema.index({ createdAt: -1 });
chatConversationSchema.index({ updatedAt: -1 });
chatConversationSchema.index({ leadQualified: 1 });

const ChatConversation = mongoose.model('ChatConversation', chatConversationSchema, 'chatconversations');

export default ChatConversation;
