'use client';

import { useState } from 'react';
import PageHero from '@/components/PageHero';
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { siteConfig } from '@/lib/data';

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
    name: '', company: '', email: '', phone: '', country: '', promo: '', description: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', company: '', email: '', phone: '', country: '', promo: '', description: '' });
    }, 4000);
  };

  const update = (field: string, value: string) => setFormData((p) => ({ ...p, [field]: value }));

  return (
    <>
      <PageHero
        tag="Let's Build Something Extraordinary"
        title="Start Your AI Powered Growth Journey"
        description="Ready to transform your business with AI? Whether you're launching a website, building a CRM, or scaling with AI-driven ads, it starts with a conversation."
      />

      <section className="section-padding section-light">
        <div className="container-main">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              <AnimatedSection>
                <h2 className="text-xl font-medium mb-6">Tell Us About Your Project</h2>
                {submitted ? (
                  <div className="card bg-brand-50 border-brand-100 text-center py-12">
                    <div className="text-4xl mb-4">✅</div>
                    <h3 className="text-lg font-medium text-brand-700 mb-2">Thank you!</h3>
                    <p className="text-brand-600 text-sm">We&apos;ll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input type="text" placeholder="Full Name *" required value={formData.name} onChange={(e) => update('name', e.target.value)} className="form-input" />
                      <input type="text" placeholder="Company Name (Optional)" value={formData.company} onChange={(e) => update('company', e.target.value)} className="form-input" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input type="email" placeholder="Email *" required value={formData.email} onChange={(e) => update('email', e.target.value)} className="form-input" />
                      <input type="tel" placeholder="Mobile Number (Optional)" value={formData.phone} onChange={(e) => update('phone', e.target.value)} className="form-input" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input type="text" placeholder="Country *" required value={formData.country} onChange={(e) => update('country', e.target.value)} className="form-input" />
                      <input type="text" placeholder="Promo Code (Optional)" value={formData.promo} onChange={(e) => update('promo', e.target.value)} className="form-input" />
                    </div>
                    <textarea
                      placeholder="Tell us about your project (Optional)"
                      rows={5}
                      value={formData.description}
                      onChange={(e) => update('description', e.target.value)}
                      className="form-input resize-none"
                    />
                    <p className="text-xs text-surface-400">By submitting, you agree to our privacy policy.</p>
                    <button type="submit" className="btn-primary w-full sm:w-auto justify-center">
                      Get Started
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
                  <div className="text-sm"><span className="text-surface-700 font-medium">United States</span> — Huntersville, NC</div>
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
