import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProductSlugs } from '@/lib/productDetails';
import ProductDetailClient from './ProductDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  const title = `${product.title} - AI Subscription Products | PropelusAI`;
  const description = product.subtitle;

  return {
    title,
    description,
    alternates: { canonical: `https://www.propelusai.com/products/${slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://www.propelusai.com/products/${slug}`,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.subtitle,
    brand: { '@type': 'Organization', name: 'PropelusAI' },
    url: `https://www.propelusai.com/products/${slug}`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.propelusai.com' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://www.propelusai.com/products' },
      { '@type': 'ListItem', position: 3, name: product.title, item: `https://www.propelusai.com/products/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ProductDetailClient product={product} />
    </>
  );
}
