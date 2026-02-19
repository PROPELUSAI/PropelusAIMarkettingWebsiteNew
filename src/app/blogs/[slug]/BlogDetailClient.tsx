'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import CTASection from '@/components/CTASection';
import { blogPosts } from '@/lib/data';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  featured: boolean;
  content: string;
}

export default function BlogDetailClient({ post }: { post: BlogPost }) {
  const otherPosts = blogPosts.filter((p) => p.slug !== post.slug);

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
            <Link href="/blogs" className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-brand-500 transition-colors mb-6">
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 4L6 8l4 4"/></svg>
              Back to Blogs
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 mb-5"
          >
            <span className="text-xs font-medium text-brand-500 bg-brand-50 px-2.5 py-1 rounded-full">{post.category}</span>
            <span className="text-sm text-surface-400">{post.date}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-2xl lg:text-3xl mb-4"
          >
            {post.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-surface-500 leading-relaxed"
          >
            {post.excerpt}
          </motion.p>
        </div>
      </section>

      {/* Article Body */}
      <section className="py-12 lg:py-16 section-light">
        <div className="container-main max-w-3xl">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-surface max-w-none"
          >
            {post.content.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-surface-600 leading-relaxed mb-5 text-[0.9375rem]">
                {paragraph}
              </p>
            ))}
          </motion.article>

          {/* Related Posts */}
          {otherPosts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-surface-100">
              <h3 className="text-lg font-medium mb-6">More from the Blog</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {otherPosts.slice(0, 2).map((p) => (
                  <Link key={p.slug} href={`/blogs/${p.slug}`} className="card group p-5">
                    <span className="text-xs font-medium text-brand-500 mb-2 block">{p.category}</span>
                    <h4 className="text-sm font-medium group-hover:text-brand-500 transition-colors">{p.title}</h4>
                    <span className="text-xs text-surface-400 mt-2 block">{p.date}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <CTASection
        tag="Ready to Scale?"
        title="Transform Your Business with AI-Powered Growth"
      />
    </>
  );
}
