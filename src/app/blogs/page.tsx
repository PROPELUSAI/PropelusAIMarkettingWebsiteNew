import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import CTASection from '@/components/CTASection';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Blogs & Insights - AI Growth Strategies | PropelusAI',
  description:
    'AI-Driven Perspectives on Growth, Automation, SaaS, and Modern IT Systems. Learn how to scale your business with intelligent automation.',
  openGraph: {
    title: 'PropelusAI Blogs & Insights',
    description: 'Expert insights on AI-powered business growth and automation.',
  },
  alternates: { canonical: 'https://www.propelusai.com/blogs' },
};

interface Blog {
  _id: string;
  title: string;
  subtitle?: string;
  slug: string;
  category: string;
  tags: string[];
  featured_image?: string;
  is_featured: boolean;
  meta_description?: string;
  publish_date?: string | null;
  created_at: string;
}

async function fetchBlogs(): Promise<Blog[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrl}/api/v1/blogs?limit=50`, {
      next: { revalidate: 60 }, // Refresh every 60 seconds
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function BlogsPage() {
  const blogs = await fetchBlogs();

  return (
    <>
      <PageHero
        tag="Insights & Perspectives"
        title="Blogs & Insights"
        description="AI-driven perspectives on growth, automation, SaaS, and modern IT systems."
      />

      <section className="section-padding section-light">
        <div className="container-main">
          {blogs.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-surface-700 mb-2">No posts yet</h3>
              <p className="text-sm text-surface-400">Check back soon — new insights are on the way.</p>
            </div>
          ) : (
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <StaggerItem key={blog._id}>
                  <Link href={`/blogs/${blog.slug}`} className="group block h-full">
                    <div className="card h-full p-0 overflow-hidden hover:shadow-lg transition-shadow duration-300">

                      {/* Featured image or gradient placeholder */}
                      <div className="aspect-[16/9] bg-gradient-to-br from-brand-50 to-brand-100 relative overflow-hidden">
                        {blog.featured_image ? (
                          <Image
                            src={blog.featured_image}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center">
                              <svg className="w-7 h-7 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z"/>
                              </svg>
                            </div>
                          </div>
                        )}
                        {blog.is_featured && (
                          <span className="absolute top-3 left-3 text-xs font-medium bg-brand-500 text-white px-2.5 py-1 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="flex items-center gap-2.5 mb-3">
                          {blog.category && (
                            <span className="text-xs font-medium text-brand-500 bg-brand-50 px-2.5 py-1 rounded-full">
                              {blog.category}
                            </span>
                          )}
                          <span className="text-xs text-surface-400">
                            {formatDate(blog.publish_date || blog.created_at)}
                          </span>
                        </div>

                        <h3 className="text-base font-medium mb-1.5 group-hover:text-brand-500 transition-colors line-clamp-2">
                          {blog.title}
                        </h3>

                        {(blog.subtitle || blog.meta_description) && (
                          <p className="text-sm text-surface-500 leading-relaxed line-clamp-2">
                            {blog.subtitle || blog.meta_description}
                          </p>
                        )}

                        {blog.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {blog.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-xs text-surface-400 bg-surface-50 border border-surface-100 px-2 py-0.5 rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-brand-500">
                          Read More
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <path d="M3 8h10M9 4l4 4-4 4"/>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
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
