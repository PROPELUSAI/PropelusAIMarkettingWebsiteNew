import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'One-Time Services - AI-Powered Business Solutions | PropelusAI',
  description:
    'PropelusAI: 22 AI-powered one-time services including web development, CRM systems, video production, brand identity, and creative strategy. Enterprise quality at 45% below market rates.',
  openGraph: {
    title: 'PropelusAI One-Time Services',
    description:
      'PropelusAI: 22 AI-powered one-time services including web development, CRM systems, video production, brand identity, and creative strategy. Enterprise quality at 45% below market rates.',
  },
  alternates: { canonical: 'https://www.propelusai.com/services' },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
