import type { Metadata } from 'next';
import AffiliateClient from './AffiliateClient';

export const metadata: Metadata = {
  title: 'Become an Affiliate Partner - Join PropelusAI Affiliate Program',
  description:
    'Join the PropelusAI affiliate program and earn commissions by promoting our AI-powered solutions. Partner with us to help businesses transform with cutting-edge AI technology.',
  openGraph: {
    title: 'PropelusAI Affiliate Program',
    description:
      'Become an affiliate partner and earn by promoting AI transformation solutions.',
  },
  alternates: { canonical: 'https://www.propelusai.com/affiliate' },
};

export default function AffiliatePage() {
  return <AffiliateClient />;
}
