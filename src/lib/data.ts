/* ============================================
   PropelusAI — Site Content & Data
   ============================================ */

export const siteConfig = {
  name: 'PropelusAI',
  tagline: 'AI Powered Growth',
  description: 'Premium AI services & products for modern businesses. We build AI-driven websites, CRM systems, and subscription-based growth engines.',
  url: 'https://www.propelusai.com',
  email: 'support@propelusai.com',
  whatsapp: { in: '+91 9477466514', us: '+1 7042535036' },
  offices: {
    us: { city: 'Huntersville', state: 'North Carolina', entity: 'BETH and friends LLC' },
    in: { cities: ['Surat, Gujarat', 'Kolkata, West Bengal'], entity: 'RBSS VENTURES (Propelus by RBSS)', gstin: '19ABMFR6144D1ZZ' },
  },
};

export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Services', href: '/services' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Affiliate', href: '/affiliate' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
];

export const stats = [
  { value: '150+', label: 'Products & Services Delivered' },
  { value: '42%', label: 'Faster Sales Cycles Achieved' },
  { value: '3.1×', label: 'Pipeline Growth' },
  { value: '24/5', label: 'Global Support Coverage' },
];

export const products = [
  {
    id: 'linkedin-ads',
    title: 'AI-Driven LinkedIn Advertising',
    subtitle: 'AI-powered LinkedIn advertising optimized monthly for predictable B2B/B2C pipeline growth.',
    description: 'A managed monthly LinkedIn ads subscription using predictive targeting, automation, and conversion tracking to maximize ROI for B2B/B2C teams.',
    icon: 'linkedin',
    deliverables: ['Full-funnel campaign setup', 'AI audience segmentation', 'Ad copy & creative', 'Weekly optimization', 'Split testing', 'Conversion tracking', 'Monthly ROI report'],
  },
  {
    id: 'linkedin-content',
    title: 'LinkedIn Content Engine',
    subtitle: 'A monthly subscription generating AI-assisted posts to grow authority & visibility.',
    description: 'Professional LinkedIn content creation that builds your personal brand and drives engagement through strategic, AI-enhanced posts.',
    icon: 'content',
    deliverables: ['Custom AI-assisted posts/month', 'Profile optimization', 'Posting calendar', 'Brand voice guidelines', 'Engagement strategy', 'Monthly analytics report'],
  },
  {
    id: 'cold-calling',
    title: 'AI-Assisted Cold Calling',
    subtitle: 'A Human + AI cold calling system that prioritizes high-intent prospects.',
    description: 'A managed cold calling solution where AI helps prioritize prospects and optimize outreach while calling volume is tailored to client needs.',
    icon: 'phone',
    deliverables: ['Priority-based prospect lists', 'AI-assisted call scripts', 'Call outcome tracking', 'Performance insights', 'SDR guidance & support'],
  },
  {
    id: 'meta-ads',
    title: 'AI-Based Meta & Google Ads',
    subtitle: 'Managed Meta and Google advertising powered by AI optimization.',
    description: 'A client-driven ad management solution where AI supports campaign optimization, insights, and reporting based on your business goals.',
    icon: 'ads',
    deliverables: ['Meta & Google campaign setup', 'AI creative optimization', 'Performance tracking', 'ROI-focused reporting', 'Ongoing optimization'],
  },
  {
    id: 'crm-analytics',
    title: 'AI-Powered CRM & Lead Management',
    subtitle: 'An AI-powered CRM platform centralizing lead management and analytics.',
    description: 'Built for enterprises — combines lead generation, intelligent scoring, automation, and advanced analytics to help teams capture and convert leads.',
    icon: 'crm',
    deliverables: ['Hosted CRM platform', 'AI lead capture', 'Predictive lead scoring', 'Custom workflows', 'Sales dashboards', 'Pipeline & ROI analytics'],
  },
  {
    id: 'content-creation',
    title: 'AI-Powered Content Creation',
    subtitle: 'AI-assisted content tailored to your platforms and goals.',
    description: 'A flexible content program using SEO-driven workflows to generate high-quality assets across platforms aligned to your business needs.',
    icon: 'edit',
    deliverables: ['AI-generated content assets', 'Platform-specific formats', 'Content planning', 'Performance insights', 'Ongoing iteration'],
  },
];

export const serviceCategories = [
  {
    id: 'web-mobile',
    title: 'Web & Mobile Solutions',
    subtitle: 'AI-crafted digital products and hosting built for scale.',
    services: [
      {
        title: 'AI-Based Website Building & Hosting',
        investment: '$67,600 – $169,000',
        summary: 'Responsive, SEO-optimized websites with AI personalization, embedded chat, and premium managed hosting.',
        timeline: '2–4 weeks for build + managed hosting',
        features: ['AI-powered design system', 'Mobile-first responsive layouts', 'Advanced SEO automation', 'Enterprise hosting with CDN', 'Integrated AI chat', 'Performance analytics'],
      },
      {
        title: 'AI-Based Mobile Application Development',
        investment: '$101,400 – $253,500',
        summary: 'iOS and Android applications enhanced with recommendation engines, predictive analytics, and adaptive UX.',
        timeline: '8–12 weeks build + 2 weeks store approvals',
        features: ['Cross-platform development', 'AI recommendation layers', 'Real-time analytics', 'Push notification strategy', 'App store optimization', 'Performance monitoring'],
      },
    ],
  },
  {
    id: 'ai-marketing',
    title: 'AI Marketing & Advertising',
    subtitle: 'Full-funnel growth programs orchestrated by AI signal loops.',
    services: [
      {
        title: 'AI-Driven LinkedIn Advertising',
        investment: '$8,450 – $16,900/month',
        summary: 'Adaptive campaigns that learn from engagement signals to maximize enterprise LinkedIn ROI.',
        timeline: '1 week setup + ongoing monthly optimization',
        features: ['AI audience segmentation', 'Real-time bid optimization', 'A/B and multivariate testing', 'Conversion tracking with ROI dashboards', 'Creative intelligence', 'Competitor benchmarking'],
      },
      {
        title: 'LinkedIn Revamp & AI Content Strategy',
        investment: '$5,070 – $10,140',
        summary: 'Profile optimization plus 20 AI-guided posts monthly to cement thought leadership.',
        timeline: '1 week revamp + ongoing monthly publishing',
        features: ['Full profile optimization', 'AI writing for 20 posts/month', 'Strategic posting calendar', 'Engagement playbook', 'Brand voice governance', 'Growth analytics'],
      },
      {
        title: 'AI-Based LinkedIn Targeting & Lead Segmentation',
        investment: '$3,380 – $8,450',
        summary: 'Automated lead scoring and behavioral segmentation from millions of LinkedIn profiles.',
        timeline: '2 weeks initial build + monthly refresh',
        features: ['AI lead scoring', 'Firmographic research', 'Behavioral segmentation', 'Contact database curation', 'Targeting optimization', 'CRM sync'],
      },
      {
        title: 'AI-Assisted Cold Calling',
        investment: '$1,690 – $5,070',
        summary: 'Prioritized call lists, dynamic scripts, and coaching insights from call analytics.',
        timeline: '1 week implementation + monthly optimization',
        features: ['Prospect scoring', 'Dynamic script generation', 'Performance tracking', 'Follow-up automation', 'Conversion optimization', 'Call recording insights'],
      },
      {
        title: 'AI-Based Instagram & Facebook Advertising',
        investment: '$2,535 – $5,070/month',
        summary: 'Automated creative intelligence, budget allocation, and optimization across Meta properties.',
        timeline: '1 week deployment + ongoing management',
        features: ['Omni-channel management', 'AI creative optimization', 'Advanced retargeting', 'Dynamic budget allocation', 'Real-time analytics', 'Conversion attribution'],
      },
      {
        title: 'AI-Powered Content Creation & Marketing',
        investment: '$3,380 – $8,450/month',
        summary: 'Ten high-impact content assets per month with SEO alignment and performance tracking.',
        timeline: 'Monthly recurring cadence',
        features: ['AI-assisted ideation', 'SEO research built-in', 'Multi-channel distribution', 'Brand voice governance', 'Engagement monitoring', 'Conversion-focused CTAs'],
      },
    ],
  },
  {
    id: 'crm-automation',
    title: 'CRM & Automation',
    subtitle: 'Custom CRMs, analytics, and automation for precise funnel control.',
    services: [
      {
        title: 'AI-Powered CRM Building & Integration',
        investment: '$33,800 – $84,500',
        summary: 'Custom CRM development with AI analytics, workflow automation, and deep integrations.',
        timeline: '6–8 weeks build + 2 weeks testing',
        features: ['Custom CRM development', 'AI analytics modules', '3rd party integrations', 'Mobile experiences', 'Workflow automation', 'Reporting dashboards'],
      },
      {
        title: 'CRM Performance Tracking & Analytics',
        investment: '$8,450 – $16,900',
        summary: 'Executive-ready dashboards, predictive analytics, and automated reporting on CRM data.',
        timeline: '2 weeks implementation + enhancements',
        features: ['Real-time dashboards', 'Custom KPI tracking', 'Sales funnel analytics', 'Data visualization', 'Automated reports', 'Predictive analytics'],
      },
      {
        title: 'Custom Brand-Tailored CRM Creation',
        investment: '$50,700 – $101,400',
        summary: 'Fully bespoke CRM interfaces and workflows for franchised or multi-brand organizations.',
        timeline: '8–10 weeks build + 2 weeks brand QA',
        features: ['Complete brand customization', 'Custom workflow architecture', 'Role-based access', 'Custom API layer', 'Brand-specific reporting', 'Multi-brand support'],
      },
      {
        title: 'AI-Based Lead Generation & Management',
        investment: '$3,380 – $6,760/month',
        summary: 'Machine learning scores, nurtures, and routes leads across every touchpoint.',
        timeline: '2 weeks setup + continuous optimization',
        features: ['AI lead scoring', 'Multi-channel nurturing', 'Pipeline configuration', 'Behavioral tracking', 'Personalized outreach', 'Performance analytics'],
      },
      {
        title: 'Funnel Tracking & AI-Driven Insights',
        investment: '$1,690 – $4,225/month',
        summary: 'Real-time funnel analytics, AI insights, and CRO recommendations as actionable narratives.',
        timeline: '1 week setup + ongoing monthly analysis',
        features: ['Real-time analytics', 'AI-powered insights', 'CRO frameworks', 'A/B testing', 'Drop-off detection', 'Revenue attribution'],
      },
      {
        title: 'Complete Marketing Automation',
        investment: '$16,900 – $42,250',
        summary: 'Lead capture to customer retention orchestrated through intelligent workflows at scale.',
        timeline: '3–4 weeks + managed optimization',
        features: ['Full workflow mapping', 'Multi-channel campaigns', 'Lead nurturing sequences', 'Journey orchestration', 'Behavioral triggers', 'Performance tracking'],
      },
    ],
  },
  {
    id: 'creative-design',
    title: 'Creative & Design',
    subtitle: 'Professional graphics, logos, and video with AI-assisted workflows.',
    services: [
      {
        title: 'AI-Enhanced Graphics Design',
        investment: '$2,535 – $8,450',
        summary: 'Custom graphics, social media assets, infographics, and presentation decks with brand consistency.',
        timeline: '1–2 weeks + ongoing monthly support',
        features: ['Social media graphics', 'Marketing collateral', 'Infographics', 'Presentation decks', 'Brand-consistent templates', 'Multi-format exports'],
      },
      {
        title: 'Professional Logo Design & Brand Identity',
        investment: '$3,380 – $16,900',
        summary: 'Complete logo design with multiple concepts, refinements, and full brand identity package.',
        timeline: '2–3 weeks complete package',
        features: ['Multiple logo concepts', 'Vector files for all uses', 'Color palette development', 'Typography selection', 'Brand style guide', 'Application mockups'],
      },
      {
        title: 'AI-Assisted Video Production & Editing',
        investment: '$5,070 – $25,350',
        summary: 'Professional video production including explainers, demos, social content, and promotional videos.',
        timeline: '2–4 weeks depending on complexity',
        features: ['Script writing & storyboarding', 'Professional editing', 'Motion graphics', 'AI voiceover options', 'Multi-platform optimization', 'Subtitle generation'],
      },
    ],
  },
  {
    id: 'security-support',
    title: 'Security & Infrastructure',
    subtitle: 'Protect and stabilize business systems with enterprise-grade security.',
    services: [
      {
        title: 'Cybersecurity Audits & Implementation',
        investment: '$8,450 – $33,800',
        summary: 'Comprehensive security assessment, vulnerability testing, and remediation for your digital infrastructure.',
        timeline: '2–4 weeks for audit + implementation',
        features: ['Security assessment', 'Vulnerability testing', 'Remediation plan', 'Compliance review', 'Monitoring setup', 'Incident response plan'],
      },
      {
        title: 'Domain & Email Setup',
        investment: '$845 – $2,535',
        summary: 'Professional domain configuration, email setup, and DNS management for your business.',
        timeline: '1–2 days setup',
        features: ['Domain registration', 'DNS configuration', 'Email setup', 'SPF/DKIM/DMARC', 'SSL certificates', 'Migration support'],
      },
    ],
  },
];

export const testimonials = [
  { quote: 'Our demand engine was transformed in six weeks. Pipeline increased 3.1× and our team closed one of our biggest enterprise deals right after the system went live.', role: 'COO, Industrial Manufacturing', industry: 'Manufacturing (B2B)' },
  { quote: 'The CRM and automation setup restructured our whole funnel. Our sales cycle became 42% faster and forecasting became far more accurate.', role: 'VP Growth, SaaS Platform', industry: 'SaaS (Technology)' },
  { quote: 'We needed strong data protection. PropelusAI delivered a security setup that resulted in zero critical incidents over the last year.', role: 'Head of IT, Healthcare Organization', industry: 'Healthcare' },
  { quote: 'The content engine they built has taken our brand to a new level. Organic traffic grew 4× in 120 days and we\'re now getting daily inbound leads.', role: 'Director of Marketing, Education Company', industry: 'Education' },
  { quote: 'PropelusAI automated our entire workflow and increased our operational efficiency by 78%. Easily the best investment we made.', role: 'Managing Partner, Consulting Firm', industry: 'Consulting' },
  { quote: 'Our mobile app went from outdated to exceptional. Engagement increased by 70% thanks to AI-powered personalization.', role: 'Founder, FinTech Startup', industry: 'Finance (FinTech)' },
  { quote: 'The LinkedIn strategy generated 2,400+ qualified connections in 90 days. Our inbound meeting rate tripled.', role: 'CEO, B2B Marketing Agency', industry: 'Marketing' },
  { quote: 'PropelusAI rebuilt our entire website. Load times dropped by 65%, conversions increased by 2.3×, and bounce rate is under 20%.', role: 'CMO, E-Commerce Brand', industry: 'Retail' },
  { quote: 'Their Meta ads strategy completely changed our acquisition game. ROAS went from 1.8× to 5.2× in just two months.', role: 'Growth Lead, Consumer App', industry: 'Technology' },
  { quote: 'They automated our customer support, inventory management, and reporting. We saved 40+ hours per week.', role: 'Operations Director, Logistics Company', industry: 'Logistics' },
  { quote: 'The AI chatbot handles 80% of customer inquiries automatically. Customer satisfaction scores went up.', role: 'Customer Success Manager, SaaS Startup', industry: 'SaaS' },
  { quote: 'PropelusAI designed and launched our MVP in record time. We secured seed funding within 3 months of launch.', role: 'Founder, Tech Startup', industry: 'Technology' },
  { quote: 'The email marketing automation generates $50K+ in monthly recurring revenue on autopilot. Game changer.', role: 'Marketing Director, Online Education', industry: 'Education' },
  { quote: 'They built a centralized analytics dashboard giving us real-time insights across all channels.', role: 'VP of Analytics, Media Company', industry: 'Media' },
  { quote: 'The AI recommendation engine increased our average order value by 45%. Repeat purchase rate has never been higher.', role: 'Head of Product, Retail Brand', industry: 'Retail (Fashion)' },
  { quote: 'The AI scoring system identifies high-intent prospects with 92% accuracy. Our sales team is closing deals faster than ever.', role: 'Sales Director, Enterprise Software', industry: 'SaaS (Enterprise)' },
];

export const faqCategories = [
  {
    title: 'General',
    items: [
      { q: "What's the difference between your Products and Services?", a: 'Services are one-time, upfront engagements, while Products are subscription-based with recurring monthly access, ongoing optimization, and continuous AI-driven improvements.' },
      { q: 'Which industries do you work with?', a: 'We offer solutions and business consulting across all industries. Whether you are an individual professional or a large enterprise, our expertise is tailored to drive your success.' },
      { q: 'Do you work globally?', a: 'Yes, we support clients globally with offices in the United States (North Carolina) and India (Gujarat & West Bengal), providing 24/5 support coverage.' },
      { q: 'What makes PropelusAI different from other agencies?', a: 'AI-native engineering, outcome-focused execution, enterprise-grade delivery, transparent pricing, global presence, predictive analytics, high-quality automation, and a confidential approach.' },
    ],
  },
  {
    title: 'Services (One-Time Builds)',
    items: [
      { q: 'How long does a website project take?', a: 'Most AI-powered websites take 2–4 weeks depending on the number of pages and complexity.' },
      { q: 'How long does a mobile app take?', a: 'Timelines vary based on requirements, features, and complexity. Typical builds take 8–12 weeks plus 2 weeks for store approvals.' },
      { q: 'Can I request changes after delivery?', a: 'Yes, every service includes post-launch support for minor fixes, plus optional add-ons for extended maintenance.' },
      { q: 'Do you build custom CRMs?', a: 'Yes, we build fully custom CRMs as one-time projects tailored to your brand, as well as white-label and non-white-label solutions.' },
    ],
  },
  {
    title: 'Products (Subscriptions)',
    items: [
      { q: 'How do your subscription Products work?', a: 'Each Product (LinkedIn ads, lead segmentation, CRM hosting, content engine, etc.) is a monthly or quarterly recurring plan that includes ongoing optimization, analytics, reporting, and dedicated support.' },
      { q: 'Do subscriptions include reports?', a: 'Yes, all Product plans include weekly or monthly reports depending on the offering.' },
      { q: 'Can I upgrade or downgrade my subscription?', a: 'Yes, you can adjust your plan at the end of each billing cycle.' },
      { q: 'Do you manage LinkedIn & Meta ads fully?', a: 'Yes, we handle creative, targeting, optimization, reporting, testing, automating and funnel tracking. Ad spend is billed directly to your ad platform.' },
    ],
  },
  {
    title: 'Pricing & Support',
    items: [
      { q: 'Do you offer refunds?', a: 'Only in rare cases where no work or deliverables have been started. Once production begins, refunds are not applicable due to resource commitment.' },
      { q: 'Do you offer bundle pricing?', a: 'Yes, combining multiple services or products may reduce overall cost. E.g., pairing website + CRM + automation.' },
      { q: 'Do Services include support?', a: 'Yes, every one-time service includes a free support window after launch.' },
      { q: 'Can I purchase extended support?', a: 'Yes, we offer maintenance plans, dedicated success managers, and priority support add-ons.' },
    ],
  },
];

export const blogPosts = [
  {
    slug: 'mock-demo-bookings',
    title: 'Why Most Businesses Lose 30–40% of Their Demo Bookings (And How to Fix It)',
    excerpt: 'Most businesses spend thousands on ads, outreach, and lead generation — only to watch 30–40% of booked demos never show up. Learn how to fix this silent revenue killer.',
    category: 'Sales',
    date: 'December 20, 2024',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop',
    featured: true,
    content: `Most businesses spend thousands on ads, outreach, and lead generation — only to watch 30–40% of booked demos never show up. This is a silent revenue killer that drains your pipeline and wastes your sales team's time.

The demo no-show problem isn't just about forgetful prospects. It's a systemic issue rooted in poor follow-up timing, lack of personalization, and missing pre-qualification steps. When a prospect books a demo, they're expressing interest — but that interest has a half-life.

Here's what typically goes wrong: The gap between booking and the actual demo is too long. There's no confirmation or reminder sequence. The prospect doesn't feel invested in the outcome. There's no pre-demo value delivery.

The fix involves implementing an AI-powered engagement sequence that activates the moment a demo is booked. This includes immediate confirmation with a personalized video or message, strategic reminders at 24 hours and 1 hour before, pre-demo content that builds anticipation, and a frictionless rescheduling option.

Companies that implement these systems see demo show rates improve by 40–60%, directly impacting pipeline velocity and revenue.

At PropelusAI, we build these automated engagement systems as part of our marketing automation and CRM solutions. The result is a predictable, high-converting demo pipeline that turns interest into revenue.`,
  },
  {
    slug: 'mock-lead-followup',
    title: 'Why 80% of B2B Leads Never Get Followed Up (And How AI Fixes It)',
    excerpt: 'You spent thousands on ads. Your website is converting. Leads are coming in. But 80% of your leads never get proper follow-up. Discover why and how AI fixes it.',
    category: 'Lead Generation',
    date: 'December 17, 2024',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop',
    featured: true,
    content: `You spent thousands on ads. Your website is converting. Leads are coming in. But here's the uncomfortable truth: 80% of B2B leads never get proper follow-up. The money you invested in generating those leads? Largely wasted.

This isn't a people problem — it's a systems problem. Most sales teams are overwhelmed with manual tasks, lack lead prioritization tools, and don't have the bandwidth to follow up with every lead within the critical first hour.

Research shows that responding to a lead within 5 minutes makes you 21× more likely to qualify them. Yet the average B2B response time is 42 hours. That's not a gap — it's a canyon.

AI changes this equation entirely. Here's how:

Instant Lead Scoring: AI analyzes behavioral signals, firmographic data, and engagement patterns to score leads in real-time, ensuring your team focuses on the highest-intent prospects first.

Automated Initial Outreach: While your team sleeps, AI-powered sequences engage leads with personalized emails, SMS, or LinkedIn messages within minutes of their inquiry.

Smart Routing: AI routes leads to the right rep based on territory, expertise, product interest, and availability — eliminating the manual sorting that causes delays.

Predictive Follow-Up: AI determines the optimal time, channel, and message for follow-up based on historical conversion data.

At PropelusAI, our AI-powered CRM and lead management systems ensure zero leads fall through the cracks. Every inquiry gets an immediate, intelligent response.`,
  },
];

export const values = [
  { title: 'Precision in Everything', description: 'Every project begins with intention — from design tokens to workflow architecture. No shortcuts, no guesswork.' },
  { title: 'Product-Grade Engineering', description: 'Digital experiences matching world-class software quality. Clean architecture and enterprise-ready execution come standard.' },
  { title: 'AI at the Core', description: "AI isn't a feature — it's embedded across research, segmentation, automation, analytics, content, and system intelligence." },
  { title: 'Outcome-First Thinking', description: 'Everything we build must drive a measurable business result: more revenue, efficiency, opportunities, and clarity.' },
];

export const footerLinks = {
  products: [
    { label: 'LinkedIn Ads', href: '/products' },
    { label: 'LinkedIn Content Engine', href: '/products' },
    { label: 'Lead Generation Engine', href: '/products' },
    { label: 'CRM Subscription', href: '/products' },
    { label: 'Meta Ads Management', href: '/products' },
    { label: 'Content Creation', href: '/products' },
  ],
  services: [
    { label: 'AI Website Development', href: '/services' },
    { label: 'Mobile App Development', href: '/services' },
    { label: 'Custom CRM Build', href: '/services' },
    { label: 'Automation Setup', href: '/services' },
    { label: 'Technical Integrations', href: '/services' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Testimonials', href: '/testimonials' },
    { label: 'Blogs', href: '/blogs' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ],
};
