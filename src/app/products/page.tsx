import type { Metadata } from 'next';
import ProductsClient from './ProductsClient';

export const metadata: Metadata = {
  title: 'AI Products - Subscription-Based AI Growth Systems | PropelusAI',
  description:
    '21 monthly AI powered products: marketing automation, content production, social media management, and ongoing creative support. Scale your growth with flexible subscriptions at 45% savings.',
  openGraph: {
    title: 'PropelusAI AI Products',
    description:
      '21 monthly AI powered products: marketing automation, content production, social media management, and ongoing creative support. Scale your growth with flexible subscriptions at 45% savings.',
  },
  alternates: { canonical: 'https://www.propelusai.com/products' },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.propelusai.com' },
    { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://www.propelusai.com/products' },
  ],
};

export default function ProductsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <ProductsClient />
    </>
  );
}
