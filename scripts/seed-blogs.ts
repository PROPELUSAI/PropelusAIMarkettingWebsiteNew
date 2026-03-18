/**
 * seed-blogs.ts — Seeds the MongoDB database with blog posts from blogSeedData.ts.
 * Run with: npx tsx scripts/seed-blogs.ts
 * Requires MONGODB_URI in .env.local
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { seedBlogPosts } from '../src/lib/blogSeedData';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in environment variables.');
  process.exit(1);
}

// Inline Blog schema to avoid Next.js module resolution issues
const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: String,
    slug: { type: String, required: true, unique: true },
    category: { type: String, default: 'General' },
    tags: [String],
    content_raw: String,
    content_html: String,
    featured_image: String,
    seo_title: String,
    meta_description: String,
    is_featured: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
    publish_date: Date,
    view_count: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI!);
  console.log('Connected.');

  let inserted = 0;
  let skipped = 0;

  for (const post of seedBlogPosts) {
    const existing = await Blog.findOne({ slug: post.slug });
    if (existing) {
      console.log(`  SKIP: "${post.slug}" already exists`);
      skipped++;
      continue;
    }

    await Blog.create({
      title: post.title,
      subtitle: post.subtitle,
      slug: post.slug,
      category: post.category,
      tags: post.tags,
      content_html: post.content_html,
      featured_image: post.featured_image,
      seo_title: post.title,
      meta_description: post.meta_description,
      is_featured: false,
      status: 'published',
      publish_date: new Date(post.publish_date),
    });

    console.log(`  INSERT: "${post.slug}"`);
    inserted++;
  }

  console.log(`\nDone. Inserted: ${inserted}, Skipped: ${skipped}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
