import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';
import { allServiceDetails } from '@/lib/serviceDetails';

export const metadata: Metadata = {
  title: 'AI Services | Web, CRM, SaaS & Marketing Automation',
  description:
    'One-time AI services: website development, SaaS, CRM, mobile apps, cybersecurity, and marketing automation. Starting from $2,500.',
  openGraph: {
    title: 'PropelusAI AI Services',
    description:
      'One-time AI services: website development, SaaS, CRM, mobile apps, cybersecurity, and marketing automation.',
    url: 'https://www.propelusai.com/services',
    type: 'website',
    images: [{ url: 'https://www.propelusai.com/propelus-favicon-1200.png', width: 1200, height: 630, alt: 'PropelusAI AI Services' }],
  },
  alternates: { canonical: 'https://www.propelusai.com/services' },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.propelusai.com' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.propelusai.com/services' },
  ],
};

const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'AI Services by PropelusAI',
  description: 'One-time AI powered services including website development, CRM systems, SaaS development, mobile apps, and automation.',
  url: 'https://www.propelusai.com/services',
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: allServiceDetails.map((service, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: service.title,
      url: `https://www.propelusai.com/services/${service.slug}`,
    })),
  },
};

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <ServicesClient />
    </>
  );
}
