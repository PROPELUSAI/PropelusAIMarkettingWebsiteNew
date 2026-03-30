import { MetadataRoute } from 'next';
import { getAllServiceSlugs } from '@/lib/serviceDetails';
import { getAllProductSlugs } from '@/lib/productDetails';

interface ApiBlog {
  slug: string;
  publish_date?: string | null;
  created_at?: string;
}

async function fetchBlogEntries(): Promise<Array<{ slug: string; lastmod: string }>> {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${siteUrl}/api/v1/blogs?limit=10000`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error('API unavailable');
    const json = await res.json();
    const blogs: ApiBlog[] = json.data?.blogs ?? json.data ?? [];
    return blogs
      .filter((b) => b.slug)
      .map((b) => ({
        slug: b.slug,
        lastmod: b.publish_date || b.created_at || '2026-03-18',
      }));
  } catch {
    // API unavailable — return empty. Only include blogs confirmed to exist in DB.
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.propelusai.com';

  // Static pages with realistic last-modified dates
  const staticPages = [
    { url: baseUrl, lastModified: '2026-03-18' },
    { url: `${baseUrl}/services`, lastModified: '2026-03-10' },
    { url: `${baseUrl}/products`, lastModified: '2026-03-10' },
    { url: `${baseUrl}/soul`, lastModified: '2026-03-15' },
    { url: `${baseUrl}/contact`, lastModified: '2026-02-20' },
    { url: `${baseUrl}/about`, lastModified: '2026-03-12' },
    { url: `${baseUrl}/blogs`, lastModified: '2026-03-18' },
    { url: `${baseUrl}/faq`, lastModified: '2026-03-05' },
    { url: `${baseUrl}/testimonials`, lastModified: '2026-02-25' },
    { url: `${baseUrl}/affiliate`, lastModified: '2026-02-15' },
    { url: `${baseUrl}/case-studies`, lastModified: '2026-03-10' },
    { url: `${baseUrl}/terms`, lastModified: '2025-12-01' },
    { url: `${baseUrl}/privacy`, lastModified: '2025-12-01' },
  ];

  // Service detail pages — generated from data, all routes verified via generateStaticParams
  const servicePages = getAllServiceSlugs().map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: '2026-03-10',
  }));

  // Product detail pages — generated from data, all routes verified via generateStaticParams
  const productPages = getAllProductSlugs().map((slug) => ({
    url: `${baseUrl}/products/${slug}`,
    lastModified: '2026-03-10',
  }));

  // Blog pages — only include slugs confirmed in MongoDB via API
  const blogEntries = await fetchBlogEntries();
  const blogPages = blogEntries.map((entry) => ({
    url: `${baseUrl}/blogs/${entry.slug}`,
    lastModified: entry.lastmod,
  }));

  return [...staticPages, ...servicePages, ...productPages, ...blogPages];
}
