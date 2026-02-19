import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for PropelusAI. Learn how we collect, use, and protect your personal information.',
  alternates: { canonical: 'https://www.propelusai.com/privacy' },
};

const sections = [
  {
    title: 'Introduction',
    text: 'By using our services, you consent to the data practices described in this Privacy Policy. This policy applies to all users of PropelusAI services and platforms.',
  },
  {
    title: 'Who This Applies To',
    text: 'This policy applies to information collected through our website and platforms, during service delivery, via email, phone, or electronic communications, at events, and through third-party integrations we provide.',
  },
  {
    title: 'Information We Collect',
    items: [
      'Name, email address, phone number, and business address',
      'Company information and job title',
      'Business requirements and project specifications',
      'Communications and correspondence with us',
      'Marketing preferences and interests',
      'Information from business partners, social media platforms, and analytics providers',
    ],
  },
  {
    title: 'How We Use Your Information',
    items: [
      'Deliver AI-powered business solutions and services',
      'Process payments and manage billing',
      'Provide customer support and technical assistance',
      'Communicate about projects and service delivery',
      'Send service updates, newsletters, and marketing materials',
      'Analyze service usage, conduct research, and improve quality',
    ],
  },
  {
    title: 'How We Share Your Information',
    text: 'We do not sell your personal information. We share information with trusted cloud hosting providers, payment processors, email platforms, analytics tools, and customer support platforms. In the event of a merger or acquisition, your information may be transferred as part of the transaction.',
  },
  {
    title: 'Cookies & Tracking',
    text: 'We use cookies and similar technologies to remember preferences, analyze usage, provide personalized content, and improve services. You can control cookie settings through your browser, though disabling cookies may affect functionality.',
  },
  {
    title: 'Data Retention',
    text: 'We retain information as long as necessary to provide services, comply with legal requirements, resolve disputes, and improve operations. When no longer needed, we securely delete or anonymize it.',
  },
  {
    title: 'International Transfers',
    text: 'Your information may be processed in countries other than your own. We ensure appropriate safeguards including adequacy decisions, standard contractual clauses, and certification schemes.',
  },
  {
    title: 'Marketing Communications',
    text: 'You can opt out of marketing at any time by clicking unsubscribe links, updating preferences, or contacting us. You may still receive transactional communications related to our services.',
  },
  {
    title: 'Changes to This Policy',
    text: 'We may update this Privacy Policy to reflect changes in practices or laws. We will notify you of material changes by posting updated policies and sending email notifications.',
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" description="At PropelusAI, we understand that building trust starts with transparency. This policy outlines how we collect, use, and protect your personal information." />

      <section className="section-padding section-light">
        <div className="container-main max-w-3xl">
          {sections.map((section, i) => (
            <div key={section.title} className="mb-10 last:mb-0">
              <h2 className="text-lg font-medium mb-3 flex items-center gap-3">
                <span className="w-7 h-7 rounded-md bg-surface-100 text-surface-500 flex items-center justify-center text-xs font-mono">{i + 1}</span>
                {section.title}
              </h2>
              <div className="pl-10">
                {section.text && <p className="text-sm text-surface-500 leading-relaxed">{section.text}</p>}
                {'items' in section && section.items && (
                  <ul className="space-y-1.5 mt-2">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-surface-500">
                        <span className="w-1 h-1 rounded-full bg-surface-400 mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}

          <div className="mt-12 pt-8 border-t border-surface-100">
            <h3 className="text-base font-medium mb-2">Contact</h3>
            <p className="text-sm text-surface-500">
              Questions about this policy? Contact us at <a href="mailto:support@propelusai.com" className="text-brand-500 hover:underline">support@propelusai.com</a> or call +1 (704) 253-5036 (US) / +91 9477466514 (IN).
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
