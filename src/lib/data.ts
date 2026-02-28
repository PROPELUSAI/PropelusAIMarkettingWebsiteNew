/* ============================================
   PropelusAI. Site Content & Data
   ============================================ */

export const siteConfig = {
  name: 'PropelusAI',
  tagline: 'AI Powered Growth',
  description: 'Premium AI services & products for modern businesses. We build AI driven websites, CRM systems, and subscription based growth engines.',
  url: 'https://www.propelusai.com',
  email: 'support@propelusai.com',
  whatsapp: { in: '+91 9477466514', us: '+1 6232357330' },
  offices: {
    us: { city: 'Phoenix', state: 'Arizona', entity: 'BETH and friends LLC' },
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
  { value: '150+', label: 'Products and Services Delivered' },
  { value: '42%', label: 'Faster Sales Cycles Achieved for Clients' },
  { value: '3.1×', label: 'Pipeline Grown' },
  { value: '24/5', label: 'Global Support Coverage' },
];

export const products = [
  {
    id: 'linkedin-ads',
    title: 'AI Driven LinkedIn Advertising',
    subtitle: 'AI powered LinkedIn advertising optimized monthly for predictable B2B/B2C pipeline growth.',
    description: 'A managed monthly LinkedIn ads subscription using predictive targeting, automation, and conversion tracking to maximize ROI for B2B/B2C teams and growing brands.',
    icon: 'linkedin',
    deliverables: ['Full funnel campaign setup', 'AI audience segmentation', 'Ad copy & creative', 'Weekly optimization', 'Split testing', 'Conversion tracking', 'Monthly ROI report'],
  },
  {
    id: 'linkedin-content',
    title: 'LinkedIn Content Engine',
    subtitle: 'A monthly subscription generating AI assisted posts to grow authority & visibility.',
    description: 'Professional LinkedIn content creation service that builds your personal brand and drives engagement through strategic, AI enhanced posts.',
    icon: 'content',
    deliverables: ['Custom AI assisted LinkedIn posts/month', 'Profile optimization', 'Posting calendar', 'Brand voice guidelines', 'Engagement strategy', 'Monthly analytics report'],
  },
  {
    id: 'cold-calling',
    title: 'AI Assisted Cold Calling & Prospect Prioritization',
    subtitle: 'A Human + AI cold calling system that prioritizes high intent prospects, supports custom calling strategies, and tracks outcomes to improve conversions.',
    description: 'A managed cold calling solution where AI helps prioritize prospects and optimize outreach, while calling volume and approach are tailored to client requirements.',
    icon: 'phone',
    deliverables: ['Priority based prospect call lists', 'AI assisted call scripts', 'Call outcome & conversion tracking', 'Performance insights & optimization', 'SDR guidance and improvement support'],
  },
  {
    id: 'meta-ads',
    title: 'AI Based Meta and Google Advertising',
    subtitle: 'Managed Meta and Google advertising powered by AI to optimize targeting, creatives, and performance based on your business goals.',
    description: 'A client driven Meta ads management solution where AI supports campaign optimization, insights, and reporting, while strategies adapt to your objectives and budget.',
    icon: 'ads',
    deliverables: ['Meta & Google campaign setup', 'AI assisted creative optimization', 'Performance tracking & insights', 'ROI focused reporting', 'Ongoing optimization based on client goals'],
  },
  {
    id: 'crm-analytics',
    title: 'AI Powered CRM, Analytics & Lead Management',
    subtitle: 'An AI powered CRM platform that centralizes lead management, automates workflows, tracks performance, and delivers actionable insights across sales and service teams.',
    description: 'Built for enterprises, it combines lead generation, intelligent scoring, automation, and advanced analytics to help teams capture, nurture, convert, and optimize leads efficiently.',
    icon: 'crm',
    deliverables: ['Hosted CRM platform', 'AI based lead capture & management', 'Predictive lead scoring & routing', 'Custom fields & automated workflows', 'Sales & service performance dashboards', 'Pipeline, funnel & ROI analytics'],
  },
  {
    id: 'content-creation',
    title: 'AI Powered Content Creation',
    subtitle: 'AI assisted content creation tailored to your platforms and goals, generating high quality assets using SEO driven workflows.',
    description: 'A flexible, client driven content program where AI supports content generation across platforms, with output, formats, and volume aligned to your business needs.',
    icon: 'edit',
    deliverables: ['AI generated content assets', 'Platform specific content formats', 'Content planning & structuring', 'Performance insights & optimization', 'Ongoing content iteration'],
  },
  {
    id: 'thought-leadership',
    title: 'LinkedIn Thought Leadership Content Program',
    subtitle: 'Position yourself as an industry authority with strategic LinkedIn content and personal branding.',
    description: 'Comprehensive LinkedIn personal branding program that includes profile optimization, weekly post creation, comment engagement strategy, and article ghostwriting.',
    icon: 'linkedin',
    deliverables: ['20 LinkedIn posts per month (mix of formats)', '4 long form LinkedIn articles per month', 'Comment and engagement strategy', 'Connection growth tactics', 'Monthly analytics and optimization', 'Performance analytics report'],
  },
  {
    id: 'content-calendar',
    title: 'Multi Platform Content Calendar Management',
    subtitle: 'Never wonder "What should I post?" again with complete content calendar design and management.',
    description: 'We strategize, create, schedule, and manage engagement across all your social platforms. freeing you to focus on running your business.',
    icon: 'calendar',
    deliverables: ['40-60 social media posts across platforms', 'Custom graphics and visuals', 'Video script outlines', 'Hashtag strategies per post', 'Engagement response guidelines', 'Monthly performance analytics'],
  },
  {
    id: 'whatsapp-business',
    title: 'WhatsApp Business Messaging & Automation',
    subtitle: 'Reach customers where they are with automated WhatsApp marketing and conversational commerce.',
    description: 'Strategic WhatsApp Business marketing with AI powered automation, targeted broadcast campaigns, and conversational commerce for direct customer communication at scale.',
    icon: 'message',
    deliverables: ['4-8 WhatsApp broadcast campaigns', 'AI chatbot conversation flows', 'Automated response templates', 'Segmentation and targeting strategy', 'Rich media content creation', 'Monthly performance reports'],
  },
  {
    id: 'instagram-facebook-ads',
    title: 'AI Based Instagram & Facebook Advertising',
    subtitle: 'Full funnel paid social across Meta platforms, optimized monthly by AI for maximum ROAS.',
    description: 'A managed Meta advertising subscription using AI powered audience targeting, creative optimization, and conversion tracking to deliver compounding returns across Instagram and Facebook.',
    icon: 'ads',
    deliverables: ['Full Meta campaign setup & management', 'AI powered audience targeting', 'Creative asset production & testing', 'Weekly optimization & split testing', 'Conversion tracking & attribution', 'Monthly ROAS & performance report'],
  },
  {
    id: 'linkedin-targeting',
    title: 'AI Based LinkedIn Targeting & Lead Segmentation',
    subtitle: 'Precision prospecting powered by AI to identify, score, and segment high intent LinkedIn leads monthly.',
    description: 'Automated lead scoring and behavioral segmentation sourced from millions of LinkedIn profiles, synced into your CRM for action ready outreach campaigns.',
    icon: 'linkedin',
    deliverables: ['Qualified lead database (monthly refresh)', 'AI based lead scoring & segmentation', 'Behavioral targeting reports', 'CRM sync & pipeline integration', 'Monthly optimization playbooks', 'Performance analytics dashboards'],
  },
  {
    id: 'lead-generation',
    title: 'AI Based Lead Generation & Management',
    subtitle: 'Automated multi channel lead capture, scoring, and nurturing that never lets a prospect slip through.',
    description: 'Machine learning scores, nurtures, and routes leads across every touchpoint. ensuring revenue teams obsess over the right conversations with zero manual sorting.',
    icon: 'crm',
    deliverables: ['Multi channel lead capture setup', 'AI powered lead scoring & routing', 'Nurture campaign library', 'Pipeline management & optimization', 'Monthly performance reports', 'Conversion optimization recommendations'],
  },
  {
    id: 'social-media-reels',
    title: 'Social Media Reels & Short Form Video Production',
    subtitle: 'Scroll stopping Reels, Shorts, and TikToks produced monthly to fuel your social growth.',
    description: 'A monthly video production subscription delivering platform optimized short form content with trending formats, professional editing, and AI driven content strategy.',
    icon: 'video',
    deliverables: ['8-12 short form videos per month', 'Platform optimized formats (Reels, Shorts, TikTok)', 'Trending audio & format research', 'Professional editing & motion graphics', 'Caption & hashtag strategy', 'Monthly performance analytics'],
  },
  {
    id: 'ai-copywriting',
    title: 'AI Enhanced Copywriting & Messaging Strategy',
    subtitle: 'Conversion focused copy crafted monthly by AI and refined by human strategists.',
    description: 'A managed copywriting subscription that delivers landing pages, email sequences, ad copy, and brand messaging. all optimized through AI analysis and A/B testing insights.',
    icon: 'edit',
    deliverables: ['Monthly copy package (landing pages, emails, ads)', 'AI powered copy generation & optimization', 'A/B testing copy variants', 'Brand voice consistency audits', 'Conversion rate analysis', 'Monthly performance report'],
  },
  {
    id: 'funnel-tracking',
    title: 'Funnel Tracking & AI Driven Insights',
    subtitle: 'Real time funnel intelligence with AI powered CRO recommendations delivered monthly.',
    description: 'Continuous funnel analytics that stitch every touchpoint together, exposing friction, forecasting revenue, and recommending experiments that move the needle.',
    icon: 'analytics',
    deliverables: ['Full funnel tracking implementation', 'Real time analytics dashboard', 'AI powered CRO recommendations', 'Monthly optimization reports', 'A/B testing retrospectives', 'Revenue forecasting insights'],
  },
  {
    id: 'cybersecurity-monitoring',
    title: '24/7 Cybersecurity Monitoring & Threat Response',
    subtitle: 'Always on security surveillance with real time threat detection and incident response.',
    description: 'Enterprise grade cybersecurity monitoring subscription that provides continuous threat surveillance, vulnerability scanning, automated incident response, and monthly security posture reporting.',
    icon: 'security',
    deliverables: ['24/7 security monitoring & alerting', 'Real time threat detection & response', 'Monthly vulnerability scanning', 'Security posture reporting', 'Incident response playbooks', 'Compliance audit support'],
  },
  {
    id: 'weekly-reels',
    title: 'Weekly Social Media Reels & Shorts Production',
    subtitle: 'Consistent weekly Reels and Shorts to keep your brand visible and your audience engaged.',
    description: 'A dedicated weekly video production retainer delivering high quality short form content with rapid turnaround, trend integration, and ongoing creative direction.',
    icon: 'video',
    deliverables: ['4 short form videos per week', 'Rapid 48-hour turnaround', 'Trend integration & creative direction', 'Platform specific optimization', 'Branded templates & motion graphics', 'Weekly performance snapshots'],
  },
  {
    id: 'motion-graphics-series',
    title: 'Motion Graphics Explainer Video Series',
    subtitle: 'A monthly series of animated explainer videos that simplify your product and educate your audience.',
    description: 'Recurring motion graphics production delivering animated explainers, product walkthroughs, and educational content with consistent brand styling and AI accelerated workflows.',
    icon: 'video',
    deliverables: ['2-4 animated explainer videos per month', 'Custom 2D/3D animation', 'Professional voiceover integration', 'Sound design & music', 'Multi format exports', 'Monthly content strategy alignment'],
  },
  {
    id: 'conversion-copywriting',
    title: 'Conversion Copywriting Retainer',
    subtitle: 'Dedicated copywriting firepower focused on driving measurable conversions every month.',
    description: 'A monthly retainer providing continuous conversion focused copywriting for sales pages, funnels, email sequences, and ad campaigns. with data driven optimization and performance tracking.',
    icon: 'edit',
    deliverables: ['Monthly conversion copy package', 'Sales page & funnel copy', 'Email sequence writing & optimization', 'Ad copy library (Meta, LinkedIn, Google)', 'A/B test copy variants', 'Monthly conversion analytics report'],
  },
  {
    id: 'campaign-strategy',
    title: 'Campaign Strategy & Execution Support',
    subtitle: 'End to end campaign planning, creative direction, and execution management delivered monthly.',
    description: 'A strategic marketing support subscription providing campaign planning, creative direction, channel strategy, and execution oversight to ensure every initiative drives maximum ROI.',
    icon: 'strategy',
    deliverables: ['Monthly campaign strategy & planning', 'Creative brief development', 'Channel selection & budget allocation', 'Campaign execution oversight', 'Performance tracking & optimization', 'Monthly strategy review & pivots'],
  },
  {
    id: 'audience-engagement',
    title: 'Audience Engagement & Community Management',
    subtitle: 'Active community management and audience engagement to grow loyalty and brand advocacy.',
    description: 'A managed community engagement subscription handling social media interactions, comment responses, DM management, and community building. turning followers into brand advocates.',
    icon: 'community',
    deliverables: ['Daily social media engagement', 'Comment & DM response management', 'Community building strategy', 'User generated content curation', 'Brand sentiment monitoring', 'Monthly engagement analytics report'],
  },
];

export const serviceCategories = [
  {
    id: 'web-mobile',
    title: 'Web & Mobile Solutions',
    subtitle: 'AI crafted digital products and hosting built for scale.',
    description: 'Intelligent websites and mobile applications delivered with enterprise hosting, airtight security, and performance first engineering.',
    services: [
      {
        title: 'AI Based Website Building & Hosting',
        headline: 'Enterprise grade corporate experiences without the overhead.',
        summary: 'Responsive, SEO optimized websites with AI personalization, embedded chat, and premium managed hosting.',
        description: 'We pair strategic UX with AI assisted design to deliver websites that feel handcrafted yet scale like products. Every launch includes performance hardening, governance ready security, and meticulous QA.',
        timeline: '2–4 weeks for build, followed by managed hosting',
        features: ['Custom AI powered website', 'Domain + SSL configuration', 'Hosting + CDN setup', 'Performance optimization suite', 'SEO foundation and analytics integration'],
      },
      {
        title: 'AI Based Mobile Application Development',
        headline: 'Cross platform mobile apps with embedded intelligence.',
        summary: 'iOS and Android applications enhanced with recommendation engines, predictive analytics, and adaptive UX.',
        description: 'From concept to store submission, we design product ready mobile experiences that learn from user behavior. Expect native level performance, secure data pipelines, and continuous optimization.',
        timeline: '8–12 weeks build + 2 weeks for store approvals',
        features: ['Native mobile application bundle', 'App store submissions + assets', 'User documentation + training', 'Analytics dashboard integration', 'Maintenance + monitoring plan'],
      },
    ],
  },
  {
    id: 'ai-marketing',
    title: 'AI Marketing & Advertising',
    subtitle: 'Modern demand generation with precision targeting.',
    description: 'Full funnel growth programs across LinkedIn, paid social, and owned content, all orchestrated by AI signal loops.',
    services: [
      {
        title: 'AI Driven LinkedIn Advertising',
        headline: 'Predictive targeting for professional audiences.',
        summary: 'Adaptive campaigns that learn from engagement signals to maximize enterprise LinkedIn ROI.',
        description: 'We pair creative testing with machine led optimization so your ads reach the right decision makers at the right time, backed by transparent analytics.',
        timeline: '1 week setup, then ongoing monthly optimization',
        features: ['Campaign strategy + build', 'Ad creative library', 'Weekly performance reports', 'Optimization and ROI analysis', 'Audience insight package'],
      },
      {
        title: 'LinkedIn Revamp & AI Content Strategy',
        headline: 'Elevate executive presence with AI assisted storytelling.',
        summary: 'Profile optimization plus 20 bespoke AI guided posts every month to cement thought leadership.',
        description: 'We align tone, cadence, and creative direction with your brand voice, delivering a steady drumbeat of high performing content paired with analytics.',
        timeline: '1 week revamp + ongoing monthly publishing',
        features: ['Optimized LinkedIn presence', 'Editorial calendar', '20 custom posts per month', 'Engagement and growth reports', 'Strategy recommendations'],
      },
      {
        title: 'AI Based LinkedIn Targeting & Lead Segmentation',
        headline: 'Precision prospecting fed directly into your pipeline.',
        summary: 'Automated lead scoring and behavioral segmentation sourced from millions of LinkedIn profiles.',
        description: 'Our AI stack uncovers buying signals, prioritizes outreach, and syncs updated data into your CRM for action ready campaigns.',
        timeline: '2 weeks initial build + continuous monthly refresh',
        features: ['Qualified lead database', 'Segmentation + targeting reports', 'Monthly lead updates', 'Performance analytics dashboards', 'Optimization playbooks'],
      },
      {
        title: 'AI Assisted Cold Calling & Prospect Prioritization',
        headline: 'Human conversations informed by machine intelligence.',
        summary: 'Prioritized call lists, dynamic scripts, and coaching insights derived from call analytics.',
        description: 'We blend AI scoring with real world sales tactics to focus reps on the right accounts, backed by continuous testing and coaching feedback loops.',
        timeline: '1 week implementation + monthly optimization cycles',
        features: ['Prioritized prospect lists', 'Custom call scripts', 'Performance analytics dashboards', 'Training materials + playbooks', 'Follow up sequences'],
      },
      {
        title: 'AI Powered Content Creation & Marketing',
        headline: 'A predictable content engine across every channel.',
        summary: 'Ten high impact content assets per month with SEO alignment, channel distribution, and performance tracking.',
        description: 'We merge AI velocity with editorial craftsmanship to keep your pipeline fed with relevant articles, emails, and social narratives.',
        timeline: 'Monthly recurring cadence',
        features: ['Monthly content calendar', '10 SEO optimized long + short form assets', 'Social + email derivatives', 'Performance + SEO analysis', 'Iterative recommendations'],
      },
    ],
  },
  {
    id: 'crm-automation',
    title: 'CRM & Automation',
    subtitle: 'Revenue infrastructure engineered for scale.',
    description: 'Custom CRMs, analytics, and automation systems that give go to market teams precise control of every funnel stage.',
    services: [
      {
        title: 'AI Powered CRM Building & Integration',
        headline: 'A CRM that mirrors your exact operating model.',
        summary: 'Custom CRM development with AI analytics, workflow automation, and deep integrations.',
        description: 'We architect a CRM that feels bespoke to your teams, layering predictive intelligence and automation without breaking existing tooling.',
        timeline: '6–8 weeks build + 2 weeks testing + training',
        features: ['Custom CRM platform', 'Integration setup', 'Data migration playbooks', 'User training kit', 'Documentation + support plans'],
      },
      {
        title: 'CRM Performance Tracking & Analytics',
        headline: 'Clarity on every KPI in real time.',
        summary: 'Executive ready dashboards, predictive analytics, and automated reporting layered on your CRM data.',
        description: 'We turn scattered data into a unified intelligence layer that surfaces bottlenecks and growth levers instantly.',
        timeline: '2 weeks implementation + rolling enhancements',
        features: ['Analytics dashboard suite', 'Custom report templates', 'Monthly insight decks', 'Optimization recommendations', 'Enablement materials'],
      },
      {
        title: 'Custom Brand Tailored CRM Creation',
        headline: 'A white label CRM experience aligned with your brand.',
        summary: 'Fully bespoke CRM interfaces, workflows, and security built for franchised or multi brand organizations.',
        description: 'Beyond integrations, we give you a CRM that visually and functionally reflects your brand system, from UI tokens to governance rules.',
        timeline: '8–10 weeks build + 2 weeks brand QA',
        features: ['Fully branded CRM instance', 'Workflow + field setup', 'Brand integration package', 'User training program', 'Documentation + support suite'],
      },
      {
        title: 'AI Based Lead Generation & Management',
        headline: 'Automated lead engines with conversion intelligence.',
        summary: 'Machine learning scores, nurtures, and routes leads across every touchpoint.',
        description: 'We orchestrate multi channel capture, scoring, and follow up, ensuring revenue teams obsess over the right conversations.',
        timeline: '2 weeks setup + continuous optimization',
        features: ['Lead gen system configuration', 'Nurture campaign library', 'Pipeline + routing setup', 'Monthly performance reports', 'Optimization recommendations'],
      },
      {
        title: 'Funnel Tracking & AI Driven Insights',
        headline: 'Continuous funnel intelligence without dashboards sprawl.',
        summary: 'Real time funnel analytics, AI insights, and CRO recommendations delivered as actionable narratives.',
        description: 'We stitch every touchpoint together, exposing friction, forecasting revenue, and recommending experiments that move the needle.',
        timeline: '1 week setup + ongoing monthly analysis',
        features: ['Funnel tracking implementation', 'Analytics dashboard', 'Monthly optimization reports', 'Improvement recommendations', 'A/B testing retrospectives'],
      },
      {
        title: 'Complete Marketing Automation',
        headline: 'End to end automation architecture with AI personalization.',
        summary: 'Lead capture to customer retention orchestrated through intelligent workflows that scale effortlessly.',
        description: 'We evaluate your tech stack, design omnichannel workflows, and implement automation that adapts to every lifecycle stage.',
        timeline: '3–4 weeks implementation + managed optimization',
        features: ['Automation strategy deck', 'Workflow designs + builds', 'Campaign templates + assets', 'Monitoring dashboard', 'Training + support sessions'],
      },
    ],
  },
  {
    id: 'mediaworks',
    title: 'MediaWorks',
    subtitle: 'Video, branding, and creative services. all under one roof.',
    description: 'End to end media production, brand identity, creative strategy, and business communication services powered by AI workflows and human creative direction.',
    services: [
      {
        title: 'Professional Video Editing & Post Production',
        headline: 'Transform raw footage into cinematic marketing assets.',
        summary: 'Turn your existing video content into polished, professional marketing materials with AI enhanced editing.',
        description: 'Our AI enhanced editing suite combines color grading, audio enhancement, motion graphics, and creative direction to deliver broadcast quality videos that captivate audiences and drive conversions.',
        timeline: '5–10 business days from footage receipt',
        features: ['Professionally edited video (up to 5 minutes)', 'Color graded final output', 'Audio enhanced soundtrack', 'Multiple format exports (social, web, presentation)', 'Raw project files included'],
      },
      {
        title: 'Event Coverage & Documentary Filmmaking',
        headline: 'Capture your events with cinematic excellence.',
        summary: 'Professional event filming and documentary production that transforms conferences, product launches, and corporate events into compelling visual stories.',
        description: 'Multi camera event coverage with professional cinematography, real time highlight capture, interview recording, and full documentary editing. Perfect for internal communications, marketing campaigns, and stakeholder reporting.',
        timeline: 'Highlight reel within 48 hours, full edit within 2 weeks',
        features: ['Full event coverage (2-4 cameras)', 'Edited highlight reel (3-5 minutes)', 'Optional: Full length documentary cut', 'Interview segments and B roll footage', 'Social media clips package'],
      },
      {
        title: 'Client Testimonial Video Production',
        headline: 'Authentic customer stories that build unshakeable trust.',
        summary: 'Strategic testimonial videos that showcase real customer success stories with professional filming and editing.',
        description: 'We handle everything from interview scripting to filming, editing, and optimization. delivering social proof that converts prospects into customers. Includes AI assisted interview script development and behavioral psychology based storytelling.',
        timeline: '3–4 weeks from kickoff to final delivery',
        features: ['3-5 professionally produced testimonial videos', 'Full length interviews (2-3 minutes each)', 'Short form social cuts (15-30 seconds)', 'Transcripts and captions included', 'B roll and lifestyle footage'],
      },
      {
        title: 'Corporate Films & Brand Story Videos',
        headline: 'Cinematic storytelling that defines your brand legacy.',
        summary: 'Full service corporate film production from concept to final cut, designed to inspire stakeholders and captivate audiences.',
        description: 'We produce cinematic brand story videos, corporate documentaries, and company culture films with AI enhanced pre production planning, professional cinematography, and post production polish. Perfect for investor relations, recruitment, brand campaigns, and internal communications.',
        timeline: '3–6 weeks from concept to final delivery',
        features: ['Full corporate film production (up to 10 minutes)', 'Script development and storyboarding', 'Professional cinematography and direction', 'AI enhanced post production and color grading', 'Multiple format exports and distribution strategy'],
      },
      {
        title: 'Animation & Motion Graphics Production',
        headline: 'Complex ideas made simple through visual storytelling.',
        summary: 'Custom 2D/3D animation and motion graphics for explainer videos, product demos, social content, and brand storytelling.',
        description: 'From explainer animations to kinetic typography and 3D product visualizations, we bring concepts to life with AI accelerated production workflows. Every project includes storyboarding, voiceover direction, and multi format delivery.',
        timeline: '2–4 weeks depending on complexity and length',
        features: ['Custom 2D/3D animation production', 'Storyboard and concept art', 'Professional voiceover integration', 'Sound design and music scoring', 'Multi format exports (social, web, presentation)'],
      },
      {
        title: 'AI Assisted Video Production & Editing',
        headline: 'Engaging video content from concept to final cut.',
        summary: 'Professional video production including explainer videos, product demos, social content, and promotional videos with AI enhanced editing.',
        description: 'We produce compelling video content that tells your story effectively. From scripting to post production, we leverage AI tools for efficiency while maintaining creative quality and brand alignment.',
        timeline: '2–4 weeks depending on complexity + revisions',
        features: ['Final video in multiple formats', 'Source project files', 'Platform optimized versions', 'Subtitle files (SRT)', 'Thumbnail + preview assets'],
      },
      {
        title: 'Brand Voice & Messaging Architecture Development',
        headline: 'Define your brand voice once. use it everywhere.',
        summary: 'Establish a consistent, compelling brand voice that resonates across every customer touchpoint.',
        description: 'Our AI enhanced process combines behavioral psychology, competitive analysis, and audience research to create messaging frameworks that drive conversions. Includes comprehensive brand voice audit and target audience psychographic profiling.',
        timeline: '3–4 weeks from discovery to final delivery',
        features: ['Brand voice definition document', 'Messaging architecture framework', 'Tone of voice guidelines', 'Competitive positioning statement', 'Content style guide with 50+ examples'],
      },
      {
        title: 'Strategic Business Storytelling & Founder Narrative',
        headline: 'Turn your founder story into a competitive advantage.',
        summary: 'Craft compelling founder and business narratives that humanize your brand and build emotional connections.',
        description: 'Perfect for investor pitches, About pages, speaking engagements, and thought leadership platforms. Includes AI assisted narrative arc development and emotional connection point identification.',
        timeline: '2–3 weeks with 2 revision rounds',
        features: ['Comprehensive founder narrative document', 'Elevator pitch (30-second version)', 'Extended story (2-3 minute spoken/written)', 'About page copy', 'Speaking engagement talking points'],
      },
      {
        title: 'Creative Campaign Ideation & Problem Solving Workshop',
        headline: 'Break through creative blocks with AI powered ideation.',
        summary: 'Intensive creative workshop that combines AI assisted ideation, behavioral psychology, and strategic thinking.',
        description: 'Walk away with campaign concepts, messaging hooks, and execution roadmaps. Includes AI powered ideation session, strategic problem framing, and multiple creative concept development.',
        timeline: 'Scheduled within 2 weeks, deliverables within 1 week post workshop',
        features: ['Workshop recording and transcript', '10-15 campaign concept frameworks', '20+ messaging hooks and value propositions', 'Content theme recommendations', 'Execution priority matrix'],
      },
      {
        title: 'Brand Naming & Thematic Direction',
        headline: 'Names that stick, themes that resonate.',
        summary: 'Strategic brand and product naming services powered by linguistic analysis, trademark screening, and cultural relevance testing.',
        description: 'We don\'t just create names. we develop entire thematic directions that inform all brand expressions. Includes AI assisted name generation, linguistic and phonetic analysis, and cultural appropriateness testing.',
        timeline: '3–4 weeks from brief to final recommendations',
        features: ['50 shortlisted name options with rationales', '10 finalist names with full analysis', '3 recommended names with positioning statements', 'Domain and social handle availability report', 'Trademark screening summary'],
      },
      {
        title: 'Voiceover Script Development & Audio Direction',
        headline: 'Scripts that sound perfect when spoken aloud.',
        summary: 'Professional voiceover scriptwriting optimized for clarity, emotional impact, and natural delivery.',
        description: 'Includes voice tone direction, pacing guidelines, and audio visual storytelling alignment for videos, podcasts, and audio content. AI assisted scriptwriting for spoken delivery with phonetic optimization.',
        timeline: '3–5 business days per script',
        features: ['Professionally formatted voiceover scripts', 'Voice tone and style direction', 'Pacing and pronunciation guides', 'Alternative version options', 'Talent briefing document'],
      },
      {
        title: 'Complete Brand Identity & Positioning Package',
        headline: 'Your entire brand system designed from the ground up.',
        summary: 'End to end brand identity creation including logo, visual system, messaging architecture, positioning, and comprehensive brand guidelines.',
        description: 'We architect cohesive brand identities that resonate across every channel. From visual design tokens to messaging frameworks, every element is strategically crafted to differentiate your business and build lasting recognition.',
        timeline: '4–6 weeks for complete brand system delivery',
        features: ['Logo suite in all formats', 'Complete visual identity system', 'Brand messaging and positioning framework', 'Comprehensive brand guidelines document', 'Application templates and usage examples'],
      },
      {
        title: 'AI Enhanced Graphics Design',
        headline: 'Stunning visuals for every marketing touchpoint.',
        summary: 'Custom graphics, social media assets, infographics, and presentation decks designed with brand consistency.',
        description: 'We blend AI powered design tools with creative expertise to deliver high impact visuals that resonate with your audience. Every asset is optimized for its intended platform and purpose.',
        timeline: '1–2 weeks for initial package + ongoing monthly support',
        features: ['Custom graphics package', 'Source files + export formats', 'Brand aligned templates', 'Usage guidelines', 'Asset organization system'],
      },
      {
        title: 'Professional Logo Design & Brand Identity',
        headline: 'Memorable logos that define your brand.',
        summary: 'Complete logo design with multiple concepts, refinements, and full brand identity package including color palettes and typography.',
        description: 'We create distinctive logos through a collaborative process that captures your brand essence. Each project includes comprehensive brand guidelines to ensure consistent application across all channels.',
        timeline: '2–3 weeks for complete brand identity package',
        features: ['Final logo in all formats (AI, EPS, SVG, PNG)', 'Brand style guide document', 'Color palette specifications', 'Typography guidelines', 'Application examples + mockups'],
      },
      {
        title: 'Company/Service Profile Design & Writing',
        headline: 'Professional company profiles that win business.',
        summary: 'Comprehensive company or service profile documents that position your business for RFPs, partnership opportunities, and corporate sales.',
        description: 'Combines strategic copywriting with professional design for maximum impact. Includes strategic company positioning, service/capability descriptions, and case study integration.',
        timeline: '2–3 weeks from briefing to final delivery',
        features: ['8-16 page company profile document', 'Executive summary (1-page)', 'Service overview sections', 'Case studies and client success stories', 'Team and capability highlights'],
      },
      {
        title: 'Pitch Decks & Corporate Presentations',
        headline: 'Presentations that close deals and win funding.',
        summary: 'Investor ready pitch decks and corporate presentations with strategic narrative design, data visualization, and premium visual styling.',
        description: 'We combine storytelling frameworks with AI enhanced design to build presentations that command attention. Whether for fundraising, sales enablement, or board reporting, every slide is engineered for maximum impact and clarity.',
        timeline: '1–2 weeks from brief to final delivery',
        features: ['Custom designed pitch deck (15-30 slides)', 'Strategic narrative and story arc', 'Data visualization and infographics', 'Speaker notes and talking points', 'Editable source files (PowerPoint/Keynote/Google Slides)'],
      },
      {
        title: 'Marketing Collateral & Campaign Artwork',
        headline: 'Every touchpoint designed for conversion.',
        summary: 'Professional marketing materials including brochures, flyers, social media kits, email templates, and campaign assets.',
        description: 'We design brand consistent marketing collateral that drives action across print and digital channels. AI powered layout optimization ensures every piece is visually compelling and conversion focused.',
        timeline: '1–2 weeks per collateral package',
        features: ['Brochure and flyer design', 'Social media asset kits', 'Email marketing templates', 'Trade show and event materials', 'Digital ad creative packages'],
      },
    ],
  },
  {
    id: 'security-support',
    title: 'Security & Support',
    subtitle: 'Operational resilience with proactive protection.',
    description: 'From domain infrastructure to enterprise cybersecurity, we harden every layer with monitored safeguards.',
    services: [
      {
        title: 'Custom Email Domain Setup',
        headline: 'Professional mail infrastructure with enterprise safeguards.',
        summary: 'Secure domain configuration, compliance ready policies, and seamless device rollouts.',
        description: 'We configure DNS, identity, and mobile device policies so your team enjoys frictionless collaboration with ironclad protections.',
        timeline: '1–2 weeks setup + annual managed maintenance',
        features: ['Custom email domain + DNS configuration', 'Security + compliance policy setup', 'User account provisioning', 'Mobile + desktop setup guides', 'Backup + documentation package'],
      },
      {
        title: 'Cybersecurity & Data Protection',
        headline: 'Defense in depth with proactive surveillance.',
        summary: 'Security audits, encryption, firewall hardening, and ongoing threat monitoring orchestrated by specialists.',
        description: 'We evaluate posture, deploy modern tooling, and maintain 24/7 vigilance so your sensitive data stays uncompromised.',
        timeline: '2–3 weeks initial hardening + ongoing monitoring',
        features: ['Security assessment + roadmap', 'Protection system configuration', 'Monitoring dashboards', 'Monthly security reports', 'Incident response playbooks + training'],
      },
    ],
  },
];

export const testimonials = [
  { quote: 'Our demand engine was transformed in six weeks. Pipeline increased 3.1× and our team closed one of our biggest enterprise deals right after the system went live.', role: 'COO, Industrial Manufacturing', industry: 'Manufacturing (B2B)' },
  { quote: 'The CRM and automation setup restructured our whole funnel. Our sales cycle became 42% faster and forecasting became far more accurate. The dashboards are world class.', role: 'VP Growth, SaaS Platform', industry: 'SaaS (Technology)' },
  { quote: 'We needed strong data protection. PropelusAI delivered a security setup that resulted in zero critical incidents over the last year. Their response system is incredible.', role: 'Head of IT, Healthcare Organization', industry: 'Healthcare (Medical Services)' },
  { quote: 'The content engine they built has taken our brand to a new level. Organic traffic grew 4× in 120 days and we\'re now getting daily inbound leads from our content alone.', role: 'Director of Marketing, Education Company', industry: 'Education (E Learning Brand)' },
  { quote: 'Our company was drowning in manual work. PropelusAI automated our entire workflow and increased our operational efficiency by 78%. Easily the best investment we made.', role: 'Managing Partner, Consulting Firm', industry: 'Consulting (Professional Services)' },
  { quote: 'Our mobile app went from outdated to exceptional. Engagement increased by 70% and retention jumped significantly thanks to the AI powered personalization.', role: 'Founder, FinTech Startup', industry: 'Finance (FinTech)' },
  { quote: 'The LinkedIn strategy they implemented generated 2,400+ qualified connections in 90 days. Our inbound meeting rate tripled and we\'re now closing deals directly from LinkedIn outreach.', role: 'CEO, B2B Marketing Agency', industry: 'Marketing (Agency)' },
  { quote: 'PropelusAI rebuilt our entire website from the ground up. Load times dropped by 65%, conversions increased by 2.3×, and our bounce rate is now under 20%. The design is stunning.', role: 'CMO, E Commerce Brand', industry: 'Retail (E Commerce)' },
  { quote: 'Their Meta ads strategy completely changed our acquisition game. ROAS went from 1.8× to 5.2× in just two months. The targeting and creative optimization is next level.', role: 'Growth Lead, Consumer App', industry: 'Technology (Mobile Apps)' },
  { quote: 'We were skeptical about AI automation, but PropelusAI proved us wrong. They automated our customer support, inventory management, and reporting. We saved 40+ hours per week.', role: 'Operations Director, Logistics Company', industry: 'Logistics (Supply Chain)' },
  { quote: 'The AI chatbot they built for our website handles 80% of customer inquiries automatically. Customer satisfaction scores went up and our support team can now focus on complex issues.', role: 'Customer Success Manager, SaaS Startup', industry: 'SaaS (Customer Support)' },
  { quote: 'PropelusAI designed and launched our MVP in record time. The product was so polished that we secured seed funding within 3 months of launch. Their technical expertise is unmatched.', role: 'Founder, Tech Startup', industry: 'Technology (Startup)' },
  { quote: 'The email marketing automation they set up generates $50K+ in monthly recurring revenue on autopilot. Segmentation, personalization, and timing are all AI optimized. Game changer.', role: 'Marketing Director, Online Education', industry: 'Education (Online Courses)' },
  { quote: 'Our data was a mess before PropelusAI. They built a centralized analytics dashboard that gives us real time insights across all channels. Decision making is now data driven and fast.', role: 'VP of Analytics, Media Company', industry: 'Media (Digital Publishing)' },
  { quote: 'The AI powered recommendation engine increased our average order value by 45%. Customers are discovering products they love and our repeat purchase rate has never been higher.', role: 'Head of Product, Retail Brand', industry: 'Retail (Fashion)' },
  { quote: 'PropelusAI transformed our lead qualification process. The AI scoring system identifies high intent prospects with 92% accuracy. Our sales team is closing deals faster than ever.', role: 'Sales Director, Enterprise Software', industry: 'SaaS (Enterprise)' },
];

export const faqCategories = [
  {
    title: 'General Questions',
    items: [
      { q: "What's the difference between your Products and Services?", a: 'Services are one time, upfront engagements, while Products are subscription based with recurring monthly access.' },
      { q: 'Which industries do you work with?', a: 'We offer solutions and business consulting across all industries. Whether you are an individual professional or a large company, our expertise is tailored to drive your success.' },
      { q: 'Do you work globally?', a: 'Yes, we support clients globally.' },
      { q: 'What makes PropelusAI different from other agencies?', a: 'AI native engineering, outcome focused execution, enterprise grade delivery, transparent pricing, global presence, predictive analytics, high quality automation, and confidential client work approach.' },
    ],
  },
  {
    title: 'Services Questions (One Time Builds)',
    items: [
      { q: 'How long does a website project take?', a: 'Most AI powered websites take 2–4 weeks depending on the number of pages and complexity.' },
      { q: 'How long does a mobile app take?', a: 'Timelines vary based on requirements, features, and complexity. Typical builds take 8–12 weeks plus 2 weeks for store approvals.' },
      { q: 'Can I request changes after delivery?', a: 'Yes, every service includes post launch support for minor fixes, plus optional add ons for extended maintenance.' },
      { q: 'Do you build custom CRMs?', a: 'Yes, we build fully custom CRMs as one time projects tailored to your brand, as well as white label and non white label solutions based on your requirements and budget.' },
      { q: 'Do you support integrations?', a: 'Yes, we support all types of integrations.' },
      { q: 'What if I already have a website or CRM?', a: 'We can upgrade, redesign, rebuild, migrate, or integrate AI features into your existing system.' },
    ],
  },
  {
    title: 'Product Questions (Monthly & Quarterly Plans)',
    items: [
      { q: 'How do your subscription Products work?', a: 'Each Product (LinkedIn ads, lead segmentation, CRM hosting, content engine, cold calling, etc.) is a monthly or quarterly recurring plan that includes ongoing optimization, analytics, reporting, and dedicated support.' },
      { q: 'Do subscriptions include reports?', a: 'Yes, all Product plans include weekly or monthly reports depending on the offering.' },
      { q: 'Can I upgrade or downgrade my subscription?', a: 'Yes, you can adjust your plan at the end of each billing cycle.' },
      { q: 'Do you manage LinkedIn & Meta ads fully?', a: 'Yes, we handle creative, targeting, optimization, reporting, testing, automating and funnel tracking. Ads spend is billed directly to your ad platform; our fee covers management & optimization.' },
    ],
  },
  {
    title: 'Pricing Questions',
    items: [
      { q: 'Do you offer refunds?', a: 'Only in rare cases where no work or deliverables have been started. Once production begins, refunds are not applicable due to resource commitment.' },
      { q: 'Do you offer bundle pricing?', a: 'Yes, combining multiple services or products may reduce overall cost. E.g., pairing website + CRM + automation.' },
    ],
  },
  {
    title: 'Support & Maintenance',
    items: [
      { q: 'Do Services include support?', a: 'Yes, every one time service includes a free support window after launch.' },
      { q: 'Can I purchase extended support?', a: 'Yes, we offer maintenance plans, dedicated success managers, and priority support add ons.' },
    ],
  },
];

export const blogPosts = [
  {
    slug: 'mock-demo-bookings',
    title: 'Why Most Businesses Lose 30–40% of Their Demo Bookings (And How to Fix It)',
    excerpt: 'Most businesses spend thousands on ads, outreach, and lead generation. only to watch 30–40% of booked demos never show up. Learn how to fix this silent revenue killer.',
    category: 'Sales',
    date: 'December 20, 2024',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop',
    featured: true,
    content: `Most businesses spend thousands on ads, outreach, and lead generation. only to watch 30–40% of booked demos never show up. This is a silent revenue killer that drains your pipeline and wastes your sales team's time.

The demo no show problem isn't just about forgetful prospects. It's a systemic issue rooted in poor follow up timing, lack of personalization, and missing pre qualification steps. When a prospect books a demo, they're expressing interest. but that interest has a half life.

Here's what typically goes wrong: The gap between booking and the actual demo is too long. There's no confirmation or reminder sequence. The prospect doesn't feel invested in the outcome. There's no pre demo value delivery.

The fix involves implementing an AI powered engagement sequence that activates the moment a demo is booked. This includes immediate confirmation with a personalized video or message, strategic reminders at 24 hours and 1 hour before, pre demo content that builds anticipation, and a frictionless rescheduling option.

Companies that implement these systems see demo show rates improve by 40–60%, directly impacting pipeline velocity and revenue.

At PropelusAI, we build these automated engagement systems as part of our marketing automation and CRM solutions. The result is a predictable, high-converting demo pipeline that turns interest into revenue.`,
  },
  {
    slug: 'mock-lead-followup',
    title: 'Why 80% of B2B Leads Never Get Followed Up (And How AI Fixes It)',
    excerpt: 'You spent thousands on ads. Your website is converting. Leads are coming in. But 80% of your leads never get proper follow up. Discover why and how AI fixes it.',
    category: 'Lead Generation',
    date: 'December 17, 2024',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop',
    featured: true,
    content: `You spent thousands on ads. Your website is converting. Leads are coming in. But here's the uncomfortable truth: 80% of B2B leads never get proper follow up. The money you invested in generating those leads? Largely wasted.

This isn't a people problem. it's a systems problem. Most sales teams are overwhelmed with manual tasks, lack lead prioritization tools, and don't have the bandwidth to follow up with every lead within the critical first hour.

Research shows that responding to a lead within 5 minutes makes you 21× more likely to qualify them. Yet the average B2B response time is 42 hours. That's not a gap. it's a canyon.

AI changes this equation entirely. Here's how:

Instant Lead Scoring: AI analyzes behavioral signals, firmographic data, and engagement patterns to score leads in real time, ensuring your team focuses on the highest-intent prospects first.

Automated Initial Outreach: While your team sleeps, AI powered sequences engage leads with personalized emails, SMS, or LinkedIn messages within minutes of their inquiry.

Smart Routing: AI routes leads to the right rep based on territory, expertise, product interest, and availability. eliminating the manual sorting that causes delays.

Predictive Follow-Up: AI determines the optimal time, channel, and message for follow up based on historical conversion data.

At PropelusAI, our AI powered CRM and lead management systems ensure zero leads fall through the cracks. Every inquiry gets an immediate, intelligent response.`,
  },
];

export const values = [
  { title: 'Precision in Everything', description: 'Every project begins with intention. from design tokens to workflow architecture. No shortcuts, no guesswork.' },
  { title: 'Product Grade Engineering', description: 'We deliver digital experiences that match the quality of world class software platforms. Dual theme design, clean architecture, and enterprise ready execution come standard.' },
  { title: 'AI at the Core', description: "AI isn't a feature. it's embedded across research, segmentation, automation, analytics, content, and system intelligence." },
  { title: 'Outcome First Thinking', description: 'Everything we build must drive a measurable business result: more revenue, more efficiency, more opportunities, more clarity.' },
];

export const footerLinks = {
  products: [
    { label: 'LinkedIn Ads', href: '/products' },
    { label: 'LinkedIn Content Engine', href: '/products' },
    { label: 'Lead Generation Engine', href: '/products' },
    { label: 'CRM Subscription', href: '/products' },
    { label: 'Meta Ads Management', href: '/products' },
    { label: 'Performance Dashboards', href: '/products' },
  ],
  services: [
    { label: 'SaaS Development', href: '/services/saas-development' },
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
