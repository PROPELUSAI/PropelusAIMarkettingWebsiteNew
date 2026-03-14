import type { Metadata } from 'next';
import FAQClient from './FAQClient';

export const metadata: Metadata = {
  title: 'FAQ - AI Services, Products, Pricing & Delivery | PropelusAI',
  description:
    'Everything you need to know about PropelusAI — process, pricing, timelines, support, confidentiality, and the difference between Services (one time builds) and Products (monthly subscriptions).',
  openGraph: {
    title: 'PropelusAI FAQ',
    description:
      'Answers to common questions about our AI services, products, pricing, and delivery.',
  },
  alternates: { canonical: 'https://www.propelusai.com/faq' },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.propelusai.com' },
    { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://www.propelusai.com/faq' },
  ],
};

export default function FAQPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <FAQClient />
    </>
  );
}
