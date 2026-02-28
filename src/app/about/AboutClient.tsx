'use client';

import Link from 'next/link';
import PageHero from '@/components/PageHero';
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import CTASection from '@/components/CTASection';
import { values, siteConfig } from '@/lib/data';

export default function AboutClient() {
  return (
    <>
      <PageHero
        tag="Who We Are"
        title="About PropelusAI - AI Powered Growth"
        description="Design-first. AI native. Globally trusted."
      />

      {/* Story */}
      <section className="section-padding section-light">
        <div className="container-main max-w-3xl">
          <AnimatedSection>
            <p className="text-lg text-surface-600 leading-relaxed mb-6">
              PropelusAI is a next-generation AI company delivering premium websites, CRM systems, automation engines,
              and subscription based AI products. We specialize in helping businesses scale with precision, intelligence,
              and uncompromising quality.
            </p>
            <p className="text-surface-500 leading-relaxed mb-6">
              Founded on the belief that modern businesses need AI powered systems that evolve, we combine product thinking,
              enterprise grade engineering, and a disciplined design philosophy to deliver measurable growth for global teams
              across industries.
            </p>
            <p className="text-surface-500 leading-relaxed">
              Today we business globally providing 24/5 coverage for long term partnership.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding section-dark">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-white">Mission & Vision</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <AnimatedSection delay={0.1}>
              <div className="card-dark rounded-2xl p-8 h-full">
                <h3 className="text-lg text-white mb-3">Mission</h3>
                <p className="text-surface-400 leading-relaxed">
                  To build AI powered systems that transform how businesses operate, scale, and grow with clarity, speed, and measurable ROI.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="card-dark rounded-2xl p-8 h-full">
                <h3 className="text-lg text-white mb-3">Vision</h3>
                <p className="text-surface-400 leading-relaxed">
                  To become the world&apos;s most trusted partner for premium AI driven transformations — solutions that feel handcrafted, intelligent, and built to last.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding section-light">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <span className="tag mb-4 inline-flex">What We Stand For</span>
            <h2>Our Values</h2>
          </AnimatedSection>
          <StaggerContainer className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {values.map((v, i) => (
              <StaggerItem key={v.title}>
                <div className="card h-full">
                  <div className="text-sm font-mono text-brand-500 mb-3">0{i + 1}</div>
                  <h3 className="text-lg mb-2">{v.title}</h3>
                  <p className="text-sm text-surface-500 leading-relaxed">{v.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Offices */}
      <section className="section-padding section-warm">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <h2 className="mb-3">Global Offices & Contact Information</h2>
            <p className="text-surface-500">We operate with offices in the US and IN only:</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <AnimatedSection delay={0.1}>
              <div className="card text-center h-full">
                <h3 className="text-base font-medium mb-2">Arizona, USA</h3>
                <p className="text-sm text-surface-500">BETH and friends LLC</p>
                <p className="text-sm text-surface-400">West Hide Trail, Phoenix, AZ 85085</p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <div className="card text-center h-full">
                <h3 className="text-base font-medium mb-2">Gujarat & West Bengal, India</h3>
                <p className="text-sm text-surface-500">RBSS VENTURES (Propelus by RBSS)</p>
                <p className="text-sm text-surface-400">Surat & Kolkata</p>
                <p className="text-xs text-surface-400 mt-1">GSTIN: 19ABMFR6144D1ZZ</p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="card text-center h-full">
                <h3 className="text-base font-medium mb-2">Contact Information</h3>
                <p className="text-sm text-surface-500">{siteConfig.email}</p>
                <p className="text-sm text-surface-400 mt-1">WhatsApp IN: {siteConfig.whatsapp.in}</p>
                <p className="text-sm text-surface-400">WhatsApp US: {siteConfig.whatsapp.us}</p>
                <p className="text-sm text-surface-400 mt-2">24/5 Global Support</p>
                <p className="text-xs text-surface-400">Enterprise clients: 4-hour response</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <CTASection
        tag="Ready to build?"
        title="Ready to build the AI powered future of your business?"
        description="Whether you need a one time transformation or ongoing AI driven growth, PropelusAI will architect the system that takes your business to the next level."
        primaryLabel="Start Your Project"
        secondaryLabel="Explore AI Products"
        secondaryHref="/products"
      />
    </>
  );
}
