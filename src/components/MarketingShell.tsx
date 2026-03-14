'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LeadPopup from '@/components/LeadPopup';
import AIChatbot from '@/components/AIChatbot';

export default function MarketingShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/@propelusaiadminpanel279') || pathname?.startsWith('/%40propelusaiadminpanel279') || pathname?.startsWith('/propelusaiadmin279');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <LeadPopup />
      <AIChatbot />
    </>
  );
}
