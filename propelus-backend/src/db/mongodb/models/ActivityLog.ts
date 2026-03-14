import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  userId: string;
  actionType: string;
  resourceType?: string;
  resourceId?: string;
  details: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: String, required: true, index: true },
    actionType: { type: String, required: true, index: true },
    resourceType: { type: String },
    resourceId: { type: String },
    details: { type: Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now },
    ipAddress: { type: String },
  },
  {
    timestamps: false,
  }
);

activityLogSchema.index({ timestamp: -1 });

// TTL index: auto-delete after 30 days
activityLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

export const ActivityLog = mongoose.model<IActivityLog>(
  'ActivityLog',
  activityLogSchema
);
