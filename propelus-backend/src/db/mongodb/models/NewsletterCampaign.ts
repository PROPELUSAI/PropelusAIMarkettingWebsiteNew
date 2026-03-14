import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INewsletterCampaign extends Document {
  subject: string;
  bodyHtml: string;
  bodyText?: string | null;
  status: string;
  scheduledFor?: Date | null;
  sentAt?: Date | null;
  recipientCount: number;
  sentCount: number;
  createdBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const newsletterCampaignSchema = new Schema<INewsletterCampaign>(
  {
    subject: { type: String, required: true },
    bodyHtml: { type: String, required: true },
    bodyText: { type: String, default: null },
    status: { type: String, default: 'draft', index: true },
    scheduledFor: { type: Date, default: null },
    sentAt: { type: Date, default: null },
    recipientCount: { type: Number, default: 0 },
    sentCount: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser', default: null },
  },
  {
    timestamps: true,
  }
);

newsletterCampaignSchema.index({ createdAt: -1 });

export const NewsletterCampaign = mongoose.model<INewsletterCampaign>(
  'NewsletterCampaign',
  newsletterCampaignSchema
);
