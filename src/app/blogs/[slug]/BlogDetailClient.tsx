/**
 * BlogDetailClient.tsx — Individual blog post detail page (client component).
 * Displays article header (category, date, tags), featured image,
 * body content (HTML or raw text), optional in-article CTA, and bottom CTA.
 * Uses Framer Motion for staggered entrance animations.
 */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import CTASection from '@/components/CTASection';

interface Blog {
  _id: string;
  title: string;
  subtitle?: string;
  slug: string;
  category: string;
  tags: string[];
  content_raw?: string;
  content_html?: string;
  featured_image?: string;
  is_featured: boolean;
  meta_description?: string;
  publish_date?: string | null;
  created_at: string;
  cta_type?: string;
  cta_button_text?: string;
  cta_link?: string;
}

/** Formats an ISO date string to "Month DD, YYYY" long display format */
function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
/** Renders a full blog article: header, featured image, body content, and CTA */
export default function BlogDetailClient({ blog }: { blog: Blog }) {
  const displayDate = formatDate(blog.publish_date || blog.created_at);

  return (
    <>
      {/* Article Header */}
      <section className="pt-32 pb-8 lg:pt-40 lg:pb-12 section-warm">
        <div className="container-main max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Link
              href="/blogs"
              className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-brand-500 transition-colors mb-6"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M10 4L6 8l4 4"/>
              </svg>
              Back to Blogs
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center gap-2.5 mb-5"
          >
            {blog.category && (
              <span className="text-xs font-medium text-brand-500 bg-brand-50 px-2.5 py-1 rounded-full">
                {blog.category}
              </span>
            )}
            {blog.is_featured && (
              <span className="text-xs font-medium bg-brand-500 text-white px-2.5 py-1 rounded-full">
                Featured
              </span>
            )}
            {displayDate && (
              <span className="text-sm text-surface-400">{displayDate}</span>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-2xl lg:text-4xl font-semibold mb-4 leading-tight"
          >
            {blog.title}
          </motion.h1>

          {blog.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-surface-500 leading-relaxed"
            >
              {blog.subtitle}
            </motion.p>
          )}

          {blog.tags?.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap gap-2 mt-4"
            >
              {blog.tags.map((tag) => (
                <span key={tag} className="text-xs text-surface-400 bg-surface-50 border border-surface-100 px-2.5 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Featured image */}
      {blog.featured_image && (
        <section className="section-light pb-0">
          <div className="container-main max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-xl overflow-hidden aspect-[16/7] relative"
            >
              <Image
                src={blog.featured_image}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Article Body */}
      <section className="py-12 lg:py-16 section-light">
        <div className="container-main max-w-3xl">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="blog-content"
          >
            {/* Render HTML if available, otherwise plain text */}
            {blog.content_html ? (
              <div
                className="prose prose-surface max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content_html }}
              />
            ) : blog.content_raw ? (
              <div className="prose prose-surface max-w-none">
                {blog.content_raw.split('\n\n').map((para, i) => (
                  <p key={i} className="text-surface-600 leading-relaxed mb-5 text-[0.9375rem]">
                    {para}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-surface-400 italic">No content available.</p>
            )}
          </motion.article>

          {/* CTA inside article if defined */}
          {blog.cta_button_text && blog.cta_link && (
            <div className="mt-10 p-6 rounded-xl bg-brand-50 border border-brand-100 text-center">
              <p className="text-sm text-surface-600 mb-4">
                {blog.cta_type === 'lead' ? 'Ready to get started?' : 'Want to learn more?'}
              </p>
              <a
                href={blog.cta_link}
                className="btn-primary inline-flex justify-center"
              >
                {blog.cta_button_text}
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M3 8h10M9 4l4 4-4 4"/>
                </svg>
              </a>
            </div>
          )}
        </div>
      </section>

      <CTASection
        tag="Ready to Scale?"
        title="Transform Your Business with AI Powered Growth"
        description="From lead generation to marketing automation, we build systems that drive measurable results."
      />
    </>
  );
}

