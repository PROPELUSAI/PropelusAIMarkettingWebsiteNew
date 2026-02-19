import type { Metadata } from 'next';
import Link from 'next/link';
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import CTASection from '@/components/CTASection';
import PageHero from '@/components/PageHero';
import { blogPosts } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Blogs & Insights — AI Growth Strategies',
  description: 'AI-driven perspectives on growth, automation, SaaS, and modern business systems. Expert insights from PropelusAI.',
  alternates: { canonical: 'https://www.propelusai.com/blogs' },
};

export default function BlogsPage() {
  return (
    <>
      <PageHero
        tag="Insights & Perspectives"
        title="Blogs & Insights"
        description="AI-driven perspectives on growth, automation, SaaS, and modern IT systems."
      />

      <section className="section-padding section-light">
        <div className="container-main">
          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {blogPosts.map((post) => (
              <StaggerItem key={post.slug}>
                <Link href={`/blogs/${post.slug}`} className="group block">
                  <div className="card h-full p-0 overflow-hidden">
                    {/* Image Placeholder */}
                    <div className="aspect-[16/9] bg-gradient-to-br from-brand-50 to-brand-100 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center">
                          <svg className="w-8 h-8 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z"/></svg>
                        </div>
                      </div>
                      {post.featured && (
                        <span className="absolute top-4 left-4 text-xs font-medium bg-brand-500 text-white px-3 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-medium text-brand-500 bg-brand-50 px-2.5 py-1 rounded-full">{post.category}</span>
                        <span className="text-xs text-surface-400">{post.date}</span>
                      </div>
                      <h3 className="text-lg font-medium mb-2 group-hover:text-brand-500 transition-colors">{post.title}</h3>
                      <p className="text-sm text-surface-500 leading-relaxed">{post.excerpt}</p>
                      <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-brand-500">
                        Read More
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <CTASection
        tag="Ready to Scale?"
        title="Transform Your Business with AI-Powered Growth"
        description="From lead generation to marketing automation, we build systems that drive measurable results."
      />
    </>
  );
}
