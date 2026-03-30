import { MetadataRoute } from 'next';

/**
 * SEO optimized Robots.txt for PropelusAI
 *
 * This file tells search engines:
 * - Which pages to crawl
 * - Where to find the sitemap
 * - AI crawler access rules
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
        disallow: ['/api/', '/admin/', '/_next/', '/@propelusaiadminpanel279', '/propelusaiadmin279'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/@propelusaiadminpanel279', '/propelusaiadmin279'],
      },
      // Allow AI search crawlers for visibility in AI search results
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/@propelusaiadminpanel279', '/propelusaiadmin279'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/api/', '/admin/', '/@propelusaiadminpanel279', '/propelusaiadmin279'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/', '/admin/', '/@propelusaiadminpanel279', '/propelusaiadmin279'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/@propelusaiadminpanel279', '/propelusaiadmin279'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/@propelusaiadminpanel279', '/propelusaiadmin279'],
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
        disallow: ['/api/', '/admin/', '/@propelusaiadminpanel279', '/propelusaiadmin279'],
      },
      // Allow OpenAI dedicated search crawler
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/@propelusaiadminpanel279', '/propelusaiadmin279'],
      },
      // Block training-only scrapers
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'Bytespider',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'cohere-ai',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
