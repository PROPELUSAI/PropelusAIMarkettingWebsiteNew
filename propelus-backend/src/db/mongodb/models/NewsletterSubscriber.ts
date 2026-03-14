import mongoose, { Schema, Document } from 'mongoose';

export interface INewsletterSubscriber extends Document {
  name?: string;
  email: string;
  phone?: string;
  status: string;
  subscribedAt: Date;
  unsubscribedAt?: Date | null;
  source: 'footer' | 'chatbot' | 'popup' | 'api';
  createdAt: Date;
  updatedAt: Date;
}

const newsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
  {
    name: { type: String, default: '' },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, default: '' },
    status: { type: String, default: 'active', index: true },
    subscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: { type: Date, default: null },
    source: { type: String, enum: ['footer', 'chatbot', 'popup', 'api'], default: 'api' },
  },
  {
    timestamps: true,
  }
);

export const NewsletterSubscriber = mongoose.model<INewsletterSubscriber>(
  'NewsletterSubscriber',
  newsletterSubscriberSchema
);
