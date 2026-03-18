import { serviceCategories } from './data';
import { slugify } from './slugify';

export interface ServiceDetail {
  slug: string;
  title: string;
  headline: string;
  summary: string;
  description: string;
  timeline: string;
  features: string[];
  categoryTitle: string;
  categoryId: string;
  longDescription: string[];
  useCases: string[];
  process: string[];
  faqs: Array<{ question: string; answer: string }>;
  relatedSlugs: string[];
  startingPrice: string;
  priceNote: string;
  relatedProductSlugs: string[];
}

function generateServiceDetails(): ServiceDetail[] {
  const allServices: ServiceDetail[] = [];

  for (const cat of serviceCategories) {
    for (const svc of cat.services) {
      const slug = slugify(svc.title);
      const detail = detailMap[slug];

      allServices.push({
        slug,
        title: svc.title,
        headline: svc.headline || '',
        summary: svc.summary,
        description: svc.description || '',
        timeline: svc.timeline,
        features: svc.features,
        categoryTitle: cat.title,
        categoryId: cat.id,
        longDescription: detail?.longDescription || [svc.description || svc.summary],
        useCases: detail?.useCases || ['SaaS companies', 'E commerce brands', 'Professional services', 'Startups and scale ups'],
        process: detail?.process || ['Discovery and requirements analysis', 'Strategy and planning', 'Implementation and development', 'Testing and quality assurance', 'Launch and optimization'],
        faqs: detail?.faqs || [
          { question: `What is included in ${svc.title}?`, answer: `This service includes ${svc.features.slice(0, 3).join(', ')}, and more. Every engagement comes with a dedicated account manager and post launch support.` },
          { question: 'How long does this service take?', answer: `Typical timeline is ${svc.timeline}. We provide weekly status updates throughout the project.` },
          { question: 'Do you offer ongoing support after delivery?', answer: 'Yes, every service includes a post launch support window. Extended maintenance plans are available for long-term needs.' },
        ],
        relatedSlugs: detail?.relatedSlugs || [],
        startingPrice: detail?.startingPrice || servicePricingMap[slug] || 'Contact for pricing',
        priceNote: 'Final pricing depends on project scope, complexity, and timeline. Contact us for a custom quote.',
        relatedProductSlugs: serviceToProductMap[slug] || [],
      });
    }
  }

  return allServices;
}

/* TODO: verify all pricing with leadership before production launch */
const servicePricingMap: Record<string, string> = {
  'ai-based-website-building': 'Starting from $2,500',
  'ai-based-mobile-application-development': 'Starting from $5,000',
  'ai-powered-crm-building-and-integration': 'Starting from $8,000',
  'saas-development': 'Starting from $10,000',
  'custom-email-domain-setup': 'Starting from $200',
  'cybersecurity-audit-and-protection': 'Starting from $1,500',
  'marketing-automation-and-workflow-implementation': 'Starting from $1,500',
  'ai-driven-linkedin-advertising': 'Starting from $1,000/month',
  'api-integration-and-third-party-services': 'Starting from $1,500',
  'brand-identity-and-design-system-development': 'Starting from $2,000',
  'content-strategy-and-editorial-production': 'Starting from $1,500',
  'video-production-and-motion-design': 'Starting from $2,000',
  'ai-powered-chatbot-and-virtual-assistant-development': 'Starting from $3,000',
  'ai-based-data-analytics-and-business-intelligence': 'Starting from $3,000',
  'ui-ux-design-and-design-system-development': 'Starting from $2,000',
};

const serviceToProductMap: Record<string, string[]> = {
  'ai-based-website-building': ['ai-powered-content-creation', 'funnel-tracking-and-cro-analytics', 'ai-enhanced-copywriting-and-messaging-strategy'],
  'ai-based-mobile-application-development': ['ai-powered-crm-analytics-and-lead-management', 'performance-dashboard-subscription'],
  'ai-powered-crm-building-and-integration': ['ai-powered-crm-analytics-and-lead-management', 'ai-based-lead-generation-and-management', 'ai-powered-email-marketing-and-automation'],
  'saas-development': ['performance-dashboard-subscription', 'ai-powered-crm-analytics-and-lead-management'],
  'marketing-automation-and-workflow-implementation': ['ai-powered-email-marketing-and-automation', 'ai-based-lead-generation-and-management', 'funnel-tracking-and-cro-analytics'],
  'ai-driven-linkedin-advertising': ['ai-driven-linkedin-advertising', 'linkedin-content-engine', 'ai-based-linkedin-targeting-and-lead-segmentation'],
  'cybersecurity-audit-and-protection': ['ai-brand-monitoring-and-reputation-management'],
  'custom-email-domain-setup': ['ai-powered-email-marketing-and-automation'],
  'brand-identity-and-design-system-development': ['ai-powered-content-creation', 'multi-platform-content-calendar-management'],
  'content-strategy-and-editorial-production': ['ai-powered-content-creation', 'linkedin-content-engine', 'ai-enhanced-copywriting-and-messaging-strategy'],
  'video-production-and-motion-design': ['social-media-reels-and-short-form-video-production'],
  'api-integration-and-third-party-services': ['ai-powered-crm-analytics-and-lead-management', 'performance-dashboard-subscription'],
};

type DetailOverride = {
  longDescription: string[];
  useCases: string[];
  process: string[];
  faqs: Array<{ question: string; answer: string }>;
  relatedSlugs: string[];
  startingPrice?: string;
};

const detailMap: Record<string, DetailOverride> = {
  'ai-based-website-building': {
    longDescription: [
      'Our website development service combines strategic UX design with AI powered personalization to deliver websites that drive measurable business outcomes. Every project starts with a deep understanding of your target audience, competitive landscape, and growth objectives.',
      'We build responsive, fast loading websites optimized for search engines and conversions. Our technology stack includes modern frameworks and content delivery networks that ensure your site performs reliably under any traffic conditions.',
      'Beyond the initial build, we provide continuous performance monitoring, security patching, and uptime support. Your website becomes a living growth asset that evolves alongside your business.',
    ],
    useCases: ['Corporate websites for B2B companies', 'E commerce storefronts', 'SaaS product marketing sites', 'Professional service firms', 'Healthcare and fintech portals', 'Startup landing pages'],
    process: ['Discovery workshop and competitive audit', 'Wireframing and UX strategy', 'Visual design and brand integration', 'Development with AI personalization features', 'Performance testing and SEO optimization', 'Launch, monitoring, and ongoing support'],
    faqs: [
      { question: 'What technology stack do you use for website development?', answer: 'We use modern frameworks like Next.js and React, paired with headless CMS solutions and cloud infrastructure. The specific stack is tailored to your performance, scalability, and content management needs.' },
      { question: 'Do you handle domain and SSL setup?', answer: 'Yes. Domain configuration, SSL certificates, DNS management, and CDN setup are all included in every website project.' },
      { question: 'Can you redesign my existing website?', answer: 'Absolutely. We handle full redesigns, migrations from other platforms, and incremental upgrades to existing sites.' },
      { question: 'What does post launch support include?', answer: 'Post launch support covers security updates, performance monitoring, daily backups, and uptime support. We handle the infrastructure so you can focus on your business.' },
    ],
    relatedSlugs: ['ai-based-mobile-application-development', 'custom-email-domain-setup', 'complete-brand-identity-and-positioning-package'],
  },
  'ai-based-mobile-application-development': {
    longDescription: [
      'Our mobile app development service delivers cross platform iOS and Android applications with embedded intelligence. From recommendation engines to predictive analytics, every app we build is designed to learn from user behavior and improve over time.',
      'We handle the complete lifecycle from concept validation and UX design through development, testing, and app store submissions. Our development approach ensures native level performance while maintaining a single codebase for faster iteration.',
      'Post launch, we provide analytics dashboards, crash monitoring, and a structured maintenance plan to keep your app performing at its best as your user base grows.',
    ],
    useCases: ['FinTech mobile banking apps', 'Healthcare patient portals', 'E commerce shopping applications', 'Enterprise workforce tools', 'On demand service platforms', 'Education and learning apps'],
    process: ['Product discovery and requirements mapping', 'UX research and interface design', 'Cross platform development', 'QA testing across devices', 'App store submission and approval', 'Post launch monitoring and optimization'],
    faqs: [
      { question: 'Do you build native or cross platform apps?', answer: 'We primarily build cross platform apps using modern frameworks that deliver native level performance on both iOS and Android from a single codebase. Native development is available for projects requiring platform specific capabilities.' },
      { question: 'How long does the app store approval process take?', answer: 'Apple App Store review typically takes 1-3 days, while Google Play Store can approve within hours. We handle all submission requirements, assets, and compliance documentation.' },
      { question: 'What analytics are included?', answer: 'Every app includes an analytics dashboard tracking user engagement, retention, crash reports, and key business metrics. We can integrate with your existing analytics tools as well.' },
    ],
    relatedSlugs: ['ai-based-website-building', 'ai-powered-crm-building-and-integration', 'cybersecurity-and-data-protection'],
  },
  'ai-powered-crm-building-and-integration': {
    longDescription: [
      'Our custom CRM development service creates a system that mirrors your exact operating model. Unlike off the shelf CRMs that force you to adapt your workflows, we build a platform tailored to how your teams actually work.',
      'We layer predictive intelligence on top of your customer data, enabling automated lead scoring, smart routing, and workflow automation that eliminates manual busywork. Deep integrations with your existing tools ensure seamless data flow across your entire tech stack.',
      'The result is a CRM that your team actually wants to use, backed by training, documentation, and ongoing support to ensure successful adoption.',
    ],
    useCases: ['B2B sales teams managing complex pipelines', 'Multi location service businesses', 'Franchise operations needing brand consistency', 'Healthcare providers tracking patient relationships', 'Real estate firms managing property leads', 'Professional services firms'],
    process: ['Workflow audit and requirements gathering', 'Architecture design and integration planning', 'CRM platform development', 'Data migration and integration setup', 'User training and documentation', 'Go live support and optimization'],
    faqs: [
      { question: 'Can you integrate with our existing tools?', answer: 'Yes. We build integrations with email platforms, accounting software, marketing tools, and any system with an API. Data migration from your current CRM is included.' },
      { question: 'How is your custom CRM different from Salesforce or HubSpot?', answer: 'Unlike generic platforms, our CRM is built specifically for your business processes. No unused features, no forced workarounds. You get exactly what you need with the flexibility to evolve as your business grows.' },
      { question: 'What happens if we need changes after launch?', answer: 'Post launch modifications are handled through our support plans. The CRM is built on modern architecture that allows for clean feature additions and workflow changes.' },
    ],
    relatedSlugs: ['crm-performance-tracking-and-analytics', 'custom-brand-tailored-crm-creation', 'complete-marketing-automation'],
  },
  'complete-marketing-automation': {
    longDescription: [
      'Our marketing automation service builds end to end automation architecture that connects every stage of your customer lifecycle. From initial lead capture through nurturing, conversion, and retention, every touchpoint is orchestrated through intelligent workflows.',
      'We evaluate your existing tech stack, identify automation opportunities, and implement systems that adapt to user behavior in real time. This includes email sequences, SMS campaigns, social media automation, and multi channel attribution tracking.',
      'The goal is not just efficiency but effectiveness. Every automated workflow is designed to deliver the right message at the right time, increasing conversion rates while reducing manual effort for your team.',
    ],
    useCases: ['SaaS onboarding and retention sequences', 'E commerce abandoned cart and re engagement', 'B2B lead nurturing pipelines', 'Education enrollment workflows', 'Healthcare appointment follow ups', 'Event registration and follow up'],
    process: ['Tech stack audit and automation opportunity mapping', 'Workflow design and journey mapping', 'Platform configuration and integration', 'Campaign template creation', 'Testing and optimization', 'Training and handoff with monitoring'],
    faqs: [
      { question: 'What marketing automation platforms do you work with?', answer: 'We work with all major platforms including HubSpot, ActiveCampaign, Mailchimp, Klaviyo, and custom solutions. We recommend the best fit based on your needs and budget.' },
      { question: 'How quickly will we see results?', answer: 'Most clients see measurable improvement in lead response times and nurture engagement within the first month. Full pipeline impact typically materializes within 60-90 days.' },
      { question: 'Do you handle the content for automated campaigns?', answer: 'Yes. We create email templates, SMS copy, and campaign assets as part of the implementation. Ongoing content creation is available as an add on service.' },
    ],
    relatedSlugs: ['ai-based-lead-generation-and-management', 'funnel-tracking-and-ai-driven-insights', 'ai-powered-crm-building-and-integration'],
  },
  'cybersecurity-and-data-protection': {
    longDescription: [
      'Our cybersecurity service provides comprehensive defense in depth protection for your digital assets. We conduct thorough security assessments, implement modern protective tooling, and maintain continuous monitoring to keep your data safe from evolving threats.',
      'Our approach covers every layer of your infrastructure including network security, application security, data encryption, access management, and incident response planning. We align our work with industry frameworks such as NIST, SOC 2, and GDPR requirements.',
      'Beyond the initial hardening, we provide ongoing threat surveillance with monthly security reports, vulnerability scanning, and rapid incident response to ensure your security posture remains strong over time.',
    ],
    useCases: ['Healthcare organizations handling patient data', 'Financial services and fintech companies', 'E commerce platforms processing payments', 'SaaS companies managing customer data', 'Legal firms protecting client information', 'Government contractors requiring compliance'],
    process: ['Security posture assessment and risk analysis', 'Threat modeling and vulnerability scanning', 'Protection system deployment', 'Monitoring and alerting configuration', 'Incident response planning and documentation', 'Ongoing monitoring and monthly reporting'],
    faqs: [
      { question: 'What compliance frameworks do you support?', answer: 'We support NIST, SOC 2, GDPR, HIPAA, PCI DSS, and ISO 27001 compliance requirements. Our assessments identify gaps and our implementation closes them.' },
      { question: 'Do you provide 24/7 monitoring?', answer: 'Yes. Our monitoring systems provide continuous surveillance with automated alerting. For critical incidents, our response team is available around the clock.' },
      { question: 'What happens if a security incident occurs?', answer: 'We follow documented incident response procedures including immediate containment, investigation, remediation, and post incident reporting. Response time depends on severity level.' },
    ],
    relatedSlugs: ['custom-email-domain-setup', 'ai-based-website-building', 'ai-powered-crm-building-and-integration'],
  },
};

export const allServiceDetails = generateServiceDetails();

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return allServiceDetails.find((s) => s.slug === slug);
}

export function getAllServiceSlugs(): string[] {
  return allServiceDetails.map((s) => s.slug);
}
