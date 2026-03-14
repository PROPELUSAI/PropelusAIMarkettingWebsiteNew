import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  subtitle?: string;
  slug: string;
  category: string;
  tags: string[];
  content_raw: string;
  content_html: string;
  featured_image?: string;
  seo_title?: string;
  meta_description?: string;
  schema_markup?: object | null;
  canonical_url?: string;
  cta_type?: string;
  cta_button_text?: string;
  cta_link?: string;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  publish_date?: Date | null;
  author?: string;
  read_time?: number;
  view_count?: number;
  created_at: Date;
  updated_at: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true, default: '' },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    category: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    content_raw: { type: String, default: '' },
    content_html: { type: String, default: '' },
    featured_image: { type: String, default: '' },
    seo_title: { type: String, default: '' },
    meta_description: { type: String, default: '' },
    schema_markup: { type: Schema.Types.Mixed, default: null },
    canonical_url: { type: String, default: '' },
    cta_type: { type: String, default: '' },
    cta_button_text: { type: String, default: '' },
    cta_link: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    is_featured: { type: Boolean, default: false },
    publish_date: { type: Date, default: null },
    author: { type: String, default: 'PropelusAI Team' },
    read_time: { type: Number, default: 0 },
    view_count: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'blogs',
  }
);

// Indexes for fast lookups (slug uniqueness already set in schema definition)
BlogSchema.index({ status: 1, publish_date: -1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ is_featured: 1 });

export const Blog = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
