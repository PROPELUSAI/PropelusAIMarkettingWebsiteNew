import { MetadataRoute } from 'next';

/**
 * SEO-Optimized Robots.txt for PropelusAI
 *
 * This file tells search engines:
 * - Which pages to crawl
 * - Where to find the sitemap
 * - Crawl rate preferences
 *
 * Automatically accessible at: /robots.txt
 */

const baseUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.propelusai.com'
).replace(/\/$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
