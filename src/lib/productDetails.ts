import { products } from './data';
import { slugify } from './slugify';

export interface ProductDetail {
  slug: string;
  startingPrice: string;
  priceNote: string;
  relatedServiceSlugs: string[];
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  deliverables: string[];
  longDescription: string[];
  expandedFeatures: string[];
  useCases: string[];
  faqs: Array<{ question: string; answer: string }>;
  relatedSlugs: string[];
}

function generateProductDetails(): ProductDetail[] {
  return products.map((p) => {
    const slug = slugify(p.title);
    const detail = productDetailMap[p.id];

    return {
      slug,
      id: p.id,
      title: p.title,
      subtitle: p.subtitle,
      description: p.description,
      icon: p.icon,
      deliverables: p.deliverables,
      longDescription: detail?.longDescription || [p.description],
      expandedFeatures: detail?.expandedFeatures || p.deliverables,
      useCases: detail?.useCases || ['B2B companies', 'SaaS platforms', 'E commerce brands', 'Professional services'],
      faqs: detail?.faqs || [
        { question: `What is included in the ${p.title} subscription?`, answer: `Each month you receive ${p.deliverables.slice(0, 3).join(', ')}, plus ongoing optimization and reporting.` },
        { question: 'How does the monthly subscription work?', answer: 'You subscribe to a monthly plan with clear deliverables and reporting. Plans can be adjusted at the end of each billing cycle.' },
        { question: 'When will I see results?', answer: 'Most clients see measurable results within the first 30-60 days, with compounding improvements over subsequent months.' },
      ],
      relatedSlugs: detail?.relatedSlugs || [],
      startingPrice: productPricingMap[p.id] || 'Contact for pricing',
      priceNote: 'Plans can be adjusted at the end of each billing cycle. Custom enterprise pricing available.',
      relatedServiceSlugs: productToServiceMap[p.id] || [],
    };
  });
}

/* TODO: verify all pricing with leadership before production launch */
const productPricingMap: Record<string, string> = {
  'linkedin-ads': 'Starting from $499/month',
  'linkedin-content': 'Starting from $299/month',
  'cold-calling': 'Starting from $399/month',
  'meta-ads': 'Starting from $499/month',
  'crm-analytics': 'Starting from $799/month',
  'content-creation': 'Starting from $249/month',
  'thought-leadership': 'Starting from $399/month',
  'content-calendar': 'Starting from $349/month',
  'whatsapp-business': 'Starting from $199/month',
  'instagram-facebook-ads': 'Starting from $499/month',
  'linkedin-targeting': 'Starting from $349/month',
  'lead-generation': 'Starting from $599/month',
  'social-media-reels': 'Starting from $499/month',
  'ai-copywriting': 'Starting from $299/month',
  'funnel-tracking': 'Starting from $199/month',
  'email-marketing': 'Starting from $249/month',
  'performance-dashboard': 'Starting from $149/month',
  'sales-enablement': 'Starting from $699/month',
  'brand-monitoring': 'Starting from $299/month',
  'podcast-production': 'Starting from $599/month',
  'event-marketing': 'Starting from $499/month',
};

const productToServiceMap: Record<string, string[]> = {
  'linkedin-ads': ['ai-driven-linkedin-advertising', 'marketing-automation-and-workflow-implementation'],
  'linkedin-content': ['content-strategy-and-editorial-production', 'brand-identity-and-design-system-development'],
  'cold-calling': ['ai-powered-crm-building-and-integration', 'marketing-automation-and-workflow-implementation'],
  'meta-ads': ['ai-based-website-building', 'marketing-automation-and-workflow-implementation'],
  'crm-analytics': ['ai-powered-crm-building-and-integration', 'api-integration-and-third-party-services'],
  'content-creation': ['content-strategy-and-editorial-production', 'brand-identity-and-design-system-development'],
  'thought-leadership': ['content-strategy-and-editorial-production'],
  'instagram-facebook-ads': ['ai-based-website-building', 'marketing-automation-and-workflow-implementation'],
  'linkedin-targeting': ['ai-driven-linkedin-advertising', 'ai-powered-crm-building-and-integration'],
  'lead-generation': ['ai-powered-crm-building-and-integration', 'marketing-automation-and-workflow-implementation'],
  'social-media-reels': ['video-production-and-motion-design', 'brand-identity-and-design-system-development'],
  'ai-copywriting': ['content-strategy-and-editorial-production', 'ai-based-website-building'],
  'funnel-tracking': ['marketing-automation-and-workflow-implementation', 'ai-based-website-building'],
  'email-marketing': ['marketing-automation-and-workflow-implementation', 'custom-email-domain-setup'],
  'performance-dashboard': ['api-integration-and-third-party-services', 'ai-powered-crm-building-and-integration'],
  'sales-enablement': ['ai-powered-crm-building-and-integration', 'marketing-automation-and-workflow-implementation'],
  'brand-monitoring': ['brand-identity-and-design-system-development', 'content-strategy-and-editorial-production'],
  'podcast-production': ['content-strategy-and-editorial-production', 'video-production-and-motion-design'],
  'event-marketing': ['marketing-automation-and-workflow-implementation', 'ai-based-website-building'],
  'whatsapp-business': ['marketing-automation-and-workflow-implementation', 'ai-powered-crm-building-and-integration'],
  'content-calendar': ['content-strategy-and-editorial-production', 'brand-identity-and-design-system-development'],
};

type DetailOverride = {
  longDescription: string[];
  expandedFeatures: string[];
  useCases: string[];
  faqs: Array<{ question: string; answer: string }>;
  relatedSlugs: string[];
};

const productDetailMap: Record<string, DetailOverride> = {
  'linkedin-ads': {
    longDescription: [
      'Our LinkedIn advertising subscription delivers managed campaign execution optimized by AI for predictable B2B pipeline growth. We handle strategy, creative, targeting, and optimization so you can focus on closing deals.',
      'Every month, our team analyzes campaign performance data, adjusts targeting parameters, tests new creative formats, and refines audience segments to maximize your return on ad spend. This continuous optimization cycle compounds results over time.',
    ],
    expandedFeatures: ['Full funnel campaign setup and management', 'AI powered audience segmentation', 'Ad copy and creative production', 'Weekly optimization cycles', 'A/B split testing on ads and audiences', 'Conversion tracking and attribution', 'Monthly ROI report with recommendations', 'Dedicated account manager'],
    useCases: ['B2B lead generation', 'Enterprise account based marketing', 'SaaS customer acquisition', 'Professional services firms', 'Recruiting and talent acquisition', 'Executive personal branding'],
    faqs: [
      { question: 'Do I need to pay for LinkedIn ad spend separately?', answer: 'Yes. Our subscription fee covers strategy, creative, and management. Ad spend is billed directly to your LinkedIn Ads account, giving you full control over budget.' },
      { question: 'What budget should I allocate for LinkedIn ads?', answer: 'We recommend a minimum monthly ad spend of $2,000-5,000 for meaningful results. Our team will optimize every dollar for maximum ROI based on your goals.' },
      { question: 'How do you target the right audience?', answer: 'We use AI powered audience segmentation combining job titles, industries, company sizes, engagement signals, and behavioral data to reach high intent decision makers.' },
    ],
    relatedSlugs: ['ai-based-linkedin-targeting-and-lead-segmentation', 'ai-based-meta-and-google-advertising', 'linkedin-content-engine'],
  },
  'crm-analytics': {
    longDescription: [
      'Our CRM analytics and lead management platform centralizes your entire sales operation with AI powered intelligence. Every lead is automatically scored, routed, and nurtured based on behavioral signals and engagement patterns.',
      'The platform includes custom dashboards that give your leadership team real time visibility into pipeline health, conversion rates, and team performance. Predictive analytics help forecast revenue and identify at risk deals before they stall.',
    ],
    expandedFeatures: ['Hosted CRM platform with custom branding', 'AI based lead capture and management', 'Predictive lead scoring and smart routing', 'Custom fields and automated workflows', 'Sales and service performance dashboards', 'Pipeline, funnel, and ROI analytics', 'Email integration and activity tracking', 'Mobile access for field teams'],
    useCases: ['Enterprise sales teams', 'Multi channel lead management', 'Customer success tracking', 'Healthcare patient management', 'Real estate lead tracking', 'Financial services client management'],
    faqs: [
      { question: 'Can this integrate with our existing tools?', answer: 'Yes. Our CRM platform integrates with email providers, marketing tools, accounting software, and any system with an API. We handle the integration setup as part of onboarding.' },
      { question: 'How does the AI lead scoring work?', answer: 'Our AI analyzes behavioral signals, engagement patterns, firmographic data, and historical conversion data to assign a predictive score to each lead, helping your team prioritize high intent prospects.' },
      { question: 'Is there a setup fee?', answer: 'Initial setup and data migration are included in the first month of your subscription. Custom integrations may require additional one time setup depending on complexity.' },
    ],
    relatedSlugs: ['ai-based-lead-generation-and-management', 'funnel-tracking-and-ai-driven-insights', 'linkedin-ads'],
  },
};

export const allProductDetails = generateProductDetails();

export function getProductBySlug(slug: string): ProductDetail | undefined {
  return allProductDetails.find((p) => p.slug === slug);
}

export function getAllProductSlugs(): string[] {
  return allProductDetails.map((p) => p.slug);
}
