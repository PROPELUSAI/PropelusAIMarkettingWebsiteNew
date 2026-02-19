import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'AI Services — One-Time AI-Powered Business Solutions',
  description: 'Enterprise-grade AI services: website building, mobile apps, CRM development, marketing automation, cybersecurity, and more.',
  alternates: { canonical: 'https://www.propelusai.com/services' },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
