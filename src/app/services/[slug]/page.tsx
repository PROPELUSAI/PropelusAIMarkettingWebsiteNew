import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServiceBySlug, getAllServiceSlugs } from '@/lib/serviceDetails';
import ServiceDetailClient from './ServiceDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  const title = `${service.title} | Professional ${service.categoryTitle} | PropelusAI`;
  const description = service.summary;

  return {
    title,
    description,
    alternates: { canonical: `https://www.propelusai.com/services/${slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://www.propelusai.com/services/${slug}`,
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.summary,
    provider: {
      '@type': 'Organization',
      name: 'PropelusAI',
      url: 'https://www.propelusai.com',
    },
    serviceType: service.categoryTitle,
    url: `https://www.propelusai.com/services/${slug}`,
    areaServed: { '@type': 'Place', name: 'Worldwide' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${service.title} Deliverables`,
      itemListElement: service.features.map((f) => ({
        '@type': 'Service',
        name: f,
      })),
    },
  };

  const faqSchema = service.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map((faq) => ({
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
      { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.propelusai.com/services' },
      { '@type': 'ListItem', position: 3, name: service.title, item: `https://www.propelusai.com/services/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <ServiceDetailClient service={service} />
    </>
  );
}
