import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: null },
  slug: { type: String, required: true, unique: true },
  category: {
    type: String,
    required: true,
    enum: ['AI', 'Sales', 'SaaS', 'HRTech', 'IT Services', 'Automation'],
  },
  tags: [{ type: String }],

  // Content
  content_raw: { type: String, required: true },
  content_html: { type: String, default: null },

  // Media
  featured_image: { type: String, default: null },

  // SEO
  seo_title: { type: String, default: null },
  meta_description: { type: String, default: null },
  schema_markup: { type: mongoose.Schema.Types.Mixed, default: null },
  canonical_url: { type: String, default: null },

  // CTA Configuration
  cta_type: {
    type: String,
    enum: ['Book Demo', 'Contact', 'Affiliate', 'Custom', null],
    default: null,
  },
  cta_button_text: { type: String, default: null },
  cta_link: { type: String, default: null },

  // Publishing Controls
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'published', 'archived'],
    default: 'draft',
  },
  publish_date: { type: Date, default: null },
  is_featured: { type: Boolean, default: false },

  // Author & Approval
  author_id: { type: String, default: null },
  approved_by: { type: String, default: null },
  approved_at: { type: Date, default: null },
  rejection_reason: { type: String, default: null },

  // Analytics
  view_count: { type: Number, default: 0 },
  cta_clicks: { type: Number, default: 0 },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

// Indexes
blogSchema.index({ status: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ publish_date: -1 });
blogSchema.index({ is_featured: 1 });
blogSchema.index({ author_id: 1 });

export default mongoose.model('Blog', blogSchema);
