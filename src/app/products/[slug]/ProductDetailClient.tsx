'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';
import CTASection from '@/components/CTASection';
import type { ProductDetail } from '@/lib/productDetails';
import { getProductBySlug } from '@/lib/productDetails';
import { getServiceBySlug } from '@/lib/serviceDetails';

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

export default function ProductDetailClient({ product }: { product: ProductDetail }) {
  const related = product.relatedSlugs.map((s) => getProductBySlug(s)).filter(Boolean) as ProductDetail[];
  const relatedServices = (product.relatedServiceSlugs || []).map((s) => getServiceBySlug(s)).filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <>
      {/* Breadcrumb */}
      <div className="pt-24 lg:pt-28 pb-2 section-light">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-sm text-surface-400">
            <Link href="/" className="hover:text-brand-500">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-brand-500">Products</Link>
            <span>/</span>
            <span className="text-surface-700">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="pt-6 pb-16 lg:pb-20 section-light">
        <div className="container-main max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="tag mb-4 inline-flex">Subscription Product</span>
            <h1 className="mb-4">{product.title}</h1>
            <p className="text-lg text-surface-500 leading-relaxed mb-3">{product.subtitle}</p>
            <p className="text-surface-500 leading-relaxed mb-6">{product.description}</p>
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
            {product.longDescription.map((para, i) => (
              <p key={i} className="text-surface-600 leading-relaxed mb-5 last:mb-0">{para}</p>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding section-light">
        <div className="container-main max-w-3xl">
          <AnimatedSection>
            <h2 className="mb-6">What You Get Every Month</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {product.expandedFeatures.map((f) => (
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
            <h2 className="mb-6">Ideal For</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {product.useCases.map((uc) => (
                <div key={uc} className="flex items-center gap-3 text-sm text-surface-700">
                  <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                  {uc}
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing */}
      {product.startingPrice && (
        <section className="py-12 section-warm">
          <div className="container-main max-w-3xl">
            <AnimatedSection>
              <h2 className="mb-4">Pricing</h2>
              <div className="card !p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-2xl font-semibold text-surface-900 mb-1">{product.startingPrice}</p>
                  <p className="text-sm text-surface-500">{product.priceNote}</p>
                </div>
                <Link href="/contact" className="btn-primary shrink-0">Get Started</Link>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* FAQ */}
      {product.faqs.length > 0 && (
        <section className="section-padding section-light">
          <div className="container-main max-w-3xl">
            <AnimatedSection>
              <h2 className="mb-6">Frequently Asked Questions</h2>
              <div className="card">
                {product.faqs.map((faq, i) => (
                  <FAQItem key={i} q={faq.question} a={faq.answer} />
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-12 section-warm">
          <div className="container-main max-w-3xl">
            <AnimatedSection>
              <h2 className="mb-6">Related Products</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link key={r.slug} href={`/products/${r.slug}`} className="card !p-4 hover:border-brand-500/30 transition-colors group">
                    <h3 className="text-sm font-medium group-hover:text-brand-500 transition-colors mb-1">{r.title}</h3>
                    <p className="text-xs text-surface-400 line-clamp-2">{r.subtitle}</p>
                  </Link>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Complementary Services */}
      {relatedServices.length > 0 && (
        <section className="py-12 section-warm">
          <div className="container-main max-w-3xl">
            <AnimatedSection>
              <h2 className="mb-6">Complementary Services</h2>
              <p className="text-sm text-surface-500 mb-4">Pair this subscription with a one time project build for a complete solution.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedServices.map((rs) => (
                  <Link key={rs.slug} href={`/services/${rs.slug}`} className="card !p-4 hover:border-brand-500/30 transition-colors group">
                    <h3 className="text-sm font-medium group-hover:text-brand-500 transition-colors mb-1">{rs.title}</h3>
                    <p className="text-xs text-surface-400 line-clamp-2">{rs.summary}</p>
                    {rs.startingPrice && <p className="text-xs text-brand-500 font-medium mt-2">{rs.startingPrice}</p>}
                  </Link>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      <CTASection
        tag="Ready to Subscribe?"
        title="Start your AI powered growth subscription today."
        description="Each product includes ongoing optimization, monthly reporting, and dedicated support."
        primaryLabel="Talk to Our Team"
        primaryHref="/contact"
        secondaryLabel="View All Products"
        secondaryHref="/products"
      />
    </>
  );
}
