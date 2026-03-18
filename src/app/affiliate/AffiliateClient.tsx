/**
 * AffiliateClient.tsx — Affiliate program page (client component).
 * Shows three perk cards, a registration form (name, email, phone, description),
 * and a "Why Partner With Us" section. Submits via RTK Query mutation
 * with 5-second auto-reset on success.
 */
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import CTASection from '@/components/CTASection';
import { HiOutlineBanknotes, HiOutlineRocketLaunch, HiOutlineUserGroup } from 'react-icons/hi2';
import { useSubmitAffiliateMutation } from '@/store';
import FormSelect, { SelectOption } from '@/components/ui/FormSelect';
import FormField from '@/components/ui/FormField';

/** Affiliate program benefits displayed as icon cards */
const perks = [
  { icon: HiOutlineBanknotes, title: 'Competitive Commissions', desc: 'Earn attractive commissions on every successful referral and recurring revenue from long-term clients.' },
  { icon: HiOutlineRocketLaunch, title: 'Premium AI Solutions', desc: 'Promote cutting edge AI services including automation, CRM builds, websites, and growth strategies.' },
  { icon: HiOutlineUserGroup, title: 'Dedicated Support', desc: 'Get access to marketing materials and dedicated support to help you succeed.' },
];

/** Renders the affiliate page: hero, perks grid, registration form, and partnership section */
export default function AffiliateClient() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', description: '', hasNetwork: '', networkType: '', industry: '' });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const serviceOptions = [
    'AI Website Building', 'Mobile App Development', 'Custom CRM Development',
    'LinkedIn Advertising', 'Meta & Google Ads', 'Content Marketing',
    'Marketing Automation', 'Lead Generation', 'Cybersecurity',
  ];

  const toggleService = (s: string) => {
    setSelectedServices((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };
  const networkTypeOptions: SelectOption[] = [
    { value: 'b2b', label: 'B2B' },
    { value: 'b2c', label: 'B2C' },
    { value: 'both', label: 'Both' },
  ];

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitAffiliate, { isLoading, isSuccess, isError, error, reset: resetMutation }] = useSubmitAffiliateMutation();

  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(() => resetMutation(), 5000);
    return () => clearTimeout(timer);
  }, [isSuccess, resetMutation]);

  const clearErr = (field: string) => {
    if (fieldErrors[field]) setFieldErrors((p) => { const { [field]: _, ...rest } = p; return rest; });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please enter your full name';
    if (!formData.email.trim()) errs.email = 'Please enter your email address';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Please enter a valid email address';
    if (!formData.phone.trim()) errs.phone = 'Please enter your mobile number';
    if (!formData.description.trim()) errs.description = 'Please describe your affiliate interest';
    else if (formData.description.trim().length < 50) errs.description = 'Please write at least 50 characters';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await submitAffiliate({
        full_name: formData.name,
        email: formData.email,
        mobile_number: formData.phone,
        description: formData.description,
        has_network: formData.hasNetwork || null,
        network_type: formData.networkType || null,
        industry: formData.industry || null,
        interested_services: selectedServices.length > 0 ? selectedServices : null,
      }).unwrap();

      setFormData({ name: '', email: '', phone: '', description: '', hasNetwork: '', networkType: '', industry: '' });
      setSelectedServices([]);
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

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
            <AnimatedSection delay={0.1}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-surface-100">
                <Image src="/affiliate.png" alt="Affiliate partnership" fill className="object-cover" />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              {isSuccess ? (
                <div className="card bg-brand-50 border-brand-100 text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-status-success/10 flex items-center justify-center mx-auto mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-status-success"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <h3 className="text-lg font-medium text-brand-700 mb-2">Application Submitted!</h3>
                  <p className="text-brand-600 text-sm">We&apos;ll review your application and get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-3">
                  {isError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      {(error as { data?: { message?: string } })?.data?.message || 'Failed to submit. Please try again.'}
                    </div>
                  )}
                  <FormField label="Full Name" required error={fieldErrors.name}>
                    <input type="text" placeholder="John Smith" value={formData.name} onChange={(e) => { setFormData({ ...formData, name: e.target.value }); clearErr('name'); }} className={`form-input ${fieldErrors.name ? 'border-red-400' : ''}`} disabled={isLoading} />
                  </FormField>
                  <FormField label="Email Address" required error={fieldErrors.email}>
                    <input type="email" placeholder="john@company.com" value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); clearErr('email'); }} className={`form-input ${fieldErrors.email ? 'border-red-400' : ''}`} disabled={isLoading} />
                  </FormField>
                  <FormField label="Mobile Number" required error={fieldErrors.phone}>
                    <input type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); clearErr('phone'); }} className={`form-input ${fieldErrors.phone ? 'border-red-400' : ''}`} disabled={isLoading} />
                  </FormField>
                  <FormField label="Do you have your own network?">
                    <div className="flex gap-4 mt-1">
                      {['yes', 'no'].map((opt) => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="hasNetwork" value={opt} checked={formData.hasNetwork === opt} onChange={(e) => setFormData({ ...formData, hasNetwork: e.target.value })} className="accent-brand-500" disabled={isLoading} />
                          <span className="text-sm text-surface-600 capitalize">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </FormField>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="B2B or B2C focus?">
                      <FormSelect options={networkTypeOptions} value={formData.networkType} onChange={(v) => setFormData({ ...formData, networkType: v })} placeholder="Select..." disabled={isLoading} />
                    </FormField>
                    <FormField label="Industry">
                      <input type="text" placeholder="e.g. SaaS, Healthcare" value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} className="form-input" disabled={isLoading} />
                    </FormField>
                  </div>
                  <FormField label="Which services interest your network?">
                    <div className="flex flex-wrap gap-2 mt-1">
                      {serviceOptions.map((s) => (
                        <button key={s} type="button" onClick={() => toggleService(s)} disabled={isLoading} className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${selectedServices.includes(s) ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-surface-600 border-surface-200 hover:border-brand-300'}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </FormField>
                  <FormField label="Affiliate Interest" required error={fieldErrors.description}>
                    <textarea
                      placeholder="Tell us about your affiliate interest and how you plan to promote PropelusAI... (min 50 characters)"
                      rows={4}
                      maxLength={500}
                      value={formData.description}
                      onChange={(e) => { setFormData({ ...formData, description: e.target.value }); clearErr('description'); }}
                      className={`form-input resize-none ${fieldErrors.description ? 'border-red-400' : ''}`}
                      disabled={isLoading}
                    />
                  </FormField>
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

      <CTASection
        tag="Why Partner With Us?"
        title="PropelusAI delivers real results that make selling easy."
        description="Our clients see measurable transformations, from 3x pipeline growth to 78% efficiency improvements. Join a network of affiliates helping businesses worldwide embrace AI powered growth."
        primaryLabel="Start Your Project"
        primaryHref="/contact"
        secondaryLabel="Explore Services"
        secondaryHref="/services"
      />
    </>
  );
}
