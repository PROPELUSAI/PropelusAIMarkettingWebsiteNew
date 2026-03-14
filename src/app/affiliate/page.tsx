import type { Metadata } from 'next';
import AffiliateClient from './AffiliateClient';

export const metadata: Metadata = {
  title: 'Become an Affiliate Partner - Join PropelusAI Affiliate Program',
  description:
    'Join the PropelusAI affiliate program and earn commissions by promoting our AI powered solutions. Partner with us to help businesses transform with cutting edge AI technology.',
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
