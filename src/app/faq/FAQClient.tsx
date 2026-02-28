'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PageHero from '@/components/PageHero';
import AnimatedSection from '@/components/AnimatedSection';
import CTASection from '@/components/CTASection';
import { faqCategories } from '@/lib/data';

export default function FAQClient() {
  return (
    <>
      <PageHero
        tag="Clarity & Confidence"
        title="Frequently Asked Questions"
        description="Everything you need to know about PropelusAI in one place. Below are the most common questions clients ask us about our process, pricing, timelines, support, confidentiality, and the difference between our Services (one-time builds) and Products (monthly subscriptions). If your question isn't listed here, simply reach out — our team will respond within one business day."
      />

      <section className="section-padding section-light">
        <div className="container-main max-w-3xl">
          {faqCategories.map((category, catIdx) => (
            <AnimatedSection key={category.title} delay={catIdx * 0.05} className="mb-12 last:mb-0">
              <h2 className="text-xl font-medium mb-5 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center text-sm font-mono">{catIdx + 1}</span>
                {category.title}
              </h2>
              <div className="space-y-2">
                {category.items.map((item, idx) => (
                  <FAQItem key={idx} question={item.q} answer={item.a} />
                ))}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <CTASection
        tag="Still Have Questions?"
        title="Still have questions? We're one message away."
        description="Whether you're planning a one-time AI project or exploring subscription-based AI products, our team will help you choose the best path."
        primaryLabel="Contact Us"
        secondaryLabel="Start Your Project"
        secondaryHref="/contact"
      />
    </>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-surface-100 rounded-xl overflow-hidden bg-white hover:border-surface-200 transition-colors">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-[0.9375rem] font-medium text-surface-700">{question}</span>
        <motion.svg
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 text-surface-400 shrink-0"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M10 4v12M4 10h12" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm text-surface-500 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
