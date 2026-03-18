/**
 * LeadPopup.tsx — First-visit lead capture popup (client component).
 * Appears after 3 seconds on first visit (tracked via localStorage).
 * Split layout: left panel with stats & highlights, right panel with
 * multi-field form (name, email, company, country, phone, interest,
 * promo code, description, optional calendar). Submits via RTK Query.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useSubmitContactMutation } from '@/store';
import EmbeddedCalendar from '@/components/EmbeddedCalendar';
import { countries } from '@/lib/countries';
import FormSelect, { SelectOption } from '@/components/ui/FormSelect';
import FormField from '@/components/ui/FormField';

const countryOptions: SelectOption[] = countries.map((c) => ({ value: c, label: c }));
const serviceSelectOptions: SelectOption[] = [
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
const teamSizeSelectOptions: SelectOption[] = [
  { value: 'Just me', label: 'Just me' },
  { value: '2-10', label: '2-10' },
  { value: '11-50', label: '11-50' },
  { value: '51-100', label: '51-100' },
  { value: '101-500', label: '101-500' },
  { value: '501+', label: '501+' },
];

/** Delay before popup appears on first visit (milliseconds) */
const POPUP_DELAY_MS = 3000;
/** localStorage key to track if popup was already dismissed */
const LOCAL_KEY = 'propelusai_popup_dismissed';

/** Key metrics displayed in the left panel */
const stats = [
  { value: '3.1×', label: 'Pipeline Growth' },
  { value: '42%', label: 'Faster Sales Cycles' },
  { value: '150+', label: 'Projects Delivered' },
];

const highlights = [
  'AI native engineering across every solution',
  'Enterprise grade websites, CRMs & automation',
  'Full funnel marketing across LinkedIn, Meta & Google Ads',
  'Outcome first approach with measurable ROI',
];

/** Renders the full-screen modal popup with lead capture form */
export default function LeadPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [phone, setPhone] = useState<string | undefined>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    country: '',
    interest: '',
    otherInterest: '',
    promo: '',
    description: '',
    scheduledTime: '',
    linkedinUrl: '',
    teamSize: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitLead, { isLoading, isSuccess }] = useSubmitContactMutation();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(LOCAL_KEY)) return;
    const timer = setTimeout(() => {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    }, POPUP_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    document.body.style.overflow = '';
    localStorage.setItem(LOCAL_KEY, 'true');
  }, []);

  const clearErr = (field: string) => {
    if (fieldErrors[field]) setFieldErrors((p) => { const { [field]: _, ...rest } = p; return rest; });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please enter your full name';
    if (!formData.email.trim()) errs.email = 'Please enter your email address';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Please enter a valid email address';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const scheduledTime = formData.scheduledTime
        ? new Date(formData.scheduledTime).toISOString()
        : new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

      // Combine description with "other" interest notes if present
      const fullDescription = [
        formData.interest === 'other' && formData.otherInterest ? `[Interest: ${formData.otherInterest}]` : '',
        formData.description || '',
      ].filter(Boolean).join(' | ') || null;

      await submitLead({
        full_name: formData.name,
        email: formData.email,
        country: formData.country || 'Not specified',
        mobile_number: phone || null,
        interest: formData.interest || null,
        linkedin_url: formData.linkedinUrl || null,
        team_size: formData.teamSize || null,
        scheduled_time: scheduledTime,
        company_name: formData.company || null,
        description: fullDescription,
        promo_code: formData.promo || null,
      }).unwrap();

      localStorage.setItem(LOCAL_KEY, 'true');
      setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = '';
      }, 3000);
    } catch (err) {
      console.error('Lead submission failed:', err);
    }
  };

  const update = (field: string, value: string) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const lbl = (text: string, required?: boolean) => (
    <label className="block text-xs font-medium text-surface-600 mb-1">
      {text}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
          />

          <motion.div
            className="relative w-full max-w-[960px] max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.1 }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-brand-500 via-brand-400 to-brand-600" />

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-surface-100 hover:bg-surface-200 transition-colors group"
              aria-label="Close popup"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" className="text-surface-500 group-hover:text-surface-700 transition-colors">
                <path d="M1 1l12 12M13 1L1 13" strokeLinecap="round" />
              </svg>
            </button>

            <div className="grid md:grid-cols-2">
              {/* Left panel */}
              <motion.div
                className="relative p-8 sm:p-10 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-400/10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <motion.span
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/15 rounded-full text-xs font-medium tracking-wide uppercase text-brand-200 mb-6"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Free Consultation
                  </motion.span>
                  <motion.h2
                    className="text-2xl sm:text-[1.7rem] font-semibold leading-tight mb-3 text-white"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    Unlock AI Powered<br />
                    <span className="bg-gradient-to-r from-brand-300 to-brand-100 bg-clip-text text-transparent">
                      Growth for Your Business
                    </span>
                  </motion.h2>
                  <motion.p
                    className="text-sm text-white/60 leading-relaxed mb-6"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.45 }}
                  >
                    Join industry leaders achieving measurable results with our AI first solutions. Get a custom growth roadmap, tailored to your business goals.
                  </motion.p>
                  <motion.div
                    className="grid grid-cols-3 gap-3 mb-6"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    {stats.map((s) => (
                      <div key={s.label} className="text-center p-2.5 rounded-lg bg-white/5 border border-white/8">
                        <div className="text-lg font-bold text-brand-300">{s.value}</div>
                        <div className="text-[0.65rem] text-white/50 leading-tight mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </motion.div>
                  <motion.div
                    className="space-y-2.5"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.55 }}
                  >
                    {highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <svg className="w-4 h-4 mt-0.5 text-brand-300 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-sm text-white/70 leading-snug">{h}</span>
                      </div>
                    ))}
                  </motion.div>
                  <motion.div
                    className="mt-6 pt-5 border-t border-white/10"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <p className="text-xs text-white/40 tracking-widest uppercase">
                      Intentional &middot; Intelligent &middot; Impact-Driven
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right — Form */}
              <motion.div
                className="p-6 sm:p-8 overflow-y-auto max-h-[92vh]"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {isSuccess ? (
                  <motion.div
                    className="flex flex-col items-center justify-center h-full text-center py-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-50 mb-4">
                      <svg className="w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-surface-800 mb-2">Thank You!</h3>
                    <p className="text-sm text-surface-500 max-w-xs">
                      We&apos;ve received your request. Our team will reach out within 24 hours with your custom growth roadmap.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-surface-800 mb-1">Your Custom Growth Roadmap Awaits</h3>
                    <p className="text-sm text-surface-400 mb-5">
                      Tell us your goals and we will design an AI strategy built specifically for your business. No templates. No guesswork.
                    </p>

                    <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
                      <FormField label="Full Name" required error={fieldErrors.name}>
                        <input type="text" placeholder="John Smith" value={formData.name} onChange={(e) => { update('name', e.target.value); clearErr('name'); }} className={`form-input !py-2.5 ${fieldErrors.name ? 'border-red-400' : ''}`} disabled={isLoading} />
                      </FormField>

                      <FormField label="Work Email" required error={fieldErrors.email}>
                        <input type="email" placeholder="john@company.com" value={formData.email} onChange={(e) => { update('email', e.target.value); clearErr('email'); }} className={`form-input !py-2.5 ${fieldErrors.email ? 'border-red-400' : ''}`} disabled={isLoading} />
                      </FormField>

                      <div className="grid grid-cols-2 gap-3">
                        <FormField label="Company Name">
                          <input type="text" placeholder="Acme Inc." value={formData.company} onChange={(e) => update('company', e.target.value)} className="form-input !py-2.5" disabled={isLoading} />
                        </FormField>
                        <FormField label="Country">
                          <FormSelect options={countryOptions} value={formData.country} onChange={(v) => update('country', v)} placeholder="Select country..." disabled={isLoading} />
                        </FormField>
                      </div>

                      <FormField label="Phone Number">
                        <PhoneInput international defaultCountry="US" value={phone} onChange={setPhone} disabled={isLoading} className="phone-input-wrapper" />
                      </FormField>

                      <FormField label="What are you interested in?">
                        <FormSelect options={serviceSelectOptions} value={formData.interest} onChange={(v) => update('interest', v)} placeholder="Select a service..." disabled={isLoading} />
                      </FormField>

                      {formData.interest === 'other' && (
                        <FormField label="Please describe what you're looking for">
                          <textarea placeholder="Tell us what you have in mind, specific goals, challenges, or ideas..." rows={3} value={formData.otherInterest} onChange={(e) => update('otherInterest', e.target.value)} className="form-input resize-none !py-2.5" disabled={isLoading} />
                        </FormField>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <FormField label="LinkedIn URL">
                          <input type="url" placeholder="linkedin.com/in/..." value={formData.linkedinUrl} onChange={(e) => update('linkedinUrl', e.target.value)} className="form-input !py-2.5" disabled={isLoading} />
                        </FormField>
                        <FormField label="Team Size">
                          <FormSelect options={teamSizeSelectOptions} value={formData.teamSize} onChange={(v) => update('teamSize', v)} placeholder="Select..." disabled={isLoading} />
                        </FormField>
                      </div>

                      <div>
                        {lbl('Promo Code')}
                        <input type="text" placeholder="Enter promo code (optional)" value={formData.promo} onChange={(e) => update('promo', e.target.value)} className="form-input !py-2.5" disabled={isLoading} />
                      </div>

                      <div>
                        {lbl('Tell us about your project')}
                        <textarea placeholder="Briefly describe your goals or requirements..." rows={3} value={formData.description} onChange={(e) => update('description', e.target.value)} className="form-input resize-none" disabled={isLoading} />
                      </div>

                      <EmbeddedCalendar
                        label="Preferred Date & Time (Optional)"
                        compact
                        value={formData.scheduledTime}
                        onChange={(v) => update('scheduledTime', v)}
                        disabled={isLoading}
                      />

                      <button type="submit" className="btn-primary w-full justify-center mt-1" disabled={isLoading}>
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
                            Get Your Custom Proposal
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </>
                        )}
                      </button>
                    </form>

                    <p className="text-[0.7rem] text-surface-400 mt-3 text-center leading-relaxed">
                      By submitting, you agree to our{' '}
                      <a href="/privacy" className="text-brand-500 hover:underline">privacy policy</a>. No spam, ever.
                    </p>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
