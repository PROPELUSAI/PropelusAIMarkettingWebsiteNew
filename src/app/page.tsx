'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import CTASection from '@/components/CTASection';
import { stats, products, testimonials } from '@/lib/data';

/* ============================================
   Home Page
   ============================================ */

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.7, 0.95]);

  return (
    <section ref={ref} className="relative h-screen min-h-[640px] max-h-[900px] overflow-hidden flex items-center">
      {/* Video */}
      <motion.div style={{ scale: videoScale }} className="absolute top-0 left-0 right-0 -bottom-[25%]">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="/PropelusAI___Hero_Section_720p.mp4"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Overlay */}
      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-surface-950" />

      {/* Gradient bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-[1]" />

      {/* Content */}
      <div className="relative z-10 container-main">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="tag tag-dark mb-6 inline-flex">
              Intentional · Intelligent · Impact-Driven
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="text-white mb-5 leading-[1.1]"
          >
            AI Powered Growth for Modern Businesses
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-white/70 text-lg mb-8 max-w-xl leading-relaxed"
          >
            We build premium AI-driven websites, CRM systems, and subscription-based growth engines with enterprise-level precision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link href="/contact" className="btn-primary">
              Get a Custom Proposal
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <Link href="/services" className="btn-outline-light">
              Explore AI Services
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  return (
    <section className="section-light py-16 lg:py-20 border-b border-surface-100">
      <StaggerContainer className="container-main grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        {stats.map((stat) => (
          <StaggerItem key={stat.label} className="text-center">
            <div className="text-3xl lg:text-4xl font-semibold text-surface-900 mb-1.5">{stat.value}</div>
            <div className="text-sm text-surface-500">{stat.label}</div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}

function Marquee() {
  const items = [
    'LinkedIn Advertising', 'Content Engine', 'CRM Development', 'Meta Ads',
    'Website Building', 'Mobile Apps', 'Lead Generation', 'Marketing Automation',
    'Cold Calling', 'Cybersecurity', 'Funnel Analytics', 'Brand Identity',
  ];

  return (
    <section className="py-8 bg-surface-900 border-y border-white/[0.06] overflow-hidden">
      <div className="marquee-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-6 px-6 text-sm text-white/80 font-medium whitespace-nowrap">
            {item}
            <span className="w-1 h-1 rounded-full bg-brand-400 opacity-60" />
          </span>
        ))}
      </div>
    </section>
  );
}

function Pathways() {
  const productFeatures = ['LinkedIn Ads', 'Content Engine', 'CRM Subscription', 'Lead Scoring', 'Meta Ads', 'Funnel Analytics'];
  const serviceFeatures = ['Website Building', 'Mobile Apps', 'Custom CRM', 'Domain Setup', 'Cybersecurity', 'Marketing Automation'];

  return (
    <section className="section-padding section-light relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="container-main relative">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
          <span className="tag mb-4 inline-flex">AI Solutions</span>
          <h2 className="mb-4">One brand. Two growth pathways.</h2>
          <p className="text-lg text-surface-500">Choose the path that fits your business — or combine both for maximum impact.</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto relative">
          {/* Center connector */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-brand-500 items-center justify-center text-white text-sm font-bold shadow-[0_0_30px_rgba(99,91,255,0.3)]">
            OR
          </div>

          {/* Products Card */}
          <AnimatedSection delay={0.1}>
            <div className="group h-full flex flex-col rounded-2xl border border-surface-100 bg-[#f5f5f7] p-8 lg:p-10 transition-all duration-300 hover:border-brand-500/30 hover:shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <span className="text-xs font-medium text-brand-500 uppercase tracking-wider">Recurring</span>
                  <h3 className="text-surface-900 text-xl">AI Products</h3>
                </div>
              </div>

              <p className="text-surface-500 text-sm mb-8 leading-relaxed">Monthly & quarterly subscriptions — AI systems that continuously optimize and scale your growth.</p>

              <div className="flex flex-wrap gap-2 mb-8 flex-1">
                {productFeatures.map((feature) => (
                  <span key={feature} className="px-3 py-1.5 text-xs font-medium text-surface-600 bg-surface-50 rounded-full border border-surface-200">
                    {feature}
                  </span>
                ))}
              </div>

              <Link href="/products" className="btn-primary w-full justify-center mt-auto">
                Explore AI Products
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
          </AnimatedSection>

          {/* Services Card */}
          <AnimatedSection delay={0.2}>
            <div className="group h-full flex flex-col rounded-2xl border border-surface-100 bg-[#f5f5f7] p-8 lg:p-10 transition-all duration-300 hover:border-brand-500/30 hover:shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <span className="text-xs font-medium text-brand-500 uppercase tracking-wider">One-Time</span>
                  <h3 className="text-surface-900 text-xl">AI Services</h3>
                </div>
              </div>

              <p className="text-surface-500 text-sm mb-8 leading-relaxed">High-impact project builds — permanent infrastructure that creates a lasting foundation for growth.</p>

              <div className="flex flex-wrap gap-2 mb-8 flex-1">
                {serviceFeatures.map((feature) => (
                  <span key={feature} className="px-3 py-1.5 text-xs font-medium text-surface-600 bg-surface-50 rounded-full border border-surface-200">
                    {feature}
                  </span>
                ))}
              </div>

              <Link href="/services" className="btn-primary w-full justify-center mt-auto">
                Explore AI Services
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { title: 'Global Presence', desc: 'Serving clients worldwide with 24/5 coverage' },
    { title: 'Industry Agnostic', desc: 'All industries welcome — tailored solutions' },
    { title: 'Full Funnel', desc: 'Web → App → CRM → Ads → Automation' },
  ];

  return (
    <section className="py-16 section-warm border-y border-surface-100">
      <StaggerContainer className="container-main grid md:grid-cols-3 gap-8">
        {features.map((f) => (
          <StaggerItem key={f.title} className="text-center">
            <h3 className="text-base font-medium text-surface-800 mb-1">{f.title}</h3>
            <p className="text-sm text-surface-500">{f.desc}</p>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}

function TestimonialHighlight() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % testimonials.length, 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + testimonials.length) % testimonials.length, -1);
  }, [current, goTo]);

  // Auto-rotate every 6 seconds
  useEffect(() => {
    timeoutRef.current = setTimeout(next, 6000);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [current, next]);

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  const initials = testimonials[current].role.split(',')[0].split(' ').map(w => w[0]).join('').slice(0, 2);

  return (
    <section className="py-12 lg:py-16 section-dark relative overflow-hidden">
      {/* Prev button — pinned to viewport left */}
      <button
        onClick={prev}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        aria-label="Previous testimonial"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 4l-4 4 4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      {/* Next button — pinned to viewport right */}
      <button
        onClick={next}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        aria-label="Next testimonial"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      <div className="container-main text-center">
        <AnimatedSection>
          <span className="tag tag-dark mb-5 inline-flex">Testimonials</span>
        </AnimatedSection>

        <div className="relative flex items-center justify-center">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="max-w-2xl mx-auto"
          >
            {/* Avatar */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-base font-semibold text-brand-400">
                {initials}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white/90">{testimonials[current].role.split(',')[0]}</p>
                <p className="text-xs text-white/40">{testimonials[current].industry}</p>
              </div>
            </div>

            <blockquote className="text-lg lg:text-xl font-light text-white/90 leading-relaxed">
              &ldquo;{testimonials[current].quote}&rdquo;
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <Marquee />
      <Pathways />
      <Features />
      <TestimonialHighlight />
      <CTASection
        tag="Ready to Build?"
        title="Let's create the most powerful version of your business."
        description="Whether you need a complete AI ecosystem or a single high-impact product, we'll help you launch with clarity and measurable results."
        dark={false}
      />
    </>
  );
}
