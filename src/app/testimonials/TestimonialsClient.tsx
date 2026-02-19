'use client';

import { useState } from 'react';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import AnimatedSection from '@/components/AnimatedSection';
import { testimonials } from '@/lib/data';

// Avatar colors rotating
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

function getInitials(role: string) {
  return role.split(',')[0].split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function TestimonialsClient() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', testimonial: '' });
  const [submitted, setSubmitted] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', testimonial: '' }); }, 3000);
  };

  const visibleTestimonials = showAll ? testimonials : testimonials.slice(0, 8);

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

          {/* Show More / Less */}
          {testimonials.length > 8 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAll(!showAll)}
                className="btn-secondary"
              >
                {showAll ? 'Show Less' : `View All ${testimonials.length} Testimonials`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Submit Testimonial — Image Left, Form Right */}
      <section className="py-12 lg:py-16 section-warm">
        <div className="container-main">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-10">
            <span className="tag mb-3 inline-flex">Share Your Experience</span>
            <h2 className="mb-2">Submit Your Testimonial</h2>
            <p className="text-surface-500">Worked with us? We&apos;d love to hear about your experience and results.</p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
            {/* Image — Left */}
            <AnimatedSection delay={0.1}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-surface-100">
                <Image
                  src="/testimonial.png"
                  alt="Client success stories"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimatedSection>

            {/* Form — Right */}
            <AnimatedSection delay={0.2}>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name *"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                />
                <input
                  type="tel"
                  placeholder="Mobile Number (Optional)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                />
                <textarea
                  placeholder="Your Testimonial *"
                  required
                  rows={4}
                  minLength={20}
                  maxLength={350}
                  value={formData.testimonial}
                  onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                  className="form-input resize-none"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-surface-400">{formData.testimonial.length}/350</p>
                  <button type="submit" className="btn-primary" disabled={submitted}>
                    {submitted ? 'Thank you!' : 'Submit Testimonial'}
                  </button>
                </div>
              </form>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
