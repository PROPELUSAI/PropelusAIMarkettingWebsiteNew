import type { Metadata } from 'next';
import AffiliateClient from './AffiliateClient';

export const metadata: Metadata = {
  title: 'Affiliate Program | Earn Commissions Referring AI Services',
  description:
    'Join the PropelusAI affiliate program. Earn commissions by referring clients to our AI website development, CRM, SaaS, and automation services.',
  openGraph: {
    title: 'PropelusAI Affiliate Program',
    description:
      'Become an affiliate partner and earn commissions by promoting AI powered business transformation solutions.',
    url: 'https://www.propelusai.com/affiliate',
    type: 'website',
    images: [{ url: 'https://www.propelusai.com/propelus-favicon-1200.png', width: 1200, height: 630, alt: 'PropelusAI Affiliate Program' }],
  },
  alternates: { canonical: 'https://www.propelusai.com/affiliate' },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.propelusai.com' },
    { '@type': 'ListItem', position: 2, name: 'Affiliate Program', item: 'https://www.propelusai.com/affiliate' },
  ],
};

const affiliatePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'PropelusAI Affiliate Program',
  description: 'Earn commissions by referring clients to PropelusAI AI services and products.',
  url: 'https://www.propelusai.com/affiliate',
  isPartOf: { '@id': 'https://www.propelusai.com/#website' },
  about: { '@id': 'https://www.propelusai.com/#organization' },
};

export default function AffiliatePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(affiliatePageSchema) }} />
      <AffiliateClient />
    </>
  );
}
