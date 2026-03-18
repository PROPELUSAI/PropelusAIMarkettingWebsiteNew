import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us | Free AI Consultation',
  description:
    'Get a free consultation for website development, SaaS, CRM, or AI automation. We respond within 24 hours with a custom proposal.',
  openGraph: {
    title: 'Contact PropelusAI | Free Consultation',
    description:
      'Share your project details and get a custom AI growth strategy within 24 hours.',
  },
  alternates: { canonical: 'https://www.propelusai.com/contact' },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.propelusai.com' },
    { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://www.propelusai.com/contact' },
  ],
};

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact PropelusAI',
  description:
    'Ready to transform your business with AI? Contact PropelusAI to discuss your goals.',
  url: 'https://www.propelusai.com/contact',
  mainEntity: {
    '@type': 'Organization',
    name: 'PropelusAI',
    email: 'support@propelusai.com',
    url: 'https://www.propelusai.com',
  },
};

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }} />
      <ContactClient />
    </>
  );
}
