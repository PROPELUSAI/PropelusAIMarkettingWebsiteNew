import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us - Start Your AI Project | PropelusAI',
  description:
    'Ready to transform your business with AI? Contact PropelusAI to discuss your goals. We respond within 24 hours with a clear roadmap for your AI-powered growth journey.',
  openGraph: {
    title: 'Contact PropelusAI',
    description:
      'Get in touch with PropelusAI. Global support, 24-hour response time.',
  },
  alternates: { canonical: 'https://www.propelusai.com/contact' },
};

export default function ContactPage() {
  return <ContactClient />;
}
