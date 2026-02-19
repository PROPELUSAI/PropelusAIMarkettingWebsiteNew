'use client';

import { useState } from 'react';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { HiOutlineBanknotes, HiOutlineRocketLaunch, HiOutlineUserGroup } from 'react-icons/hi2';

const perks = [
  { icon: HiOutlineBanknotes, title: 'Competitive Commissions', desc: 'Earn attractive commissions on every successful referral and recurring revenue from long-term clients.' },
  { icon: HiOutlineRocketLaunch, title: 'Premium AI Solutions', desc: 'Promote cutting-edge AI services including automation, CRM builds, websites, and growth strategies.' },
  { icon: HiOutlineUserGroup, title: 'Dedicated Support', desc: 'Get access to marketing materials and dedicated support to help you succeed.' },
];

export default function AffiliateClient() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', interest: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', interest: '' }); }, 3000);
  };

  return (
    <>
      <PageHero
        tag="Partnership Opportunity"
        title="Become an Affiliate of PropelusAI"
        description="Join our affiliate program and earn competitive commissions by promoting premium AI solutions that transform businesses globally."
      />

      {/* Perks */}
      <section className="section-padding section-light">
        <div className="container-main">
          <StaggerContainer className="grid md:grid-cols-3 gap-6 mb-20">
            {perks.map((perk) => (
              <StaggerItem key={perk.title}>
                <div className="card text-center h-full">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
                    <perk.icon className="w-6 h-6 text-brand-500" />
                  </div>
                  <h3 className="text-lg mb-2">{perk.title}</h3>
                  <p className="text-sm text-surface-500 leading-relaxed">{perk.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Registration — Image Left, Form Right */}
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-10">
            <span className="tag mb-4 inline-flex">Join Our Program</span>
            <h2 className="mb-3">Affiliate Registration</h2>
            <p className="text-surface-500">Fill out the form below to apply. We&apos;ll review your application and get back to you shortly.</p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
            {/* Image — Left */}
            <AnimatedSection delay={0.1}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-surface-100">
                <Image
                  src="/affiliate.png"
                  alt="Affiliate partnership"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimatedSection>

            {/* Form — Right */}
            <AnimatedSection delay={0.2}>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input type="text" placeholder="Full Name *" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-input" />
                <input type="email" placeholder="Email Address *" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="form-input" />
                <input type="tel" placeholder="Mobile Number *" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="form-input" />
                <textarea
                  placeholder="Tell Us About Your Affiliate Interest *"
                  required
                  rows={4}
                  minLength={50}
                  maxLength={500}
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="form-input resize-none"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-surface-400">{formData.interest.length}/500</p>
                  <button type="submit" className="btn-primary" disabled={submitted}>
                    {submitted ? 'Application Submitted!' : 'Submit Registration'}
                  </button>
                </div>
              </form>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Why Partner Section */}
      <section className="section-padding section-dark">
        <AnimatedSection className="container-main text-center max-w-2xl mx-auto">
          <span className="tag tag-dark mb-5 inline-flex">Why Partner With Us?</span>
          <h2 className="mb-5 text-white">PropelusAI delivers real results that make selling easy.</h2>
          <p className="text-surface-400 leading-relaxed">
            Our clients see measurable transformations — from 3× pipeline growth to 78% efficiency improvements.
            When you promote PropelusAI, you&apos;re offering proven AI solutions backed by real success stories across
            industries like SaaS, healthcare, manufacturing, and e-commerce.
          </p>
        </AnimatedSection>
      </section>
    </>
  );
}
