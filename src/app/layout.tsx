import type { Metadata } from 'next';
import { DM_Sans, DM_Mono } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.propelusai.com'),
  title: {
    default: 'PropelusAI — AI Powered Growth for Modern Businesses',
    template: '%s | PropelusAI',
  },
  description:
    'Premium AI services & products. We build AI-driven websites, CRM systems, automation engines, and subscription-based growth products for measurable business scale.',
  keywords: [
    'AI services', 'AI products', 'AI website development', 'CRM development',
    'marketing automation', 'LinkedIn advertising', 'lead generation', 'AI growth',
    'business automation', 'PropelusAI',
  ],
  authors: [{ name: 'PropelusAI' }],
  creator: 'PropelusAI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.propelusai.com',
    siteName: 'PropelusAI',
    title: 'PropelusAI — AI Powered Growth for Modern Businesses',
    description: 'Premium AI services & products for modern businesses.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PropelusAI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PropelusAI — AI Powered Growth',
    description: 'Premium AI services & products for modern businesses.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.propelusai.com' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'PropelusAI',
              url: 'https://www.propelusai.com',
              logo: 'https://www.propelusai.com/logo.png',
              description: 'Premium AI services & products for modern businesses.',
              email: 'support@propelusai.com',
              telephone: '+17042535036',
              address: [
                {
                  '@type': 'PostalAddress',
                  addressLocality: 'Huntersville',
                  addressRegion: 'NC',
                  addressCountry: 'US',
                },
                {
                  '@type': 'PostalAddress',
                  addressLocality: 'Surat',
                  addressRegion: 'Gujarat',
                  addressCountry: 'IN',
                },
              ],
              sameAs: [],
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
