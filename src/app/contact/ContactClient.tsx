'use client';

import { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import PageHero from '@/components/PageHero';
import AnimatedSection from '@/components/AnimatedSection';
import EmbeddedCalendar from '@/components/EmbeddedCalendar';
import { siteConfig } from '@/lib/data';
import { countries } from '@/lib/countries';
import { useSubmitContactMutation } from '@/store';

const contactInfo = [
  { icon: '📩', label: 'Email', value: siteConfig.email },
  { icon: '💬', label: 'WhatsApp', value: `${siteConfig.whatsapp.in} (IN) | ${siteConfig.whatsapp.us} (US)` },
  { icon: '🕒', label: 'Business Hours', value: '9 AM – 8 PM (All Time Zones)' },
];

const reasons = [
  { title: 'Fast Response', desc: 'We reply within 24 hours' },
  { title: 'Clear Roadmapping', desc: 'Every conversation ends with clarity' },
  { title: 'AI-Native Expertise', desc: 'One unified system approach' },
  { title: 'Global Support', desc: 'Handle clients worldwide' },
];

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: '', company: '', email: '', country: '', interest: '', otherInterest: '', promo: '', description: '',
    scheduledTime: '',
  });
  const [phone, setPhone] = useState<string | undefined>('');
  const [calendarKey, setCalendarKey] = useState(0);
  const [calendarError, setCalendarError] = useState('');
  const [submitContact, { isLoading, isSuccess, isError, error, reset: resetMutation }] = useSubmitContactMutation();

  // Auto-reset form after 5 seconds on success
  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(() => {
      resetMutation();
    }, 5000);
    return () => clearTimeout(timer);
  }, [isSuccess, resetMutation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.scheduledTime) {
      setCalendarError('Please select a preferred date & time');
      return;
    }
    const selected = new Date(formData.scheduledTime);
    if (selected < new Date(Date.now() + 24 * 60 * 60 * 1000)) {
      setCalendarError('Selected time must be at least 24 hours from now');
      return;
    }
    setCalendarError('');

    try {
      // Combine description with "other" interest notes if present
      const fullDescription = [
        formData.interest === 'other' && formData.otherInterest ? `[Interest: ${formData.otherInterest}]` : '',
        formData.description || '',
      ].filter(Boolean).join(' — ') || null;

      await submitContact({
        full_name: formData.name,
        email: formData.email,
        country: formData.country,
        mobile_number: phone || null,
        interest: formData.interest || null,
        scheduled_time: new Date(formData.scheduledTime).toISOString(),
        company_name: formData.company || null,
        description: fullDescription,
        promo_code: formData.promo || null,
      }).unwrap();

      setFormData({ name: '', company: '', email: '', country: '', interest: '', otherInterest: '', promo: '', description: '', scheduledTime: '' });
      setPhone('');
      setCalendarKey((k) => k + 1);
    } catch (err) {
      console.error('Contact submission failed:', err);
    }
  };

  const update = (field: string, value: string) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (field === 'scheduledTime' && calendarError) setCalendarError('');
  };

  const label = (text: string, required?: boolean) => (
    <label className="block text-xs font-medium text-surface-600 mb-1">
      {text}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );

  return (
    <>
      <PageHero
        tag="Let's Build Something Extraordinary"
        title="Start Your AI Powered Growth Journey"
        description="Ready to transform your business with AI? Whether you're launching a new website, building a CRM, automating operations, or scaling with AI-driven ads, it starts with a conversation. Our global team responds within 24 hours (or within 4 hours for enterprise clients)."
      />

      <section className="section-padding section-light">
        <div className="container-main">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              <AnimatedSection>
                <h2 className="text-xl font-medium mb-6">Tell Us About Your Project</h2>
                {isSuccess ? (
                  <div className="card bg-brand-50 border-brand-100 text-center py-12">
                    <div className="text-4xl mb-4">✅</div>
                    <h3 className="text-lg font-medium text-brand-700 mb-2">Thank you!</h3>
                    <p className="text-brand-600 text-sm">We&apos;ll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {isError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {(error as { data?: { message?: string } })?.data?.message || 'Failed to submit. Please try again.'}
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        {label('Full Name', true)}
                        <input type="text" placeholder="John Smith" required value={formData.name} onChange={(e) => update('name', e.target.value)} className="form-input" disabled={isLoading} />
                      </div>
                      <div>
                        {label('Company Name')}
                        <input type="text" placeholder="Acme Inc. (optional)" value={formData.company} onChange={(e) => update('company', e.target.value)} className="form-input" disabled={isLoading} />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        {label('Email Address', true)}
                        <input type="email" placeholder="john@company.com" required value={formData.email} onChange={(e) => update('email', e.target.value)} className="form-input" disabled={isLoading} />
                      </div>
                      <div>
                        {label('Country', true)}
                        <select required value={formData.country} onChange={(e) => update('country', e.target.value)} className="form-input" disabled={isLoading}>
                          <option value="">Select country...</option>
                          {countries.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      {label('Phone Number')}
                      <PhoneInput
                        international
                        defaultCountry="US"
                        value={phone}
                        onChange={setPhone}
                        disabled={isLoading}
                        className="phone-input-wrapper"
                      />
                    </div>

                    <div>
                      {label('What are you interested in?')}
                      <select value={formData.interest} onChange={(e) => update('interest', e.target.value)} className="form-input" disabled={isLoading}>
                        <option value="">Select a service...</option>
                        <option value="ai-website">AI-Powered Website</option>
                        <option value="crm">CRM & Lead Management</option>
                        <option value="linkedin-ads">LinkedIn Advertising</option>
                        <option value="meta-google-ads">Meta & Google Ads</option>
                        <option value="content-marketing">Content Marketing</option>
                        <option value="automation">Marketing Automation</option>
                        <option value="full-suite">Full AI Growth Suite</option>
                        <option value="other">Other / Not Sure Yet</option>
                      </select>
                    </div>

                    {formData.interest === 'other' && (
                      <div>
                        {label('Please describe what you\'re looking for')}
                        <textarea placeholder="Tell us what you have in mind — specific goals, challenges, or ideas..." rows={3} value={formData.otherInterest} onChange={(e) => update('otherInterest', e.target.value)} className="form-input resize-none" disabled={isLoading} />
                      </div>
                    )}

                    <div>
                      {label('Promo Code')}
                      <input type="text" placeholder="Enter promo or affiliate code (optional)" value={formData.promo} onChange={(e) => update('promo', e.target.value)} className="form-input" disabled={isLoading} />
                    </div>

                    {/* Calendar date & time picker */}
                    <EmbeddedCalendar
                      key={calendarKey}
                      label="Preferred Consultation Date & Time"
                      required
                      value={formData.scheduledTime}
                      onChange={(v) => update('scheduledTime', v)}
                      error={calendarError}
                      disabled={isLoading}
                    />

                    <div>
                      {label('Project Description')}
                      <textarea
                        placeholder="Tell us about your project, goals, or any questions..."
                        rows={5}
                        value={formData.description}
                        onChange={(e) => update('description', e.target.value)}
                        className="form-input resize-none"
                        disabled={isLoading}
                      />
                    </div>

                    <p className="text-xs text-surface-400">By submitting, you agree to our privacy policy.</p>
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

            {/* Sidebar */}
            <div className="lg:col-span-2">
              <AnimatedSection delay={0.1}>
                <h3 className="text-base font-medium mb-5">Direct Contact</h3>
                <div className="space-y-4 mb-10">
                  {contactInfo.map((c) => (
                    <div key={c.label} className="flex items-start gap-3">
                      <span className="text-lg">{c.icon}</span>
                      <div>
                        <div className="text-sm font-medium text-surface-700">{c.label}</div>
                        <div className="text-sm text-surface-500">{c.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-base font-medium mb-5">Global Offices</h3>
                <div className="space-y-3 mb-10">
                  <div className="text-sm"><span className="text-surface-700 font-medium">United States</span> — West Hide Trail, Phoenix, AZ 85085</div>
                  <div className="text-sm"><span className="text-surface-700 font-medium">India</span> — Surat, Gujarat & Kolkata, West Bengal</div>
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

      {/* Bottom CTA */}
      <section className="section-padding section-dark">
        <AnimatedSection className="container-main text-center max-w-2xl mx-auto">
          <h2 className="text-white mb-4">Let&apos;s Build Your System Together</h2>
          <p className="text-surface-400 leading-relaxed">
            Your next stage of growth begins with one message. Tell us your goals, and we&apos;ll architect the perfect AI-powered solution.
          </p>
        </AnimatedSection>
      </section>
    </>
  );
}
