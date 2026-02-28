'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { HiOutlineBanknotes, HiOutlineRocketLaunch, HiOutlineUserGroup } from 'react-icons/hi2';
import { useSubmitAffiliateMutation } from '@/store';

const perks = [
  { icon: HiOutlineBanknotes, title: 'Competitive Commissions', desc: 'Earn attractive commissions on every successful referral and recurring revenue from long-term clients.' },
  { icon: HiOutlineRocketLaunch, title: 'Premium AI Solutions', desc: 'Promote cutting-edge AI services including automation, CRM builds, websites, and growth strategies.' },
  { icon: HiOutlineUserGroup, title: 'Dedicated Support', desc: 'Get access to marketing materials and dedicated support to help you succeed.' },
];

export default function AffiliateClient() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', description: '' });
  const [submitAffiliate, { isLoading, isSuccess, isError, error, reset: resetMutation }] = useSubmitAffiliateMutation();

  // Auto-reset form after 5 seconds on success
  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(() => {
      resetMutation();
    }, 5000);
    return () => clearTimeout(timer);
  }, [isSuccess, resetMutation]);

  const label = (text: string, required?: boolean) => (
    <label className="block text-xs font-medium text-surface-600 mb-1">
      {text}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitAffiliate({
        full_name: formData.name,
        email: formData.email,
        mobile_number: formData.phone,
        description: formData.description,
      }).unwrap();
      
      setFormData({ name: '', email: '', phone: '', description: '' });
    } catch (err) {
      console.error('Affiliate submission failed:', err);
    }
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

          {/* Registration */}
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-10">
            <span className="tag mb-4 inline-flex">Join Our Program</span>
            <h2 className="mb-3">Affiliate Registration</h2>
            <p className="text-surface-500">Fill out the form below to apply. We&apos;ll review your application and get back to you shortly.</p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
            <AnimatedSection delay={0.1}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-surface-100">
                <Image src="/affiliate.png" alt="Affiliate partnership" fill className="object-cover" />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              {isSuccess ? (
                <div className="card bg-brand-50 border-brand-100 text-center py-12">
                  <div className="text-4xl mb-4">🎉</div>
                  <h3 className="text-lg font-medium text-brand-700 mb-2">Application Submitted!</h3>
                  <p className="text-brand-600 text-sm">We&apos;ll review your application and get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  {isError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      {(error as { data?: { message?: string } })?.data?.message || 'Failed to submit. Please try again.'}
                    </div>
                  )}
                  <div>
                    {label('Full Name', true)}
                    <input type="text" placeholder="John Smith" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-input" disabled={isLoading} />
                  </div>
                  <div>
                    {label('Email Address', true)}
                    <input type="email" placeholder="john@company.com" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="form-input" disabled={isLoading} />
                  </div>
                  <div>
                    {label('Mobile Number', true)}
                    <input type="tel" placeholder="+1 (555) 000-0000" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="form-input" disabled={isLoading} />
                  </div>
                  <div>
                    {label('Affiliate Interest', true)}
                    <textarea
                      placeholder="Tell us about your affiliate interest and how you plan to promote PropelusAI... (min 50 characters)"
                      required
                      rows={4}
                      minLength={50}
                      maxLength={500}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="form-input resize-none"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-surface-400">{formData.description.length}/500</p>
                    <button type="submit" className="btn-primary" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        'Submit Registration'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Why Partner */}
      <section className="section-padding section-dark">
        <AnimatedSection className="container-main text-center max-w-2xl mx-auto">
          <span className="tag tag-dark mb-5 inline-flex">Why Partner With Us?</span>
          <h2 className="mb-5 text-white">PropelusAI delivers real results that make selling easy.</h2>
          <p className="text-surface-400 leading-relaxed mb-4">
            Our clients see measurable transformations — from 3× pipeline growth to 78% efficiency improvements.
            When you promote PropelusAI, you&apos;re offering proven AI solutions backed by real success stories across
            industries like SaaS, healthcare, manufacturing, and e-commerce.
          </p>
          <p className="text-surface-500 text-sm leading-relaxed">
            Join a network of affiliates who are helping businesses worldwide embrace AI-powered growth and digital transformation.
          </p>
        </AnimatedSection>
      </section>
    </>
  );
}
