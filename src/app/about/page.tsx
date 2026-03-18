import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Us | AI Company in Phoenix & India',
  description:
    'PropelusAI specializes in AI automation, website development, SaaS development, CRM development, and custom software. Global team in Phoenix, Arizona and India.',
  openGraph: {
    title: 'About PropelusAI',
    description:
      'Global AI company specializing in website development, CRM systems, SaaS, and AI automation for modern businesses.',
  },
  alternates: { canonical: 'https://www.propelusai.com/about' },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.propelusai.com' },
    { '@type': 'ListItem', position: 2, name: 'About', item: 'https://www.propelusai.com/about' },
  ],
};

const aboutPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About PropelusAI',
  description:
    'Learn about PropelusAI, a global AI driven company specializing in enterprise grade websites, CRM systems, automation, and subscription based AI products.',
  url: 'https://www.propelusai.com/about',
  mainEntity: {
    '@type': 'Organization',
    name: 'PropelusAI',
    url: 'https://www.propelusai.com',
  },
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }} />
      <AboutClient />
    </>
  );
}
