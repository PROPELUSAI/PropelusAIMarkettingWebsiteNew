import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true },
}, { _id: false });

const newsletterCampaignSchema = new mongoose.Schema({
  subject: { type: String, required: [true, 'Subject is required'], trim: true },
  body_html: { type: String, default: null },
  body_text: { type: String, default: null },
  compose_mode: {
    type: String,
    enum: ['html', 'normal'],
    default: 'normal',
  },
  from_email: { type: String, required: true },
  from_name: { type: String, default: 'PropelusAI' },

  // Attachments
  attachments: { type: [attachmentSchema], default: [] },

  // Send stats
  status: {
    type: String,
    enum: ['draft', 'sending', 'sent', 'failed'],
    default: 'draft',
  },
  total_subscribers: { type: Number, default: 0 },
  sent_count: { type: Number, default: 0 },
  failed_count: { type: Number, default: 0 },
  failed_emails: [{ type: String }],

  sent_at: { type: Date, default: null },
  sent_by: { type: String, default: null },

  // Resend batch ID if using batch send
  resend_batch_id: { type: String, default: null },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'newslettercampaigns',
});

newsletterCampaignSchema.index({ status: 1 });
newsletterCampaignSchema.index({ sent_at: -1 });

export default mongoose.model('NewsletterCampaign', newsletterCampaignSchema);
