'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHero from '@/components/PageHero';
import AnimatedSection from '@/components/AnimatedSection';
import CTASection from '@/components/CTASection';
import { serviceCategories } from '@/lib/data';
import { slugify } from '@/lib/slugify';

/* ServicesClient — Displays all service categories.
   ALL categories and ALL service cards are always in the DOM for crawlability.
   Tab switching uses CSS visibility, not conditional rendering. */
export default function ServicesClient() {
  const [activeCategory, setActiveCategory] = useState(serviceCategories[0].id);

  return (
    <>
      <PageHero
        tag="One Time Payment Based Services"
        title="AI powered services built for modern businesses"
        description="From website development and SaaS platforms to CRM systems and marketing automation, every service includes a dedicated account manager, weekly status reports, and post launch support."
      />

      {/* Service Methodology Intro */}
      <section className="section-padding section-light border-b border-surface-100">
        <div className="container-main max-w-3xl">
          <AnimatedSection>
            <h2 className="text-2xl font-medium mb-5">How Our Services Work</h2>
            <p className="text-surface-600 leading-relaxed mb-5">
              Every PropelusAI service follows a structured four phase process: discovery, strategy, build, and launch.
              During discovery, we audit your current systems, map your goals, and identify the highest impact opportunities.
              In strategy, we produce a detailed scope document with architecture decisions, timelines, and milestones.
              The build phase runs in weekly sprints with status updates every Friday. After launch, you receive a
              post-delivery support window for fixes, adjustments, and training.
            </p>
            <p className="text-surface-500 leading-relaxed mb-5">
              We build on modern infrastructure including <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">Next.js</a> and React for frontends, Node.js and Python for backends,
              <a href="https://www.mongodb.com" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">MongoDB</a> and PostgreSQL for data, and AWS or Vercel for deployment. AI capabilities are integrated at the
              architecture level, not added after the fact. That means your website, CRM, or SaaS platform ships
              with intelligent features from day one: personalization, predictive analytics, automated workflows, and
              real time reporting.
            </p>
            <p className="text-surface-500 leading-relaxed mb-5">
              Clients choose PropelusAI for three reasons. First, speed. Most website projects deliver in 2 to 4 weeks,
              not 2 to 4 months. Second, technical depth. Our engineers build the same architecture used by funded SaaS
              companies, not template based sites. Third, end to end ownership. We handle design, development, deployment,
              and post launch optimization under one roof, so you never coordinate between multiple vendors.
            </p>
            <p className="text-surface-500 leading-relaxed">
              We have delivered 150+ projects across SaaS, fintech, healthcare, e commerce, manufacturing, education,
              consulting, and professional services. Every engagement includes a dedicated account manager, weekly
              status reports, and comprehensive launch support.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Included features bar */}
      <section className="py-8 border-b border-surface-100 section-light">
        <div className="container-main">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-surface-500 justify-center">
            <span>Included with every engagement:</span>
            {['Dedicated account manager', 'Weekly status reports', 'Launch & optimization support'].map((f) => (
              <span key={f} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-brand-500" />
                {f}
              </span>
            ))}
          </div>
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

      {/* ALL Services — every category rendered in DOM, CSS toggles visibility */}
      <section className="section-padding section-light">
        <div className="container-main">
          {serviceCategories.map((cat) => (
            <div key={cat.id} className={activeCategory === cat.id ? 'block' : 'hidden'}>
              <div className="mb-12">
                <h2 className="text-2xl font-medium mb-2">{cat.title}</h2>
                <p className="text-surface-500">{cat.subtitle}</p>
                {cat.description && (
                  <p className="text-sm text-surface-400 mt-1 max-w-3xl">{cat.description}</p>
                )}
                <p className="text-xs text-surface-400 mt-2">{cat.services.length} Services</p>
              </div>

              <div className="space-y-6">
                {cat.services.map((service, idx) => (
                  <ServiceCard key={service.title} service={service} index={idx} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTASection
        tag="Need Help Prioritizing?"
        title="Book a service mapping session and decide in under 45 minutes."
        description="We assess your goals, budget, and timeline to build a roadmap that fits."
        primaryLabel="Schedule Consultation"
        secondaryLabel="Get Custom Quote"
        secondaryHref="/contact"
      />
    </>
  );
}

/* ServiceCard — Individual service card. Content always in DOM. */
function ServiceCard({ service, index }: { service: (typeof serviceCategories)[0]['services'][0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card"
    >
      {service.headline && (
        <p className="text-xs uppercase tracking-widest text-brand-500 font-medium mb-2">{service.headline}</p>
      )}

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-2">{service.title}</h3>
          <p className="text-sm font-medium text-surface-600 leading-relaxed">{service.summary}</p>
        </div>
      </div>

      {service.description && (
        <p className="text-sm text-surface-500 leading-relaxed mb-4">{service.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
        <span className="flex items-center gap-1.5 text-surface-500">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 1"/></svg>
          {service.timeline}
        </span>
      </div>

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
          <Link href={`/services/${slugify(service.title)}`} className="btn-primary text-sm py-2.5 px-6">View Details</Link>
          <Link href="/contact" className="btn-secondary text-sm py-2.5 px-6">Get Quote</Link>
        </div>
      </div>
    </motion.div>
  );
}
