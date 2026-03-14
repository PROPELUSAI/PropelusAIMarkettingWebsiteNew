import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogDetailClient from './BlogDetailClient';

interface Props {
  params: { slug: string };
}

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
  seo_title?: string;
  meta_description?: string;
  is_featured: boolean;
  publish_date?: string | null;
  created_at: string;
  cta_type?: string;
  cta_button_text?: string;
  cta_link?: string;
}

async function fetchBlog(slug: string): Promise<Blog | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrl}/api/v1/blogs/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

// Do NOT use generateStaticParams — pages are fully dynamic from MongoDB
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await fetchBlog(params.slug);
  if (!blog) return {};

  return {
    title: blog.seo_title || blog.title,
    description: blog.meta_description || blog.subtitle || '',
    alternates: { canonical: `https://www.propelusai.com/blogs/${blog.slug}` },
    openGraph: {
      title: blog.seo_title || blog.title,
      description: blog.meta_description || blog.subtitle || '',
      type: 'article',
      publishedTime: blog.publish_date || blog.created_at,
      images: blog.featured_image ? [{ url: blog.featured_image }] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const blog = await fetchBlog(params.slug);
  if (!blog) notFound();

  return <BlogDetailClient blog={blog} />;
}
