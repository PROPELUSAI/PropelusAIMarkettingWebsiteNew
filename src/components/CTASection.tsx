/**
 * CTASection.tsx — Reusable call-to-action section (server component).
 * Renders a centered section with tag, title, description, and two
 * action buttons (primary + secondary). Supports dark and warm variants.
 */
import Link from 'next/link';
import AnimatedSection from './AnimatedSection';

interface CTASectionProps {
  tag?: string;
  title: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  dark?: boolean;
}

/** Renders a full-width CTA section with configurable text and button links */
export default function CTASection({
  tag = 'Ready to Build?',
  title = "Let's create the most powerful version of your business.",
  description,
  primaryLabel = 'Start Your Project',
  primaryHref = '/contact',
  secondaryLabel = 'Explore Services',
  secondaryHref = '/services',
  dark = true,
}: CTASectionProps) {
  return (
    <section className={`section-padding ${dark ? 'section-dark' : 'section-warm'}`}>
      <AnimatedSection className="container-main text-center max-w-2xl mx-auto">
        {tag && <span className={`tag ${dark ? 'tag-dark' : ''} mb-5 inline-flex`}>{tag}</span>}
        <h2 className="mb-5">{title}</h2>
        {description && <p className="text-lg mb-8 leading-relaxed">{description}</p>}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={primaryHref} className="btn-primary justify-center">
            {primaryLabel}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <Link href={secondaryHref} className={dark ? 'btn-outline-light justify-center' : 'btn-secondary justify-center'}>
            {secondaryLabel}
          </Link>
        </div>
      </AnimatedSection>
    </section>
  );
}
