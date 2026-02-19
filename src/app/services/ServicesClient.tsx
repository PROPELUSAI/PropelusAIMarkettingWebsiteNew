'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PageHero from '@/components/PageHero';
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import CTASection from '@/components/CTASection';
import { serviceCategories } from '@/lib/data';

export default function ServicesClient() {
  const [activeCategory, setActiveCategory] = useState(serviceCategories[0].id);
  const activeCat = serviceCategories.find((c) => c.id === activeCategory) || serviceCategories[0];

  return (
    <>
      <PageHero
        tag="Service Catalog"
        title="AI-powered services, meticulously designed for modern businesses"
        description="Every service ships with dedicated support, weekly reporting, and measurable business outcomes. Premium build quality from start to finish."
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
            <p className="text-sm text-surface-400 mt-1">{activeCat.services.length} Services</p>
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
        tag="Ready to Scale"
        title="Let's build the system your business needs."
        description="Choose a service or bundle multiple for a complete AI transformation."
        primaryLabel="Get a Quote"
        secondaryLabel="View Products"
        secondaryHref="/products"
      />
    </>
  );
}

function ServiceCard({ service, index }: { service: (typeof serviceCategories)[0]['services'][0]; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="card"
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-1">{service.title}</h3>
          <p className="text-sm text-surface-500 leading-relaxed">{service.summary}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-xs text-surface-400 uppercase tracking-wider mb-1">Investment</div>
          <div className="text-sm font-medium text-surface-700">{service.investment}</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
        <span className="flex items-center gap-1.5 text-surface-500">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 1"/></svg>
          {service.timeline}
        </span>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1"
      >
        {expanded ? 'Show less' : 'View features'}
        <motion.svg
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M4 6l4 4 4-4" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-5 mt-5 border-t border-surface-100">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {service.features.map((f) => (
                  <span key={f} className="flex items-start gap-2 text-sm text-surface-600 py-1">
                    <svg className="w-3.5 h-3.5 mt-1 text-brand-500 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {f}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link href="/contact" className="btn-primary text-sm py-2.5 px-6">Get Detailed Quote</Link>
                <Link href="/contact" className="btn-secondary text-sm py-2.5 px-6">Schedule Consultation</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
