'use client';

import { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import PageHero from '@/components/PageHero';
import AnimatedSection from '@/components/AnimatedSection';
import EmbeddedCalendar from '@/components/EmbeddedCalendar';
import CTASection from '@/components/CTASection';
import FormSelect, { SelectOption } from '@/components/ui/FormSelect';
import FormField from '@/components/ui/FormField';
import { siteConfig } from '@/lib/data';
import { countries } from '@/lib/countries';
import { detectCountry } from '@/lib/geoip';
import { useSubmitContactMutation } from '@/store';

const teamSizeOptions: SelectOption[] = [
  { value: 'Just me', label: 'Just me' },
  { value: '2-10', label: '2-10' },
  { value: '11-50', label: '11-50' },
  { value: '51-100', label: '51-100' },
  { value: '101-500', label: '101-500' },
  { value: '501-1000', label: '501-1,000' },
  { value: '1001-10000', label: '1,001-10,000' },
  { value: '10000+', label: '10,000+' },
];

const serviceOptions: SelectOption[] = [
  { value: 'ai-website', label: 'AI Website Building' },
  { value: 'mobile-app', label: 'Mobile Application Development' },
  { value: 'crm-building', label: 'CRM Building & Integration' },
  { value: 'linkedin-ads', label: 'LinkedIn Advertising' },
  { value: 'meta-google-ads', label: 'Meta & Google Ads' },
  { value: 'content-marketing', label: 'Content Creation & Marketing' },
  { value: 'lead-generation', label: 'Lead Generation & Management' },
  { value: 'marketing-automation', label: 'Marketing Automation' },
  { value: 'saas-development', label: 'SaaS Development' },
  { value: 'cybersecurity', label: 'Cybersecurity & Data Protection' },
  { value: 'mediaworks', label: 'MediaWorks (Video, Branding, Design)' },
  { value: 'email-domain', label: 'Email & Domain Setup' },
  { value: 'full-suite', label: 'Full AI Growth Suite' },
  { value: 'other', label: 'Other / Not Sure Yet' },
];

const countryOptions: SelectOption[] = countries.map((c) => ({ value: c, label: c }));

const contactInfo = [
  { label: 'Email', value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { label: 'WhatsApp (IN)', value: siteConfig.whatsapp.in, href: `https://wa.me/${siteConfig.whatsapp.in.replace(/\s/g, '')}` },
  { label: 'WhatsApp (US)', value: siteConfig.whatsapp.us, href: `https://wa.me/${siteConfig.whatsapp.us.replace(/\s/g, '')}` },
  { label: 'Business Hours', value: '9:00 AM to 12:00 AM IST (GMT+5:30)', href: '' },
];

const reasons = [
  { title: 'Fast Response', desc: 'We reply within 24 hours' },
  { title: 'Clear Roadmapping', desc: 'Every conversation ends with clarity' },
  { title: 'AI Native Expertise', desc: 'One unified system approach' },
  { title: 'Global Support', desc: 'Handle clients worldwide' },
];

type FieldErrors = Record<string, string>;

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: '', company: '', email: '', country: '', interest: '', otherInterest: '', promo: '', description: '',
    scheduledTime: '', linkedinUrl: '', teamSize: '',
  });
  const [phone, setPhone] = useState<string | undefined>('');
  const [calendarKey, setCalendarKey] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitContact, { isLoading, isSuccess, isError, error, reset: resetMutation }] = useSubmitContactMutation();

  useEffect(() => {
    detectCountry().then((geo) => {
      if (geo && !formData.country) {
        setFormData((p) => ({ ...p, country: geo.countryName }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(() => resetMutation(), 5000);
    return () => clearTimeout(timer);
  }, [isSuccess, resetMutation]);

  const validate = (): boolean => {
    const errs: FieldErrors = {};
    if (!formData.name.trim()) errs.name = 'Please enter your full name';
    if (!formData.email.trim()) errs.email = 'Please enter your email address';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Please enter a valid email address';
    if (!formData.country) errs.country = 'Please select your country';
    if (!formData.scheduledTime) errs.scheduledTime = 'Please select a preferred date and time';
    else {
      const selected = new Date(formData.scheduledTime);
      if (selected < new Date(Date.now() + 24 * 60 * 60 * 1000)) errs.scheduledTime = 'Selected time must be at least 24 hours from now';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const clearFieldError = (field: string) => {
    if (errors[field]) setErrors((prev) => { const { [field]: _, ...rest } = prev; return rest; });
  };

  const update = (field: string, value: string) => {
    setFormData((p) => ({ ...p, [field]: value }));
    clearFieldError(field);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const fullDescription = [
        formData.interest === 'other' && formData.otherInterest ? `[Interest: ${formData.otherInterest}]` : '',
        formData.description || '',
      ].filter(Boolean).join(' | ') || null;

      await submitContact({
        full_name: formData.name,
        email: formData.email,
        country: formData.country,
        mobile_number: phone || null,
        interest: formData.interest || null,
        linkedin_url: formData.linkedinUrl || null,
        team_size: formData.teamSize || null,
        scheduled_time: new Date(formData.scheduledTime).toISOString(),
        company_name: formData.company || null,
        description: fullDescription,
        promo_code: formData.promo || null,
      }).unwrap();

      setFormData({ name: '', company: '', email: '', country: '', interest: '', otherInterest: '', promo: '', description: '', scheduledTime: '', linkedinUrl: '', teamSize: '' });
      setPhone('');
      setCalendarKey((k) => k + 1);
      setErrors({});
    } catch (err) {
      console.error('Contact submission failed:', err);
    }
  };

  return (
    <>
      <PageHero
        tag="Free Consultation"
        title="Start Your AI Project With a Free Consultation"
        description="Share your project details and our team will prepare a custom AI growth strategy for you within 24 hours. Whether you need website development, CRM development, SaaS development, or AI automation, it starts with one conversation."
      />

      <section className="py-12 section-light border-b border-surface-100">
        <div className="container-main max-w-3xl">
          <AnimatedSection>
            <h2 className="text-2xl font-medium mb-5">What Happens After You Reach Out</h2>
            <p className="text-surface-600 leading-relaxed mb-5">
              Our team reviews every submission within 4 hours during business hours (9 AM to 12 AM IST, Monday through
              Friday). Within 24 hours, you will receive a response from a project strategist, not a generic auto-reply,
              but a personalized assessment of your goals and a recommended next step.
            </p>
            <p className="text-surface-500 leading-relaxed mb-5">
              For most projects, the next step is a 30-minute discovery call where we discuss scope, timeline, budget
              range, and technical requirements. After that call, we deliver a written proposal within 48 hours that
              includes architecture recommendations, a milestone schedule, and transparent pricing. There is no
              obligation and no hard sell. If we are not the right fit, we will tell you directly.
            </p>
            <p className="text-surface-500 leading-relaxed">
              You can also reach us directly at <a href={`mailto:${siteConfig.email}`} className="text-brand-500 hover:underline">{siteConfig.email}</a>,
              by WhatsApp at <a href={`https://wa.me/${siteConfig.whatsapp.us.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">{siteConfig.whatsapp.us}</a> (US)
              or <a href={`https://wa.me/${siteConfig.whatsapp.in.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">{siteConfig.whatsapp.in}</a> (India),
              or through our <a href="https://www.linkedin.com/company/propelusai" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">LinkedIn page</a>.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding section-light">
        <div className="container-main">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            <div className="lg:col-span-3">
              <AnimatedSection>
                <h2 className="text-xl font-medium mb-6">Tell Us About Your Project</h2>
                {isSuccess ? (
                  <div className="card bg-brand-50 border-brand-100 text-center py-12">
                    <div className="w-12 h-12 rounded-full bg-status-success/10 flex items-center justify-center mx-auto mb-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-status-success"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <h3 className="text-lg font-medium text-brand-700 mb-2">Thank you!</h3>
                    <p className="text-brand-600 text-sm">We&apos;ll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    {isError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {(error as { data?: { message?: string } })?.data?.message || 'Failed to submit. Please try again.'}
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField label="Full Name" required error={errors.name}>
                        <input type="text" placeholder="John Smith" value={formData.name} onChange={(e) => update('name', e.target.value)} className={`form-input ${errors.name ? 'border-red-400' : ''}`} disabled={isLoading} />
                      </FormField>
                      <FormField label="Company Name">
                        <input type="text" placeholder="Acme Inc. (optional)" value={formData.company} onChange={(e) => update('company', e.target.value)} className="form-input" disabled={isLoading} />
                      </FormField>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField label="Email Address" required error={errors.email}>
                        <input type="email" placeholder="john@company.com" value={formData.email} onChange={(e) => update('email', e.target.value)} className={`form-input ${errors.email ? 'border-red-400' : ''}`} disabled={isLoading} />
                      </FormField>
                      <FormField label="Country" required error={errors.country}>
                        <FormSelect options={countryOptions} value={formData.country} onChange={(v) => update('country', v)} placeholder="Select country..." disabled={isLoading} error={errors.country} />
                      </FormField>
                    </div>

                    <FormField label="Phone Number">
                      <PhoneInput international defaultCountry="US" value={phone} onChange={setPhone} disabled={isLoading} className="phone-input-wrapper" />
                    </FormField>

                    <FormField label="What are you interested in?">
                      <FormSelect options={serviceOptions} value={formData.interest} onChange={(v) => update('interest', v)} placeholder="Select a service..." disabled={isLoading} />
                    </FormField>

                    {formData.interest === 'other' && (
                      <FormField label="Please describe what you're looking for">
                        <textarea placeholder="Tell us what you have in mind, specific goals, challenges, or ideas..." rows={3} value={formData.otherInterest} onChange={(e) => update('otherInterest', e.target.value)} className="form-input resize-none" disabled={isLoading} />
                      </FormField>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField label="LinkedIn Profile URL">
                        <input type="url" placeholder="linkedin.com/in/yourprofile" value={formData.linkedinUrl} onChange={(e) => update('linkedinUrl', e.target.value)} className="form-input" disabled={isLoading} />
                      </FormField>
                      <FormField label="Team / Company Size">
                        <FormSelect options={teamSizeOptions} value={formData.teamSize} onChange={(v) => update('teamSize', v)} placeholder="Select team size..." disabled={isLoading} />
                      </FormField>
                    </div>

                    <FormField label="Promo Code">
                      <input type="text" placeholder="Enter promo or affiliate code (optional)" value={formData.promo} onChange={(e) => update('promo', e.target.value)} className="form-input" disabled={isLoading} />
                    </FormField>

                    <div>
                      <EmbeddedCalendar
                        key={calendarKey}
                        label="Preferred Consultation Date & Time"
                        required
                        value={formData.scheduledTime}
                        onChange={(v) => update('scheduledTime', v)}
                        error={errors.scheduledTime}
                        disabled={isLoading}
                      />
                    </div>

                    <FormField label="Project Description">
                      <textarea placeholder="Tell us about your project, goals, or any questions..." rows={5} value={formData.description} onChange={(e) => update('description', e.target.value)} className="form-input resize-none" disabled={isLoading} />
                    </FormField>

                    {/* <p className="text-xs text-surface-400">By submitting, you agree to our privacy policy.</p> */}
                    <button type="submit" className="btn-primary w-full sm:w-auto justify-center" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Get Started
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </AnimatedSection>
            </div>

            <div className="lg:col-span-2">
              <AnimatedSection delay={0.1}>
                <h3 className="text-base font-medium mb-5">Direct Contact</h3>
                <div className="space-y-4 mb-10">
                  {contactInfo.map((c) => (
                    <div key={c.label} className="flex items-start gap-3">
                      <svg className="w-4 h-4 mt-0.5 text-brand-500 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <div>
                        <div className="text-sm font-medium text-surface-700">{c.label}</div>
                        {c.href ? (
                          <a href={c.href} className="text-sm text-surface-500 hover:text-brand-500 transition-colors">{c.value}</a>
                        ) : (
                          <div className="text-sm text-surface-500">{c.value}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-base font-medium mb-5">Global Offices</h3>
                <div className="space-y-3 mb-10">
                  <div className="text-sm"><span className="text-surface-700 font-medium">USA</span> : West Hide Trail, Phoenix, Arizona 85085</div>
                  <div className="text-sm"><span className="text-surface-700 font-medium">India</span> : Surat, Gujarat & Kolkata, West Bengal</div>
                </div>

                <h3 className="text-base font-medium mb-4">Why Contact Us</h3>
                <div className="space-y-3">
                  {reasons.map((r) => (
                    <div key={r.title} className="flex items-start gap-2.5">
                      <svg className="w-4 h-4 mt-0.5 text-brand-500 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <div>
                        <div className="text-sm font-medium text-surface-700">{r.title}</div>
                        <div className="text-xs text-surface-400">{r.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        tag="Ready to Build?"
        title="Let's build your AI powered system together."
        description="Your next stage of growth begins with one conversation. Tell us your goals, and we will architect the perfect solution."
        primaryLabel="Start Your Project"
        primaryHref="/contact"
        secondaryLabel="Explore Services"
        secondaryHref="/services"
      />
    </>
  );
}
