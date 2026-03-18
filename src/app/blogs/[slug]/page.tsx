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
  cta_description?: string;
}

async function fetchBlog(slug: string): Promise<Blog | null> {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${siteUrl}/api/v1/blogs/${slug}`, {
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

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.propelusai.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.propelusai.com/blogs' },
      { '@type': 'ListItem', position: 3, name: blog.title, item: `https://www.propelusai.com/blogs/${blog.slug}` },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.meta_description || blog.subtitle || '',
    url: `https://www.propelusai.com/blogs/${blog.slug}`,
    datePublished: blog.publish_date || blog.created_at || new Date().toISOString(),
    dateModified: blog.publish_date || blog.created_at || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'PropelusAI',
      url: 'https://www.propelusai.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'PropelusAI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.propelusai.com/propelus-favicon-512.png',
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.propelusai.com/blogs/${blog.slug}`,
    },
    ...(blog.featured_image ? { image: { '@type': 'ImageObject', url: blog.featured_image } } : {}),
    ...(blog.category ? { articleSection: blog.category } : {}),
    ...(blog.tags?.length ? { keywords: blog.tags.join(', ') } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <BlogDetailClient blog={blog} />
    </>
  );
}
