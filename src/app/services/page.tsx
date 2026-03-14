import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'One Time Services - AI Powered Business Solutions | PropelusAI',
  description:
    'PropelusAI: 22 AI powered one time services including web development, CRM systems, video production, brand identity, and creative strategy. Enterprise quality at 45% below market rates.',
  openGraph: {
    title: 'PropelusAI One Time Services',
    description:
      'PropelusAI: 22 AI powered one time services including web development, CRM systems, video production, brand identity, and creative strategy. Enterprise quality at 45% below market rates.',
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

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <ServicesClient />
    </>
  );
}
