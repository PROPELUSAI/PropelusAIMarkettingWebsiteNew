import type { Metadata } from 'next';
import ProductsClient from './ProductsClient';

export const metadata: Metadata = {
  title: 'AI Products - Subscription-Based AI Growth Systems | PropelusAI',
  description:
    '21 monthly AI-powered products: marketing automation, content production, social media management, and ongoing creative support. Scale your growth with flexible subscriptions at 45% savings.',
  openGraph: {
    title: 'PropelusAI AI Products',
    description:
      '21 monthly AI-powered products: marketing automation, content production, social media management, and ongoing creative support. Scale your growth with flexible subscriptions at 45% savings.',
  },
  alternates: { canonical: 'https://www.propelusai.com/products' },
};

export default function ProductsPage() {
  return <ProductsClient />;
}
