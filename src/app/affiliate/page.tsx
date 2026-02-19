import type { Metadata } from 'next';
import AffiliateClient from './AffiliateClient';

export const metadata: Metadata = {
  title: 'Affiliate Program — Earn by Promoting AI Solutions',
  description: 'Join the PropelusAI affiliate program. Earn competitive commissions by promoting premium AI solutions that transform businesses globally.',
  alternates: { canonical: 'https://www.propelusai.com/affiliate' },
};

export default function AffiliatePage() {
  return <AffiliateClient />;
}
