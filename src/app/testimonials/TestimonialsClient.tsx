'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import AnimatedSection from '@/components/AnimatedSection';
import { testimonials as staticTestimonials } from '@/lib/data';
import { useGetTestimonialsQuery, useSubmitTestimonialMutation, Testimonial } from '@/store';

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

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function TestimonialsClient() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', testimonial: '' });
  const [showAll, setShowAll] = useState(false);
  
  const { data: apiTestimonials, isLoading: isFetching } = useGetTestimonialsQuery();
  const [submitTestimonial, { isLoading: isSubmitting, isSuccess, isError, error }] = useSubmitTestimonialMutation();

  // Merge API testimonials with static ones
  const allTestimonials = useMemo(() => {
    const apiData = apiTestimonials?.data || [];
    const formattedApiData = apiData.map((t: Testimonial) => ({
      quote: t.testimonial,
      role: t.fullName,
      industry: 'Business',
    }));
    return [...formattedApiData, ...staticTestimonials];
  }, [apiTestimonials]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitTestimonial({
        full_name: formData.name,
        email: formData.email,
        mobile_number: formData.phone || null,
        testimonial: formData.testimonial,
      }).unwrap();
      
      setFormData({ name: '', email: '', phone: '', testimonial: '' });
    } catch (err) {
      console.error('Testimonial submission failed:', err);
    }
  };

  const visibleTestimonials = showAll ? allTestimonials : allTestimonials.slice(0, 8);

  return (
    <>
      <PageHero
        tag="Trust, Proven"
        title="What Global Teams Say About PropelusAI"
        description="Real outcomes. Real experiences. AI-powered success stories from businesses across industries."
      />

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
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                          {getInitials(t.role)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium text-surface-800 truncate">{t.role.split(',')[0]}</p>
                            <span className="text-[0.6875rem] px-2 py-0.5 rounded-full bg-surface-50 text-surface-400 shrink-0">{t.industry}</span>
                          </div>
                          <p className="text-xs text-surface-400">{t.role.split(',').slice(1).join(',').trim()}</p>
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

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
            <AnimatedSection delay={0.1}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-surface-100">
                <Image src="/testimonial.png" alt="Client success stories" fill className="object-cover" />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              {isSuccess ? (
                <div className="card bg-brand-50 border-brand-100 text-center py-12">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="text-lg font-medium text-brand-700 mb-2">Thank you!</h3>
                  <p className="text-brand-600 text-sm">Your testimonial has been submitted for review.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  {isError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      {(error as { data?: { message?: string } })?.data?.message || 'Failed to submit. Please try again.'}
                    </div>
                  )}
                  <input type="text" placeholder="Full Name *" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-input" disabled={isSubmitting} />
                  <input type="email" placeholder="Email Address *" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="form-input" disabled={isSubmitting} />
                  <input type="tel" placeholder="Mobile Number (Optional)" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="form-input" disabled={isSubmitting} />
                  <textarea placeholder="Your Testimonial * (min 20 characters)" required rows={4} minLength={20} maxLength={350} value={formData.testimonial} onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })} className="form-input resize-none" disabled={isSubmitting} />
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
    </>
  );
}
