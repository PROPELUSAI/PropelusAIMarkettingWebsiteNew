import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  sessionId: string;
  userId?: string;
  data: Record<string, any>;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    userId: { type: String },
    data: { type: Schema.Types.Mixed, default: {} },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// TTL index: auto-delete when expiresAt is reached
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = mongoose.model<ISession>('Session', sessionSchema);
