'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';
import CTASection from '@/components/CTASection';
import type { ServiceDetail } from '@/lib/serviceDetails';
import { getServiceBySlug } from '@/lib/serviceDetails';
import { getProductBySlug } from '@/lib/productDetails';

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-surface-100 last:border-0">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="w-full flex items-center justify-between py-4 text-left">
        <span className="text-sm font-medium text-surface-800 pr-4">{q}</span>
        <svg className={`w-4 h-4 shrink-0 text-surface-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="pb-4 text-sm text-surface-500 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function ServiceDetailClient({ service }: { service: ServiceDetail }) {
  const related = service.relatedSlugs.map((s) => getServiceBySlug(s)).filter(Boolean) as ServiceDetail[];
  const relatedProducts = (service.relatedProductSlugs || []).map((s) => getProductBySlug(s)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      {/* Breadcrumb */}
      <div className="pt-24 lg:pt-28 pb-2 section-light">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-sm text-surface-400">
            <Link href="/" className="hover:text-brand-500">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-brand-500">Services</Link>
            <span>/</span>
            <span className="text-surface-700">{service.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="pt-6 pb-16 lg:pb-20 section-light">
        <div className="container-main max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="tag mb-4 inline-flex">{service.categoryTitle}</span>
            <h1 className="mb-4">{service.title}</h1>
            <p className="text-lg text-surface-500 leading-relaxed mb-6">{service.summary}</p>
            <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-surface-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 1"/></svg>
                {service.timeline}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">Get a Quote</Link>
              <Link href="/contact" className="btn-secondary">Schedule Consultation</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Long Description */}
      <section className="section-padding section-warm">
        <div className="container-main max-w-3xl">
          <AnimatedSection>
            {service.longDescription.map((para, i) => (
              <p key={i} className="text-surface-600 leading-relaxed mb-5 last:mb-0">{para}</p>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Deliverables */}
      <section className="section-padding section-light">
        <div className="container-main max-w-3xl">
          <AnimatedSection>
            <h2 className="mb-6">What You Receive</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {service.features.map((f) => (
                <div key={f} className="flex items-start gap-3 p-3 rounded-lg bg-surface-50 border border-surface-100">
                  <svg className="w-4 h-4 mt-0.5 text-brand-500 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span className="text-sm text-surface-700">{f}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-12 section-warm">
        <div className="container-main max-w-3xl">
          <AnimatedSection>
            <h2 className="mb-6">Who This Is For</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {service.useCases.map((uc) => (
                <div key={uc} className="flex items-center gap-3 text-sm text-surface-700">
                  <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                  {uc}
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding section-light">
        <div className="container-main max-w-3xl">
          <AnimatedSection>
            <h2 className="mb-8">Our Process</h2>
            <div className="space-y-4">
              {service.process.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-medium shrink-0">{i + 1}</div>
                  <p className="text-sm text-surface-700 pt-1.5">{step}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing */}
      {service.startingPrice && (
        <section className="py-12 section-warm">
          <div className="container-main max-w-3xl">
            <AnimatedSection>
              <h2 className="mb-4">Pricing</h2>
              <div className="card !p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-2xl font-semibold text-surface-900 mb-1">{service.startingPrice}</p>
                  <p className="text-sm text-surface-500">{service.priceNote}</p>
                </div>
                <Link href="/contact" className="btn-primary shrink-0">Get Custom Quote</Link>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* FAQ */}
      {service.faqs.length > 0 && (
        <section className="py-12 section-warm">
          <div className="container-main max-w-3xl">
            <AnimatedSection>
              <h2 className="mb-6">Frequently Asked Questions</h2>
              <div className="card">
                {service.faqs.map((faq, i) => (
                  <FAQItem key={i} q={faq.question} a={faq.answer} />
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Related Services */}
      {related.length > 0 && (
        <section className="section-padding section-light">
          <div className="container-main max-w-3xl">
            <AnimatedSection>
              <h2 className="mb-6">Related Services</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link key={r.slug} href={`/services/${r.slug}`} className="card !p-4 hover:border-brand-500/30 transition-colors group">
                    <h3 className="text-sm font-medium group-hover:text-brand-500 transition-colors mb-1">{r.title}</h3>
                    <p className="text-xs text-surface-400 line-clamp-2">{r.summary}</p>
                  </Link>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 section-warm">
          <div className="container-main max-w-3xl">
            <AnimatedSection>
              <h2 className="mb-6">Complementary AI Products</h2>
              <p className="text-sm text-surface-500 mb-4">Pair this service with a monthly subscription product for ongoing optimization.</p>
              <div className="grid sm:grid-cols-3 gap-4">
                {relatedProducts.map((rp) => (
                  <Link key={rp.slug} href={`/products/${rp.slug}`} className="card !p-4 hover:border-brand-500/30 transition-colors group">
                    <h3 className="text-sm font-medium group-hover:text-brand-500 transition-colors mb-1">{rp.title}</h3>
                    <p className="text-xs text-surface-400 line-clamp-2">{rp.subtitle}</p>
                    {rp.startingPrice && <p className="text-xs text-brand-500 font-medium mt-2">{rp.startingPrice}</p>}
                  </Link>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      <CTASection
        tag="Ready to Get Started?"
        title="Let us build the right solution for your business."
        description="Every engagement includes a dedicated account manager, weekly status updates, and post launch support."
        primaryLabel="Start Your Project"
        primaryHref="/contact"
        secondaryLabel="View All Services"
        secondaryHref="/services"
      />
    </>
  );
}
