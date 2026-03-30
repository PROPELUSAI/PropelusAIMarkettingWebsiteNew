import type { Metadata } from 'next';
import FAQClient from './FAQClient';
import { faqCategories } from '@/lib/data';

export const metadata: Metadata = {
  title: 'FAQ | AI Services Pricing, Timelines & Process',
  description:
    'Answers about website development, SaaS, CRM, AI automation pricing, project timelines, and post launch support at PropelusAI.',
  openGraph: {
    title: 'PropelusAI FAQ',
    description:
      'Answers to common questions about website development, CRM builds, AI automation, pricing, and the Soul AI engine.',
    url: 'https://www.propelusai.com/faq',
    type: 'website',
    images: [{ url: 'https://www.propelusai.com/propelus-favicon-1200.png', width: 1200, height: 630, alt: 'PropelusAI FAQ' }],
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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqCategories.flatMap((category) =>
    category.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    }))
  ),
};

export default function FAQPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <FAQClient />
    </>
  );
}
