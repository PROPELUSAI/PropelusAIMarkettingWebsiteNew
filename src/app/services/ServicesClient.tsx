'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PageHero from '@/components/PageHero';
import AnimatedSection from '@/components/AnimatedSection';
import CTASection from '@/components/CTASection';
import { serviceCategories } from '@/lib/data';

export default function ServicesClient() {
  const [activeCategory, setActiveCategory] = useState(serviceCategories[0].id);
  const activeCat = serviceCategories.find((c) => c.id === activeCategory) || serviceCategories[0];

  return (
    <>
      <PageHero
        tag="One Time Payment Based Services"
        title="AI powered services, meticulously designed for modern businesses"
        description="Every service ships with dual-theme UI systems, bespoke components, micro-interactions, and measurable business outcomes. No gradients. Only premium build quality. Each engagement includes a dedicated account manager and technical pod, weekly executive-ready status reports, light and dark mode parity, plus comprehensive launch, enablement, and optimization support."
      />

      {/* Included features bar */}
      <section className="py-8 border-b border-surface-100 section-light">
        <div className="container-main">
          <AnimatedSection>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-surface-500 justify-center">
              <span>Included with every engagement:</span>
              {['Dedicated account manager', 'Weekly status reports', 'Launch & optimization support'].map((f) => (
                <span key={f} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-brand-500" />
                  {f}
                </span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="sticky top-[72px] z-30 bg-white/90 nav-blur border-b border-surface-100">
        <div className="container-main">
          <div className="flex gap-1 overflow-x-auto py-3 no-scrollbar">
            {serviceCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-surface-900 text-white'
                    : 'text-surface-500 hover:text-surface-700 hover:bg-surface-50'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="section-padding section-light">
        <div className="container-main">
          <AnimatedSection className="mb-12">
            <h2 className="text-2xl font-medium mb-2">{activeCat.title}</h2>
            <p className="text-surface-500">{activeCat.subtitle}</p>
            {activeCat.description && (
              <p className="text-sm text-surface-400 mt-1 max-w-3xl">{activeCat.description}</p>
            )}
            <p className="text-xs text-surface-400 mt-2">{activeCat.services.length} Services</p>
          </AnimatedSection>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              {activeCat.services.map((service, idx) => (
                <ServiceCard key={service.title} service={service} index={idx} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <CTASection
        tag="Need Help Prioritizing?"
        title="Book a service mapping session and decide in under 45 minutes."
        description="We assess maturity, budget, and impact to craft a roadmap that feels both premium and practical."
        primaryLabel="Schedule Consultation"
        secondaryLabel="Get Custom Quote"
        secondaryHref="/contact"
      />
    </>
  );
}

function ServiceCard({ service, index }: { service: (typeof serviceCategories)[0]['services'][0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="card"
    >
      {/* Headline eyebrow */}
      {service.headline && (
        <p className="text-xs uppercase tracking-widest text-brand-500 font-medium mb-2">{service.headline}</p>
      )}

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-2">{service.title}</h3>
          <p className="text-sm font-medium text-surface-600 leading-relaxed">{service.summary}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-xs text-surface-400 uppercase tracking-wider mb-1">Investment</div>
          <div className="text-sm font-medium text-surface-700">{service.investment}</div>
        </div>
      </div>

      {/* Description paragraph */}
      {service.description && (
        <p className="text-sm text-surface-500 leading-relaxed mb-4">{service.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
        <span className="flex items-center gap-1.5 text-surface-500">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 1"/></svg>
          {service.timeline}
        </span>
      </div>

      {/* Deliverables section */}
      <div className="pt-4 border-t border-surface-100">
        <p className="text-xs uppercase tracking-widest text-surface-400 font-semibold mb-3">Deliverables:</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-5">
          {service.features.map((f) => (
            <span key={f} className="flex items-start gap-2 text-sm text-surface-600 py-1">
              <svg className="w-3.5 h-3.5 mt-1 text-brand-500 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {f}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/contact" className="btn-primary text-sm py-2.5 px-6">Get Detailed Quote</Link>
          <Link href="/contact" className="btn-secondary text-sm py-2.5 px-6">Schedule Consultation</Link>
        </div>
      </div>
    </motion.div>
  );
}
