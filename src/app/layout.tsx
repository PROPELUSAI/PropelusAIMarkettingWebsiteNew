/**
 * layout.tsx — Root layout for the entire Next.js application.
 * Configures Google Fonts (DM Sans + DM Mono), SEO metadata, Open Graph,
 * JSON-LD structured data (Organization, WebSite, Logo schemas),
 * analytics scripts (GTM, Meta Pixel, Zoho PageSense),
 * and wraps all pages with Redux StoreProvider, Navbar, Footer,
 * LeadPopup, and AIChatbot.
 */
import type { Metadata } from 'next';
import { DM_Sans, DM_Mono } from 'next/font/google';
import Script from 'next/script';
import MarketingShell from '@/components/MarketingShell';
import { StoreProvider } from '@/store/provider';
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

/* ── Structured Data (JSON-LD) for Google Search ── */
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PropelusAI',
  url: 'https://www.propelusai.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.propelusai.com/propelus-favicon-512.png',
    width: 512,
    height: 512,
    contentUrl: 'https://www.propelusai.com/propelus-favicon-512.png',
  },
  description:
    'AI powered growth systems designed for global teams. Transform your business with AI powered websites, CRM systems, subscription based AI products, and automation.',
  '@id': 'https://www.propelusai.com/#organization',
  foundingDate: '2024-01-01',
  email: 'support@propelusai.com',
  telephone: '+1-623-235-7330',
  sameAs: [
    'https://www.linkedin.com/company/propelusai',
    'https://twitter.com/propelusai',
  ],
  address: [
    {
      '@type': 'PostalAddress',
      streetAddress: 'West Hide Trail',
      addressLocality: 'Phoenix',
      addressRegion: 'Arizona',
      postalCode: '85085',
      addressCountry: { '@type': 'Country', name: 'US' },
    },
    {
      '@type': 'PostalAddress',
      streetAddress: 'Surat',
      addressLocality: 'Surat',
      addressRegion: 'Gujarat',
      postalCode: '395007',
      addressCountry: { '@type': 'Country', name: 'IN' },
    },
    {
      '@type': 'PostalAddress',
      streetAddress: 'Kolkata',
      addressLocality: 'Kolkata',
      addressRegion: 'West Bengal',
      postalCode: '700001',
      addressCountry: { '@type': 'Country', name: 'IN' },
    },
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@propelusai.com',
      url: 'https://www.propelusai.com/contact',
      availableLanguage: ['English'],
    },
  ],
  knowsAbout: [
    'AI website development',
    'CRM systems',
    'LinkedIn advertising',
    'Marketing automation',
    'AI content generation',
    'Lead generation',
    'Mobile app development',
    'SaaS development',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.propelusai.com/#website',
  name: 'PropelusAI',
  url: 'https://www.propelusai.com',
  description: 'AI powered growth systems designed for global teams',
  inLanguage: 'en-US',
  publisher: {
    '@id': 'https://www.propelusai.com/#organization',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.propelusai.com/blogs?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.propelusai.com'),
  title: {
    default:
      'PropelusAI - AI Website Development, CRM & SaaS',
    template: '%s | PropelusAI',
  },
  description:
    'PropelusAI builds AI websites, CRM systems, SaaS platforms, and marketing automation. 150+ projects delivered. Custom software from $2,500.',
  keywords: [
    'AI services',
    'AI automation',
    'AI powered business growth',
    'AI website development',
    'AI CRM solutions',
    'AI marketing automation',
    'LinkedIn AI marketing',
    'AI lead segmentation',
    'AI content generation',
    'subscription AI products',
  ],
  authors: [{ name: 'PropelusAI' }],
  creator: 'PropelusAI',
  publisher: 'PropelusAI',
  icons: {
    icon: [
      { url: '/propelus-favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/propelus-favicon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/propelus-favicon-512.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.propelusai.com',
    siteName: 'PropelusAI',
    title: 'PropelusAI - Premium AI Services & Products',
    description: 'AI powered growth systems designed for global teams.',
    images: [
      {
        url: '/propelus-favicon-1200.png',
        width: 1200,
        height: 630,
        alt: 'PropelusAI - AI Powered Growth for Modern Businesses',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@propelusai',
    title: 'PropelusAI - Premium AI Services & Products',
    description: 'AI powered growth systems designed for global teams.',
    images: ['/propelus-favicon-1200.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: { canonical: 'https://www.propelusai.com' },
};

/** Root layout: wraps every page with fonts, providers, nav, footer, popups, and analytics */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="zyHo6zNSheYFzerzP-4W2mJlT7q4rCg3pyj_VXeWkIc" />
        <meta name="theme-color" content="#635BFF" />

        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`}
        </Script>

        {/* Google Analytics 4 (gtag.js) */}
        {process.env.NEXT_PUBLIC_GA4_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-script" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}');`}
            </Script>
          </>
        )}

        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>

        {/* Zoho PageSense */}
        <Script id="zoho-pagesense" strategy="lazyOnload">
          {`(function(w,s){var e=document.createElement("script");e.type="text/javascript";e.async=true;e.src="https://cdn-in.pagesense.io/js/60065896954/f226d04c18114c509d24d2b42411990d.js";var x=document.getElementsByTagName("script")[0];x.parentNode.insertBefore(e,x);})(window,"script");`}
        </Script>

        {/* Preload hero poster for LCP performance */}
        <link rel="preload" as="image" href="/hero-poster.webp" type="image/webp" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn-in.pagesense.io" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />

        {/* Structured Data — placed in head for earliest crawler discovery */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-sans antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {/* Meta Pixel (noscript) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>

        <StoreProvider>
          <MarketingShell>{children}</MarketingShell>
        </StoreProvider>
      </body>
    </html>
  );
}
