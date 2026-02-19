import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us — Start Your AI Project',
  description: 'Ready to transform your business with AI? Contact PropelusAI to start your project. Global team responds within 24 hours.',
  alternates: { canonical: 'https://www.propelusai.com/contact' },
};

export default function ContactPage() {
  return <ContactClient />;
}
