import mongoose, { Schema, Document } from 'mongoose';

export interface ISoulWaitlist extends Document {
  name: string;
  email: string;
  mobile_number?: string;
  purpose?: string;
  industry?: string;
  current_tools?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SoulWaitlistSchema = new Schema<ISoulWaitlist>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobile_number: { type: String, trim: true },
    purpose: { type: String, trim: true },
    industry: { type: String, trim: true },
    current_tools: { type: String, trim: true },
  },
  { timestamps: true }
);

SoulWaitlistSchema.index({ email: 1 }, { unique: true });

export default mongoose.models.SoulWaitlist ||
  mongoose.model<ISoulWaitlist>('SoulWaitlist', SoulWaitlistSchema);
