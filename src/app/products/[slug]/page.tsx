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

  const title = `${product.title} | AI Subscription Products`;
  const description = product.subtitle;

  return {
    title,
    description,
    alternates: { canonical: `https://www.propelusai.com/products/${slug}` },
    openGraph: {
      title: `${product.title} | AI Subscription Products | PropelusAI`,
      description,
      type: 'website',
      url: `https://www.propelusai.com/products/${slug}`,
      images: [{ url: 'https://www.propelusai.com/propelus-favicon-1200.png', width: 1200, height: 630, alt: product.title }],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const priceMatch = product.startingPrice.match(/\$([\d,]+)/);
  const priceValue = priceMatch ? priceMatch[1].replace(/,/g, '') : undefined;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.subtitle,
    brand: { '@type': 'Organization', name: 'PropelusAI' },
    url: `https://www.propelusai.com/products/${slug}`,
    category: 'AI Subscription Products',
    image: {
      '@type': 'ImageObject',
      url: 'https://www.propelusai.com/propelus-favicon-1200.png',
      width: 1200,
      height: 630,
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'USD',
      url: `https://www.propelusai.com/products/${slug}`,
      seller: { '@type': 'Organization', name: 'PropelusAI' },
      ...(priceValue ? { price: priceValue, priceValidUntil: '2027-12-31' } : {}),
    },
  };

  const faqSchema = product.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: product.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  } : null;

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
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <ProductDetailClient product={product} />
    </>
  );
}
