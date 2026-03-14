import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IChatConversation extends Document {
  sessionId: string;
  messages: IChatMessage[];
  leadQualified: boolean;
  leadScore: 'hot' | 'warm' | 'cold' | null;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const chatConversationSchema = new Schema<IChatConversation>(
  {
    sessionId: { type: String, required: true, index: true },
    messages: [chatMessageSchema],
    leadQualified: { type: Boolean, default: false, index: true },
    leadScore: {
      type: String,
      enum: ['hot', 'warm', 'cold', null],
      default: null,
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
  }
);

chatConversationSchema.index({ createdAt: -1 });

export const ChatConversation = mongoose.model<IChatConversation>(
  'ChatConversation',
  chatConversationSchema
);
