import type { Metadata } from 'next';
import TestimonialsClient from './TestimonialsClient';

export const metadata: Metadata = {
  title: 'Client Testimonials - Real AI Transformations & Results | PropelusAI',
  description:
    'Read anonymized client testimonials showcasing real outcomes from PropelusAI across websites, CRM builds, automation, LinkedIn growth, Meta ads, security, and content engines. Transparent stories. Proven results.',
  openGraph: {
    title: 'PropelusAI Testimonials',
    description:
      'Real feedback from global businesses powered by AI transformation.',
  },
  alternates: { canonical: 'https://www.propelusai.com/testimonials' },
};

export default function TestimonialsPage() {
  return <TestimonialsClient />;
}
