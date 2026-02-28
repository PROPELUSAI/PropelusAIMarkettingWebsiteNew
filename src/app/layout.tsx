import type { Metadata } from 'next';
import { DM_Sans, DM_Mono } from 'next/font/google';
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LeadPopup from '@/components/LeadPopup';
import AIChatbot from '@/components/AIChatbot';
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
    url: 'https://www.propelusai.com/propelus-faviocn-removebg-preview-512.png',
    width: 512,
    height: 512,
    contentUrl: 'https://www.propelusai.com/propelus-faviocn-removebg-preview-512.png',
  },
  description:
    'AI powered growth systems designed for global teams. Transform your business with AI powered websites, CRM systems, subscription based AI products, and automation.',
  sameAs: [
    'https://www.linkedin.com/company/propelusai',
    'https://twitter.com/propelusai',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    url: 'https://www.propelusai.com/contact',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'PropelusAI',
  url: 'https://www.propelusai.com',
  description: 'AI powered growth systems designed for global teams',
  publisher: {
    '@type': 'Organization',
    name: 'PropelusAI',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.propelusai.com/propelus-faviocn-removebg-preview-512.png',
      width: 512,
      height: 512,
    },
  },
};

const logoSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  url: 'https://www.propelusai.com',
  logo: 'https://www.propelusai.com/propelus-faviocn-removebg-preview-512.png',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.propelusai.com'),
  title: {
    default:
      'PropelusAI - AI Powered Growth for Modern Businesses | Premium AI Services & Automation',
    template: '%s | PropelusAI',
  },
  description:
    'Transform your business with AI powered websites, CRM systems, subscription based AI products, LinkedIn advertising, automation, and content engines. PropelusAI delivers premium, enterprise grade experiences built for global growth.',
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
      { url: '/propelus-faviocn-removebg-preview.png', sizes: '32x32', type: 'image/png' },
      { url: '/propelus-faviocn-removebg-preview-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/propelus-faviocn-removebg-preview-512.png', sizes: '180x180', type: 'image/png' },
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
        url: '/propelus-faviocn-removebg-preview-512.png',
        width: 1200,
        height: 630,
        alt: 'PropelusAI - AI Powered Growth for Modern Businesses',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PropelusAI - Premium AI Services & Products',
    description: 'AI powered growth systems designed for global teams.',
    images: ['/propelus-faviocn-removebg-preview-512.png'],
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
})(window,document,'script','dataLayer','GTM-543W69WN');`}
        </Script>

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
fbq('init', '1942070599757053');
fbq('track', 'PageView');`}
        </Script>

        {/* Zoho PageSense */}
        <Script id="zoho-pagesense" strategy="afterInteractive">
          {`(function(w,s){var e=document.createElement("script");e.type="text/javascript";e.async=true;e.src="https://cdn-in.pagesense.io/js/60065896954/f226d04c18114c509d24d2b42411990d.js";var x=document.getElementsByTagName("script")[0];x.parentNode.insertBefore(e,x);})(window,"script");`}
        </Script>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-543W69WN"
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
            src="https://www.facebook.com/tr?id=1942070599757053&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        {/* Structured Data for Google Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(logoSchema) }}
        />

        <StoreProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <LeadPopup />
          <AIChatbot />
        </StoreProvider>
      </body>
    </html>
  );
}
