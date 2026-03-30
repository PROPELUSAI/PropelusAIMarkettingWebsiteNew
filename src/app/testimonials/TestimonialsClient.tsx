/**
 * TestimonialsClient.tsx — Testimonials page (client component).
 * Merges API-fetched testimonials with static ones from data.ts,
 * displays them in a 2-column grid with "Show All" toggle,
 * and includes a testimonial submission form with image sidebar.
 * 5-second auto-reset on successful submission.
 */
'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import AnimatedSection from '@/components/AnimatedSection';
import CTASection from '@/components/CTASection';
import { testimonials as staticTestimonials } from '@/lib/data';
import { useGetTestimonialsQuery, useSubmitTestimonialMutation, Testimonial } from '@/store';
import FormField from '@/components/ui/FormField';

/** Rotating avatar background colors for testimonial initials */
const avatarColors = [
  'bg-brand-500/15 text-brand-600',
  'bg-emerald-500/15 text-emerald-600',
  'bg-amber-500/15 text-amber-600',
  'bg-rose-500/15 text-rose-600',
  'bg-cyan-500/15 text-cyan-600',
  'bg-violet-500/15 text-violet-600',
  'bg-orange-500/15 text-orange-600',
  'bg-teal-500/15 text-teal-600',
];

/** Extracts up to 2 uppercase initials from a name for avatar display */
function getInitials(name?: string) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

/** Renders testimonials grid, "Show All" toggle, and submission form */
export default function TestimonialsClient() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', testimonial: '', designation: '', company: '', industry: '', city: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  
  const { data: apiTestimonials, isLoading: isFetching } = useGetTestimonialsQuery();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitTestimonial, { isLoading: isSubmitting, isSuccess, isError, error, reset: resetMutation }] = useSubmitTestimonialMutation();

  // Auto-reset form after 5 seconds on success
  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(() => {
      resetMutation();
    }, 5000);
    return () => clearTimeout(timer);
  }, [isSuccess, resetMutation]);

  // Merge API testimonials with static ones
  const allTestimonials = useMemo(() => {
    const apiData = apiTestimonials?.data || [];
    const formattedApiData = apiData.map((t: Testimonial) => ({
      quote: t.testimonial || '',
      name: t.fullName || 'Anonymous',
      designation: t.designation || '',
      company: t.company || '',
      industry: t.industry || 'Business',
      imageUrl: t.imageUrl || null,
    }));
    return [...formattedApiData, ...staticTestimonials];
  }, [apiTestimonials]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clearErr = (field: string) => {
    if (fieldErrors[field]) setFieldErrors((p) => { const { [field]: _, ...rest } = p; return rest; });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please enter your full name';
    if (!formData.email.trim()) errs.email = 'Please enter your email address';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Please enter a valid email address';
    if (!formData.testimonial.trim()) errs.testimonial = 'Please write your testimonial';
    else if (formData.testimonial.trim().length < 20) errs.testimonial = 'Please write at least 20 characters';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        const res = await fetch('/api/v1/upload/image', { method: 'POST', body: uploadData });
        const json = await res.json();
        if (json.success) imageUrl = json.data.url;
      }

      await submitTestimonial({
        full_name: formData.name,
        email: formData.email,
        mobile_number: formData.phone || null,
        testimonial: formData.testimonial,
        designation: formData.designation || null,
        company: formData.company || null,
        industry: formData.industry || null,
        city: formData.city || null,
        image_url: imageUrl,
      }).unwrap();

      setFormData({ name: '', email: '', phone: '', testimonial: '', designation: '', company: '', industry: '', city: '' });
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error('Testimonial submission failed:', err);
    }
  };

  const visibleTestimonials = showAll ? allTestimonials : allTestimonials.slice(0, 8);

  const label = (text: string, required?: boolean) => (
    <label className="block text-xs font-medium text-surface-600 mb-1">
      {text}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );

  return (
    <>
      <PageHero
        tag="Trust, Proven"
        title="What Global Teams Say About PropelusAI"
        description="Real outcomes. Real experiences. AI powered success stories. We support businesses globally with premium AI systems built for measurable growth."
      />

      {/* Intro */}
      <section className="py-12 section-light border-b border-surface-100">
        <div className="container-main max-w-3xl">
          <AnimatedSection>
            <h2 className="text-2xl font-medium mb-5">Real Results From Real Projects</h2>
            <p className="text-surface-600 leading-relaxed mb-5">
              Every testimonial below comes from a verified client engagement. We work across website development,
              CRM builds, SaaS platforms, LinkedIn advertising, marketing automation, cybersecurity, and content
              production. The results our clients share reflect actual project outcomes including pipeline growth, conversion
              improvements, cost savings, and operational efficiency gains.
            </p>
            <p className="text-surface-500 leading-relaxed">
              We keep client identities anonymized by default to protect confidential business relationships. Where
              clients have given permission, we include their role, industry, and company context. If you are a
              current client and would like to share your experience, use the form at the bottom of this page.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-12 lg:py-16 section-light">
        <div className="container-main">
          {isFetching ? (
            <div className="flex justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                {visibleTestimonials.map((t, i) => (
                  <AnimatedSection key={i} delay={Math.min(i * 0.05, 0.3)}>
                    <div className="card h-full !p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                          {getInitials(t.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium text-surface-800 truncate">{t.name}</p>
                            <span className="text-[0.6875rem] px-2 py-0.5 rounded-full bg-surface-50 text-surface-400 shrink-0">{t.industry}</span>
                          </div>
                          <p className="text-xs text-surface-400">
                            {[t.designation, t.company].filter(Boolean).join(', ')}
                          </p>
                        </div>
                      </div>
                      <blockquote className="text-sm leading-relaxed text-surface-600">
                        &ldquo;{t.quote}&rdquo;
                      </blockquote>
                    </div>
                  </AnimatedSection>
                ))}
              </div>

              {allTestimonials.length > 8 && (
                <div className="text-center mt-8">
                  <button onClick={() => setShowAll(!showAll)} className="btn-secondary">
                    {showAll ? 'Show Less' : `View All ${allTestimonials.length} Testimonials`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Submit Testimonial */}
      <section className="py-12 lg:py-16 section-warm">
        <div className="container-main">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-10">
            <span className="tag mb-3 inline-flex">Share Your Experience</span>
            <h2 className="mb-2">Submit Your Testimonial</h2>
            <p className="text-surface-500">Worked with us? We&apos;d love to hear about your experience and results.</p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
            <AnimatedSection delay={0.1}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-surface-100">
                <Image src="/testimonial.png" alt="Client success stories" fill className="object-cover" />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              {isSuccess ? (
                <div className="card bg-brand-50 border-brand-100 text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-status-success/10 flex items-center justify-center mx-auto mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-status-success"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <h3 className="text-lg font-medium text-brand-700 mb-2">Thank you!</h3>
                  <p className="text-brand-600 text-sm">Your testimonial has been submitted for review.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-3">
                  {isError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      {(error as { data?: { message?: string } })?.data?.message || 'Failed to submit. Please try again.'}
                    </div>
                  )}
                  <FormField label="Full Name" required error={fieldErrors.name}>
                    <input type="text" placeholder="John Smith" value={formData.name} onChange={(e) => { setFormData({ ...formData, name: e.target.value }); clearErr('name'); }} className={`form-input ${fieldErrors.name ? 'border-red-400' : ''}`} disabled={isSubmitting} />
                  </FormField>
                  <FormField label="Email Address" required error={fieldErrors.email}>
                    <input type="email" placeholder="john@company.com" value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); clearErr('email'); }} className={`form-input ${fieldErrors.email ? 'border-red-400' : ''}`} disabled={isSubmitting} />
                  </FormField>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      {label('Designation / Job Title')}
                      <input type="text" placeholder="e.g. CEO, VP Growth" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} className="form-input" disabled={isSubmitting} />
                    </div>
                    <div>
                      {label('Company')}
                      <input type="text" placeholder="Company name" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="form-input" disabled={isSubmitting} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      {label('Industry')}
                      <input type="text" placeholder="e.g. SaaS, Healthcare" value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} className="form-input" disabled={isSubmitting} />
                    </div>
                    <div>
                      {label('City')}
                      <input type="text" placeholder="e.g. New York" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="form-input" disabled={isSubmitting} />
                    </div>
                  </div>
                  <div>
                    {label('Mobile Number')}
                    <input type="tel" placeholder="+1 (555) 000-0000 (Optional)" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="form-input" disabled={isSubmitting} />
                  </div>
                  <div>
                    {label('Your Photo')}
                    <div className="flex items-center gap-3">
                      {imagePreview && (
                        <img src={imagePreview} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-surface-200" />
                      )}
                      <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleImageChange} className="text-sm text-surface-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-brand-50 file:text-brand-600 hover:file:bg-brand-100 file:cursor-pointer" disabled={isSubmitting} />
                    </div>
                    <p className="text-xs text-surface-400 mt-1">JPG, PNG, or WebP. Max 5MB.</p>
                  </div>
                  <FormField label="Your Testimonial" required error={fieldErrors.testimonial}>
                    <textarea placeholder="Share your experience working with PropelusAI... (min 20 characters)" rows={4} maxLength={350} value={formData.testimonial} onChange={(e) => { setFormData({ ...formData, testimonial: e.target.value }); clearErr('testimonial'); }} className={`form-input resize-none ${fieldErrors.testimonial ? 'border-red-400' : ''}`} disabled={isSubmitting} />
                  </FormField>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-surface-400">{formData.testimonial.length}/350</p>
                    <button type="submit" className="btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        'Submit Testimonial'
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
        tag="Ready to Build?"
        title="Start your AI powered growth journey today."
        description="Join the businesses already achieving measurable results with PropelusAI. From custom websites to full funnel automation, we build systems that deliver."
        primaryLabel="Start Your Project"
        primaryHref="/contact"
        secondaryLabel="Explore Services"
        secondaryHref="/services"
      />
    </>
  );
}
