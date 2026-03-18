import type { Metadata } from 'next';
import TestimonialsClient from './TestimonialsClient';
import { testimonials } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Client Testimonials & Results',
  description:
    'Client testimonials from website development, CRM, AI automation, and marketing projects. Real outcomes with measurable results.',
  openGraph: {
    title: 'PropelusAI Client Testimonials',
    description:
      'Real feedback from global businesses powered by AI transformation.',
  },
  alternates: { canonical: 'https://www.propelusai.com/testimonials' },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.propelusai.com' },
    { '@type': 'ListItem', position: 2, name: 'Testimonials', item: 'https://www.propelusai.com/testimonials' },
  ],
};

const reviewSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PropelusAI',
  url: 'https://www.propelusai.com',
  review: testimonials.map((t) => ({
    '@type': 'Review',
    reviewBody: t.quote,
    author: {
      '@type': 'Person',
      name: t.name,
      jobTitle: t.designation,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: 5,
      bestRating: 5,
    },
    publisher: { '@type': 'Organization', name: 'PropelusAI' },
  })),
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.9,
    reviewCount: testimonials.length,
    bestRating: 5,
    worstRating: 1,
  },
};

export default function TestimonialsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <TestimonialsClient />
    </>
  );
}
