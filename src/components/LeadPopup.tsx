'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubmitLeadMutation } from '@/store';

const POPUP_DELAY_MS = 18000; // 18 seconds
const SESSION_KEY = 'propelusai_popup_dismissed';

const stats = [
  { value: '3.1×', label: 'Pipeline Growth' },
  { value: '42%', label: 'Faster Sales Cycles' },
  { value: '150+', label: 'Projects Delivered' },
];

const highlights = [
  'AI-native engineering across every solution',
  'Enterprise-grade websites, CRMs & automation',
  'Full-funnel marketing — LinkedIn, Meta & Google Ads',
  'Outcome-first approach with measurable ROI',
];

export default function LeadPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    interest: '',
  });
  
  const [submitLead, { isLoading, isSuccess }] = useSubmitLeadMutation();

  useEffect(() => {
    // Check sessionStorage — persists across refreshes, clears on browser close
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
      // Prevent background scroll when popup is open
      document.body.style.overflow = 'hidden';
    }, POPUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    document.body.style.overflow = '';
    sessionStorage.setItem(SESSION_KEY, 'true');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Generate scheduled_time 48h from now (backend requires it)
      const scheduledTime = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
      
      await submitLead({
        full_name: formData.name,
        email: formData.email,
        country: 'Not specified',
        scheduled_time: scheduledTime,
        company_name: formData.company || null,
        mobile_number: formData.phone || null,
        description: formData.interest ? `Interest: ${formData.interest}` : null,
      }).unwrap();
      
      sessionStorage.setItem(SESSION_KEY, 'true');
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
          {/* Backdrop overlay */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
          />

          {/* Popup container */}
          <motion.div
            className="relative w-full max-w-[920px] max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              duration: 0.5,
              ease: [0.21, 0.47, 0.32, 0.98],
              delay: 0.1,
            }}
          >
            {/* Decorative gradient top bar */}
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-brand-500 via-brand-400 to-brand-600" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-surface-100 hover:bg-surface-200 transition-colors group"
              aria-label="Close popup"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-surface-500 group-hover:text-surface-700 transition-colors"
              >
                <path d="M1 1l12 12M13 1L1 13" strokeLinecap="round" />
              </svg>
            </button>

            <div className="grid md:grid-cols-2">
              {/* Left — Marcom Section */}
              <motion.div
                className="relative p-8 sm:p-10 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                {/* Background glow effect */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-400/10 rounded-full blur-2xl" />

                <div className="relative z-10">
                  {/* Tag */}
                  <motion.span
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/15 rounded-full text-xs font-medium tracking-wide uppercase text-brand-200 mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Free Consultation
                  </motion.span>

                  {/* Headline */}
                  <motion.h2
                    className="text-2xl sm:text-[1.7rem] font-semibold leading-tight mb-3 text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    Unlock AI-Powered
                    <br />
                    <span className="bg-gradient-to-r from-brand-300 to-brand-100 bg-clip-text text-transparent">
                      Growth for Your Business
                    </span>
                  </motion.h2>

                  <motion.p
                    className="text-sm text-white/60 leading-relaxed mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.45 }}
                  >
                    Join industry leaders achieving measurable results with our
                    AI-first solutions. Get a custom growth roadmap — tailored to
                    your business goals.
                  </motion.p>

                  {/* Stats */}
                  <motion.div
                    className="grid grid-cols-3 gap-3 mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    {stats.map((s) => (
                      <div
                        key={s.label}
                        className="text-center p-2.5 rounded-lg bg-white/5 border border-white/8"
                      >
                        <div className="text-lg font-bold text-brand-300">
                          {s.value}
                        </div>
                        <div className="text-[0.65rem] text-white/50 leading-tight mt-0.5">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </motion.div>

                  {/* Highlights */}
                  <motion.div
                    className="space-y-2.5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.55 }}
                  >
                    {highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <svg
                          className="w-4 h-4 mt-0.5 text-brand-300 shrink-0"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            d="M3 8l3.5 3.5L13 5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-sm text-white/70 leading-snug">
                          {h}
                        </span>
                      </div>
                    ))}
                  </motion.div>

                  {/* Brand pillars */}
                  <motion.div
                    className="mt-6 pt-5 border-t border-white/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <p className="text-xs text-white/40 tracking-widest uppercase">
                      Intentional &middot; Intelligent &middot; Impact-Driven
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right — Contact Form */}
              <motion.div
                className="p-8 sm:p-10"
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
                      <svg
                        className="w-8 h-8 text-green-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-surface-800 mb-2">
                      Thank You!
                    </h3>
                    <p className="text-sm text-surface-500 max-w-xs">
                      We&apos;ve received your request. Our team will reach out
                      within 24 hours with your custom growth roadmap.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-surface-800 mb-1">
                      Get Your Free Proposal
                    </h3>
                    <p className="text-sm text-surface-400 mb-6">
                      Fill in a few details and we&apos;ll craft a custom AI growth strategy for you.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-3.5">
                      <input
                        type="text"
                        placeholder="Full Name *"
                        required
                        value={formData.name}
                        onChange={(e) => update('name', e.target.value)}
                        className="form-input"
                        disabled={isLoading}
                      />
                      <input
                        type="email"
                        placeholder="Work Email *"
                        required
                        value={formData.email}
                        onChange={(e) => update('email', e.target.value)}
                        className="form-input"
                        disabled={isLoading}
                      />
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={formData.company}
                        onChange={(e) => update('company', e.target.value)}
                        className="form-input"
                        disabled={isLoading}
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number (Optional)"
                        value={formData.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        className="form-input"
                        disabled={isLoading}
                      />
                      <select
                        value={formData.interest}
                        onChange={(e) => update('interest', e.target.value)}
                        className="form-input text-surface-500"
                        disabled={isLoading}
                      >
                        <option value="">What are you interested in?</option>
                        <option value="ai-website">AI-Powered Website</option>
                        <option value="crm">CRM & Lead Management</option>
                        <option value="linkedin-ads">LinkedIn Advertising</option>
                        <option value="meta-google-ads">Meta & Google Ads</option>
                        <option value="content-marketing">Content Marketing</option>
                        <option value="automation">Marketing Automation</option>
                        <option value="full-suite">Full AI Growth Suite</option>
                        <option value="other">Other / Not Sure Yet</option>
                      </select>

                      <button
                        type="submit"
                        className="btn-primary w-full justify-center mt-2"
                        disabled={isLoading}
                      >
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
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            >
                              <path
                                d="M3 8h10M9 4l4 4-4 4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </>
                        )}
                      </button>
                    </form>

                    <p className="text-[0.7rem] text-surface-400 mt-4 text-center leading-relaxed">
                      By submitting, you agree to our{' '}
                      <a
                        href="/privacy"
                        className="text-brand-500 hover:underline"
                      >
                        privacy policy
                      </a>
                      . No spam — ever.
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
