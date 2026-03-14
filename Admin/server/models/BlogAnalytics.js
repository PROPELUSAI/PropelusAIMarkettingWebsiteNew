import mongoose from 'mongoose';

const blogAnalyticsSchema = new mongoose.Schema({
  blog_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
  event_type: {
    type: String,
    required: true,
    enum: ['view', 'cta_click', 'share'],
  },
  event_data: { type: mongoose.Schema.Types.Mixed, default: null },
  user_agent: { type: String, default: null },
  ip_address: { type: String, default: null },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
});

// Indexes
blogAnalyticsSchema.index({ blog_id: 1 });
blogAnalyticsSchema.index({ event_type: 1 });

export default mongoose.model('BlogAnalytics', blogAnalyticsSchema);
