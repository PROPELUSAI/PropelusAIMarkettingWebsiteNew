import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: {
    absolute: 'PropelusAI | AI Website Development, CRM & SaaS',
  },
  description:
    'PropelusAI builds AI powered websites, CRM systems, SaaS platforms, and marketing automation. 150+ projects delivered globally. Custom software starting from $2,500.',
  alternates: { canonical: 'https://www.propelusai.com' },
  openGraph: {
    title: 'PropelusAI | AI Powered Growth for Modern Businesses',
    description:
      'We build premium AI driven websites, CRM systems, and subscription based growth engines with enterprise level precision.',
    url: 'https://www.propelusai.com',
    type: 'website',
    images: [{ url: 'https://www.propelusai.com/propelus-favicon-1200.png', width: 1200, height: 630, alt: 'PropelusAI - AI Powered Growth' }],
  },
};

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'PropelusAI | AI Powered Growth for Modern Businesses',
  description:
    'We build premium AI driven websites, CRM systems, and subscription based growth engines with enterprise level precision.',
  url: 'https://www.propelusai.com',
  isPartOf: {
    '@type': 'WebSite',
    name: 'PropelusAI',
    url: 'https://www.propelusai.com',
  },
  about: {
    '@type': 'Organization',
    name: 'PropelusAI',
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.propelusai.com',
      },
    ],
  },
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <HomeClient />
    </>
  );
}
