import mongoose from 'mongoose';

const newsletterSubscriberSchema = new mongoose.Schema({
  name: { type: String, default: null, trim: true },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    unique: true,  // this already creates the index — no need for schema.index({ email: 1 }) below
  },
  phone: { type: String, default: null },
  status: {
    type: String,
    enum: ['active', 'unsubscribed'],
    default: 'active',
  },
  source: { type: String, default: 'website' },
  unsubscribedAt: { type: Date, default: null },
  subscribedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
  // This model maps to the existing 'newslettersubscribers' collection
  collection: 'newslettersubscribers',
});

newsletterSubscriberSchema.index({ status: 1 });
newsletterSubscriberSchema.index({ subscribedAt: -1 });

export default mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
