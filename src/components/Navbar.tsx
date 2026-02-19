'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { navigation } from '@/lib/data';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navBg = scrolled
    ? 'bg-surface-950/90 border-b border-white/[0.06] shadow-[0_1px_8px_rgba(0,0,0,0.2)]'
    : isHome
      ? 'bg-transparent'
      : 'bg-surface-950/80 border-b border-white/[0.06]';

  const textColor = 'text-white';
  const activeColor = 'text-brand-400';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 nav-blur transition-all duration-300 ${navBg}`}>
        <div className="container-main flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo.png"
              alt="PropelusAI"
              width={180}
              height={40}
              className="h-11 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 text-[0.875rem] font-medium rounded-lg transition-colors duration-200 ${
                    isActive ? activeColor : `${textColor} hover:text-brand-500`
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 bg-white text-surface-900 hover:bg-white/90 btn-shimmer-light"
            >
              Contact
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${textColor}`}
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {mobileOpen ? (
                  <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white lg:hidden"
          >
            <div className="pt-24 px-6 pb-8 h-full overflow-y-auto">
              <div className="flex flex-col gap-1">
                {navigation.map((item, i) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        href={item.href}
                        className={`block px-4 py-3.5 text-lg font-medium rounded-xl transition-colors ${
                          isActive ? 'text-brand-500 bg-brand-50' : 'text-surface-700 hover:bg-surface-50'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <Link
                  href="/contact"
                  className="btn-primary w-full justify-center text-base"
                >
                  Start Your Project
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
