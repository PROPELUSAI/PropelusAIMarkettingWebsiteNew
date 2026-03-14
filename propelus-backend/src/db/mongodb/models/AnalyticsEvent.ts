import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalyticsEvent extends Document {
  eventType: string;
  userId?: string;
  sessionId?: string;
  pageUrl?: string;
  eventData: Record<string, any>;
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string;
}

const analyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    eventType: { type: String, required: true, index: true },
    userId: { type: String, index: true },
    sessionId: { type: String },
    pageUrl: { type: String },
    eventData: { type: Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now },
    userAgent: { type: String },
    ipAddress: { type: String },
  },
  {
    timestamps: false, // We use our own timestamp field
  }
);

// TTL index: auto-delete after 90 days (also serves as the timestamp index)
analyticsEventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

export const AnalyticsEvent = mongoose.model<IAnalyticsEvent>(
  'AnalyticsEvent',
  analyticsEventSchema
);
