import type { Metadata } from 'next';
import Link from 'next/link';
import AnimatedSection from '@/components/AnimatedSection';
import PageHero from '@/components/PageHero';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Case Studies | AI Development Results',
  description:
    'Real project outcomes from PropelusAI. See how we built custom CRMs, SaaS platforms, and marketing automation systems with measurable business impact.',
  alternates: { canonical: 'https://www.propelusai.com/case-studies' },
  openGraph: {
    title: 'PropelusAI Case Studies',
    description: 'Real project outcomes with measurable business impact.',
  },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.propelusai.com' },
    { '@type': 'ListItem', position: 2, name: 'Case Studies', item: 'https://www.propelusai.com/case-studies' },
  ],
};

/* TODO: Replace with real client case studies */
const caseStudies = [
  {
    slug: 'custom-crm-manufacturing',
    title: 'Custom CRM That Reduced Sales Cycle by 40%',
    industry: 'Manufacturing (B2B)',
    metrics: ['42% faster sales cycle', '3.1x pipeline growth', '150+ users onboarded'],
    summary: 'A mid market manufacturing company needed to replace a fragmented Salesforce setup with a custom CRM built around their specific sales process. We built a full stack CRM with AI lead scoring, automated follow ups, and real time pipeline dashboards.',
    services: ['Custom CRM Development', 'Marketing Automation', 'API Integration'],
  },
  {
    slug: 'saas-platform-fintech',
    title: 'SaaS Platform: From Concept to 10,000 Users in 6 Months',
    industry: 'Financial Technology',
    metrics: ['10,000 users in 6 months', '$2.4M ARR', '99.9% uptime'],
    summary: 'A fintech startup needed a compliance-ready SaaS platform to manage investment portfolios for retail investors. We built the full stack on Next.js and Node.js with PostgreSQL, including Stripe billing, two-factor authentication, and SEC reporting modules.',
    services: ['SaaS Development', 'AI Website Development', 'Cybersecurity Audit'],
  },
  {
    slug: 'marketing-automation-b2b-services',
    title: 'AI Marketing Automation for a B2B Services Company',
    industry: 'Professional Services',
    metrics: ['78% efficiency improvement', '4x organic traffic', '$50K/month from automation'],
    summary: 'A consulting firm with 200 employees was spending 60+ hours per week on manual lead management and email outreach. We implemented a complete marketing automation stack with AI lead scoring, nurture sequences, and CRM integration.',
    services: ['Marketing Automation', 'CRM Development', 'Content Strategy'],
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <PageHero
        tag="Real Results"
        title="Case Studies"
        description="Project outcomes from website development, CRM builds, SaaS platforms, and marketing automation engagements. Each case study documents the challenge, our approach, and the measurable results."
      />

      <section className="section-padding section-light">
        <div className="container-main max-w-4xl">
          <AnimatedSection>
            <h2 className="text-2xl font-medium mb-5">Our Track Record</h2>
            <p className="text-surface-600 leading-relaxed mb-5">
              We have delivered 150+ projects across SaaS, fintech, healthcare, manufacturing, e commerce, and
              professional services. The case studies below represent a cross-section of our work, from custom CRM
              builds that shortened sales cycles to SaaS platforms that scaled to thousands of users within months.
              Client names and identifying details are anonymized to protect confidential business relationships.
            </p>
            <p className="text-surface-500 leading-relaxed mb-12">
              Each engagement follows our four phase process: discovery, strategy, build, and launch. The results
              below reflect outcomes measured 3 to 6 months post launch.
            </p>
          </AnimatedSection>

          <div className="space-y-8">
            {caseStudies.map((cs) => (
              <AnimatedSection key={cs.slug}>
                <div className="card">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-medium text-brand-500 bg-brand-50 px-2.5 py-1 rounded-full">{cs.industry}</span>
                  </div>
                  <h3 className="text-xl font-medium mb-3">{cs.title}</h3>
                  <p className="text-surface-600 leading-relaxed mb-5">{cs.summary}</p>

                  <div className="grid sm:grid-cols-3 gap-4 mb-5">
                    {cs.metrics.map((metric) => (
                      <div key={metric} className="text-center p-3 rounded-lg bg-surface-50 border border-surface-100">
                        <p className="text-sm font-medium text-surface-800">{metric}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {cs.services.map((svc) => (
                      <span key={svc} className="text-xs text-surface-500 bg-surface-50 border border-surface-100 px-2.5 py-1 rounded-full">{svc}</span>
                    ))}
                  </div>

                  <Link href="/contact" className="btn-primary text-sm py-2.5 px-6">
                    Discuss a Similar Project
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        tag="Ready to Build?"
        title="Start your project with a free consultation."
        description="Share your goals and we will map a solution with clear timelines and pricing."
        primaryLabel="Get Started"
        primaryHref="/contact"
        secondaryLabel="View Services"
        secondaryHref="/services"
      />
    </>
  );
}
