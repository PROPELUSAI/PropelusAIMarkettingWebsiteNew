import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Us - PropelusAI | AI Powered Growth for Modern Businesses',
  description:
    'Learn about PropelusAI, a global AI-driven company specializing in enterprise-grade websites, CRM systems, automation, and subscription-based AI products. Discover our mission, values, leadership, and commitment to precision-built digital experiences.',
  openGraph: {
    title: 'About PropelusAI',
    description:
      'The global AI company behind premium, ROI-driven digital transformations.',
  },
  alternates: { canonical: 'https://www.propelusai.com/about' },
};

export default function AboutPage() {
  return <AboutClient />;
}
