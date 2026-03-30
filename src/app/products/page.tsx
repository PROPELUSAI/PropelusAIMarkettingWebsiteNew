import type { Metadata } from 'next';
import ProductsClient from './ProductsClient';
import { allProductDetails } from '@/lib/productDetails';

export const metadata: Metadata = {
  title: 'AI Products | Monthly AI Subscriptions for Growth',
  description:
    '21 AI subscription products: LinkedIn ads, content engines, CRM analytics, lead generation, and marketing automation. From $149/month.',
  openGraph: {
    title: 'PropelusAI AI Products',
    description:
      'Monthly AI subscription products: LinkedIn ads, content engines, CRM, lead generation, and marketing automation.',
    url: 'https://www.propelusai.com/products',
    type: 'website',
    images: [{ url: 'https://www.propelusai.com/propelus-favicon-1200.png', width: 1200, height: 630, alt: 'PropelusAI AI Products' }],
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

const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'AI Products by PropelusAI',
  description: 'Monthly subscription AI products for LinkedIn advertising, content creation, CRM, lead generation, and marketing automation.',
  url: 'https://www.propelusai.com/products',
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: allProductDetails.map((product, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: product.title,
      url: `https://www.propelusai.com/products/${product.slug}`,
    })),
  },
};

export default function ProductsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <ProductsClient />
    </>
  );
}
