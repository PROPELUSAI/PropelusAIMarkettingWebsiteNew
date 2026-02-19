import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/lib/data';
import BlogDetailClient from './BlogDetailClient';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://www.propelusai.com/blogs/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default function BlogDetailPage({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return <BlogDetailClient post={post} />;
}
