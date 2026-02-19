import type { Metadata } from 'next';
import TestimonialsClient from './TestimonialsClient';

export const metadata: Metadata = {
  title: 'Client Testimonials — Real AI Transformations & Results',
  description: 'Real outcomes from real teams. See how PropelusAI delivers measurable growth through AI-powered solutions across industries.',
  alternates: { canonical: 'https://www.propelusai.com/testimonials' },
};

export default function TestimonialsPage() {
  return <TestimonialsClient />;
}
