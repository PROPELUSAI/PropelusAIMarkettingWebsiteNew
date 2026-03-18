import type { Metadata } from 'next';
import SoulClient from './SoulClient';

export const metadata: Metadata = {
  title: 'Soul by PropelusAI | AI Execution Engine for Sales, Marketing & Operations',
  description:
    'Soul is an autonomous AI execution engine that researches your market, qualifies leads, runs campaigns, and orchestrates workflows across your entire business stack. Not a chatbot. Not a copilot. An execution engine.',
  keywords: [
    'AI execution engine',
    'autonomous AI for business',
    'AI sales automation',
    'AI marketing automation',
    'AI workflow orchestration',
    'business AI platform',
    'AI lead qualification',
    'autonomous AI agent',
  ],
  openGraph: {
    title: 'Soul by PropelusAI | AI Execution Engine for Sales, Marketing & Operations',
    description:
      'Soul is an autonomous AI execution engine that researches your market, qualifies leads, runs campaigns, and orchestrates workflows across your entire business stack.',
    url: 'https://www.propelusai.com/soul',
    type: 'website',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.propelusai.com/soul' },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.propelusai.com' },
    { '@type': 'ListItem', position: 2, name: 'Soul', item: 'https://www.propelusai.com/soul' },
  ],
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Soul by PropelusAI',
  url: 'https://www.propelusai.com/soul',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Cloud',
  description:
    'Soul is an autonomous AI execution engine that researches your market, qualifies leads, runs campaigns, and orchestrates workflows across your entire business stack. Not a chatbot. Not a copilot. An execution engine.',
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/PreOrder',
    price: '499',
    priceCurrency: 'USD',
  },
};

export default function SoulPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <SoulClient />
    </>
  );
}
