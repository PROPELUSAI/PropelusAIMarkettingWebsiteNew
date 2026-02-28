import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of Service for PropelusAI\'s AI powered business solutions and services. Read about account terms, service delivery, payment, intellectual property, and more.',
  openGraph: {
    title: 'Terms of Service - PropelusAI',
    description:
      'Terms of Service for PropelusAI\'s AI powered business solutions and services.',
  },
  alternates: { canonical: 'https://www.propelusai.com/terms' },
};

const sections = [
  {
    title: 'Account Terms',
    content: [
      { subtitle: 'Eligibility', text: 'To use PropelusAI services, you must be at least 18 years old, confirm business use, and have legal authority to enter this agreement.' },
      { subtitle: 'Account Information', text: 'You agree to provide accurate, complete, and current information and maintain the confidentiality of your account credentials.' },
      { subtitle: 'Account Security', text: 'Notify us immediately of any unauthorized use and comply with additional security measures including multi factor authentication.' },
    ],
  },
  {
    title: 'Service Delivery',
    content: [
      { subtitle: 'Project Timelines', text: 'Timelines are estimates based on project scope and complexity. Actual delivery may vary depending on client feedback, revisions, and external factors.' },
      { subtitle: 'Client Cooperation', text: 'Timely completion requires providing materials promptly, delivering feedback within agreed timeframes, and providing approvals in a timely manner.' },
    ],
  },
  {
    title: 'Payment Terms',
    content: [
      { subtitle: 'Fees and Payment', text: 'You agree to pay all fees as outlined in your service agreement. Payment terms vary by service type (upfront, milestone, or recurring).' },
      { subtitle: 'Late Payments', text: 'Late payments may result in service suspension, additional fees, and services remaining suspended until outstanding amounts are paid.' },
      { subtitle: 'Refund Policy', text: 'Refunds are handled case-by-case. Eligibility depends on service and project stage. Custom development and completed deliverables are generally non-refundable.' },
    ],
  },
  {
    title: 'Intellectual Property',
    content: [
      { subtitle: 'Your Content', text: 'You retain ownership of your content. You grant PropelusAI a license to use your content as necessary to provide services.' },
      { subtitle: 'Our IP', text: 'PropelusAI retains all rights to proprietary technologies, methodologies, and intellectual property developed by PropelusAI.' },
      { subtitle: 'Deliverables', text: 'Upon full payment, you receive ownership rights to custom deliverables created specifically for you, excluding our proprietary tools.' },
    ],
  },
  {
    title: 'Data Protection & Privacy',
    content: [
      { subtitle: 'Data Security', text: 'We implement industry-standard security measures with regular audits and updates. You acknowledge inherent risks of data transmission.' },
      { subtitle: 'Data Backup', text: 'We maintain regular backups. You are responsible for maintaining your own backups of critical data and content.' },
      { subtitle: 'Privacy Compliance', text: 'We comply with applicable privacy laws. Our data processing practices are governed by our Privacy Policy.' },
    ],
  },
  {
    title: 'Limitation of Liability',
    content: [
      { subtitle: '', text: 'PropelusAI shall not be liable for indirect, incidental, special, consequential, or punitive damages or loss of profits, data, or business opportunities. Total liability shall not exceed the amount paid in the twelve months preceding the claim.' },
    ],
  },
  {
    title: 'Termination',
    content: [
      { subtitle: 'By Us', text: 'We may suspend or terminate access for violation of terms, non-payment, or other reasonable business reasons.' },
      { subtitle: 'Effect', text: 'Upon termination, access ceases immediately. Data may be deleted after 7 days. Completed deliverables and payments remain unaffected.' },
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms of Service" description="Thank you for choosing PropelusAI! By using our services, you agree to these Terms of Service." />

      <section className="section-padding section-light">
        <div className="container-main max-w-3xl">
          {sections.map((section, i) => (
            <div key={section.title} className="mb-12 last:mb-0">
              <h2 className="text-xl font-medium mb-5 flex items-center gap-3">
                <span className="w-7 h-7 rounded-md bg-surface-100 text-surface-500 flex items-center justify-center text-xs font-mono">{i + 1}</span>
                {section.title}
              </h2>
              <div className="space-y-5 pl-10">
                {section.content.map((item, j) => (
                  <div key={j}>
                    {item.subtitle && <h3 className="text-base font-medium text-surface-700 mb-1.5">{item.subtitle}</h3>}
                    <p className="text-sm text-surface-500 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-12 pt-8 border-t border-surface-100">
            <p className="text-sm text-surface-500">
              If you have questions about these Terms, contact us at <a href="mailto:support@propelusai.com" className="text-brand-500 hover:underline">support@propelusai.com</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
