import type { Metadata } from 'next';
import ProductsClient from './ProductsClient';

export const metadata: Metadata = {
  title: 'AI Products — Subscription-Based AI Growth Systems',
  description: 'High-performance AI subscription products: LinkedIn advertising, content engines, CRM, lead scoring, Meta ads management, and more.',
  alternates: { canonical: 'https://www.propelusai.com/products' },
};

export default function ProductsPage() {
  return <ProductsClient />;
}
