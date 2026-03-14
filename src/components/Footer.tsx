/**
 * Footer.tsx — Site-wide footer (server component).
 * Contains: newsletter subscription section, brand column with contact info
 * and social icons, Products/Services/Company link columns, offices,
 * and copyright bar with Terms/Privacy/Support links.
 */
import Link from 'next/link';
import Image from 'next/image';
import { siteConfig, footerLinks } from '@/lib/data';
import { SiLinkedin, SiInstagram, SiFacebook, SiThreads, SiPinterest, SiYoutube, SiBluesky } from 'react-icons/si';
import NewsletterSection from './NewsletterSection';

/** Social media platform links with their icons */
const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/propelusai/', icon: SiLinkedin },
  { label: 'Instagram', href: 'https://www.instagram.com/propelusai/', icon: SiInstagram },
  { label: 'Facebook', href: 'https://www.facebook.com/propelusai', icon: SiFacebook },
  { label: 'Threads', href: 'https://www.threads.net/@propelusai', icon: SiThreads },
  { label: 'Pinterest', href: 'https://www.pinterest.com/PropelusAI/', icon: SiPinterest },
  { label: 'YouTube', href: 'https://www.youtube.com/@PropelusAI', icon: SiYoutube },
  { label: 'Bluesky', href: 'https://bsky.app/profile/propelusai.bsky.social', icon: SiBluesky },
];

/** Renders the full footer: newsletter, brand info, link columns, and copyright */
export default function Footer() {
  return (
    <footer className="bg-surface-950 text-white">
      <div className="container-main py-10 lg:py-12">
        {/* Newsletter Section */}
        <NewsletterSection />

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">
          {/* Brand Col */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-4">
              <Image src="/logo.png" alt="PropelusAI" width={260} height={56} className="h-11 w-auto" />
            </Link>
            <p className="text-surface-400 text-sm leading-relaxed max-w-sm mb-4">
              PropelusAI builds AI powered websites, CRM systems, automation engines, and
              subscription based AI growth products that help businesses scale with precision,
              intelligence, and measurable ROI.
            </p>
            <div className="space-y-1 text-sm text-surface-400 mb-4">
              <p>{siteConfig.email}</p>
              <p>WhatsApp: {siteConfig.whatsapp.in} (IN) | {siteConfig.whatsapp.us} (US)</p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-md bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-surface-400 hover:text-white hover:bg-white/[0.12] hover:border-white/[0.15] transition-all duration-200"
                >
                  <s.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-xs font-medium tracking-widest uppercase text-surface-400 mb-3">Products</h4>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-surface-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-medium tracking-widest uppercase text-surface-400 mb-3">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-surface-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company + Offices */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-medium tracking-widest uppercase text-surface-400 mb-3">Company</h4>
            <ul className="space-y-2 mb-5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-surface-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="text-xs font-medium tracking-widest uppercase text-surface-400 mb-2">Offices</h4>
            <div className="space-y-1 text-sm text-surface-400">
              <p>Phoenix, AZ (US)</p>
              <p>Surat & Kolkata (India)</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-surface-500">
            © {new Date().getFullYear()} PropelusAI - All Rights Reserved. Designed for global growth across globally.
          </p>
          <div className="flex items-center gap-5 text-xs text-surface-500">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
