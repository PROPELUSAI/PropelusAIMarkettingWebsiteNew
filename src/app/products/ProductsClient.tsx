'use client';

import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import CTASection from '@/components/CTASection';
import { products } from '@/lib/data';

const iconMap: Record<string, React.ReactNode> = {
  linkedin: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M8 11v5M8 8v.01M12 16v-5c0-1.1.9-2 2-2s2 .9 2 2v5"/></svg>,
  content: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z"/></svg>,
  phone: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  ads: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>,
  crm: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  edit: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  video: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  strategy: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
  users: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  message: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  calendar: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  chart: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  shield: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
};

export default function ProductsClient() {
  return (
    <>
      <PageHero
        tag="Subscription-Based AI Products"
        title="AI Products Designed for Predictable, Compounding Growth"
        description="High performance AI systems that work for you. Our AI Products are recurring, subscription-based systems designed to deliver consistent growth across your pipeline, content, CRM, ads, and funnel analytics. Built for global teams, each Product includes ongoing optimization, monthly reporting, and continuous AI-driven improvements."
      />

      <section className="section-padding section-light">
        <div className="container-main">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl font-semibold mb-3">AI Products, Fully Expanded</h2>
            <p className="text-surface-500 text-sm">Each product includes SEO optimization, detailed deliverables, and ongoing support.</p>
          </div>
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <StaggerItem key={product.id}>
                <div className="card h-full flex flex-col group">
                  <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center mb-5 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300">
                    {iconMap[product.icon]}
                  </div>
                  <h3 className="text-lg mb-2">{product.title}</h3>
                  <p className="text-sm text-surface-600 font-medium mb-2 leading-relaxed">{product.subtitle}</p>
                  <p className="text-sm text-surface-500 mb-5 leading-relaxed">{product.description}</p>
                  <div className="mt-auto">
                    <h4 className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-3">Deliverables</h4>
                    <ul className="space-y-1.5 mb-6">
                      {product.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-sm text-surface-600">
                          <svg className="w-3.5 h-3.5 mt-1 text-brand-500 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          {d}
                        </li>
                      ))}
                    </ul>
                    <Link href="/contact" className="btn-primary w-full justify-center text-sm py-3">
                      Get Quote
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <CTASection
        tag="Ready to Scale"
        title="Ready for subscription-based AI growth?"
        description="Choose an AI Product that fits your goals, or bundle multiple for maximum impact. Our team will help you customize the right monthly plan."
        primaryLabel="Talk to Our Team"
        secondaryLabel="View Services"
        secondaryHref="/services"
      />
    </>
  );
}
