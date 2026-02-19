import type { Metadata } from 'next';
import FAQClient from './FAQClient';

export const metadata: Metadata = {
  title: 'FAQ — AI Services, Products, Pricing & Delivery',
  description: 'Everything you need to know about PropelusAI — process, pricing, timelines, support, and the difference between Services and Products.',
  alternates: { canonical: 'https://www.propelusai.com/faq' },
};

export default function FAQPage() {
  return <FAQClient />;
}
