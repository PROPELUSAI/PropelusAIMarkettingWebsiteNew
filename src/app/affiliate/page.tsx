import type { Metadata } from 'next';
import AffiliateClient from './AffiliateClient';

export const metadata: Metadata = {
  title: 'Affiliate Program | Earn Commissions',
  description:
    'Join the PropelusAI affiliate program. Earn commissions by referring clients to our AI services and products.',
  openGraph: {
    title: 'PropelusAI Affiliate Program',
    description:
      'Become an affiliate partner and earn by promoting AI transformation solutions.',
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

export default function AffiliatePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <AffiliateClient />
    </>
  );
}
