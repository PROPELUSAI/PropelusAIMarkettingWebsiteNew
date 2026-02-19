import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Us — AI Powered Growth for Modern Businesses',
  description: 'PropelusAI is a next-generation AI company delivering premium websites, CRM systems, automation engines, and subscription-based AI products globally.',
  alternates: { canonical: 'https://www.propelusai.com/about' },
};

export default function AboutPage() {
  return <AboutClient />;
}
