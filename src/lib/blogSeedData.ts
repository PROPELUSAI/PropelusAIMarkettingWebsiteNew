/**
 * blogSeedData.ts — Six seed blog posts targeting high-value SEO keywords.
 * Used as fallback content and for database seeding via scripts/seed-blogs.ts.
 */

export interface SeedBlogPost {
  title: string;
  slug: string;
  subtitle: string;
  category: string;
  tags: string[];
  featured_image: string;
  meta_description: string;
  content_html: string;
  publish_date: string;
}

export const seedBlogPosts: SeedBlogPost[] = [
  {
    title: 'How Much Does AI Website Development Cost in 2026',
    slug: 'ai-website-development-cost-2026',
    subtitle: 'A practical breakdown of what drives website development pricing and how to budget for an AI powered site.',
    category: 'Development',
    tags: ['website development', 'pricing', 'AI', 'budgeting'],
    featured_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop',
    meta_description: 'AI website development costs range from $2,500 to $50,000+ depending on scope. Learn what drives pricing, what to expect at each tier, and how to budget effectively.',
    publish_date: '2026-02-10T10:00:00Z',
    content_html: `
<p>If you are researching AI website development costs, you have probably seen numbers ranging from $500 to $100,000. That range is not helpful. According to <a href="https://www.gartner.com/en/digital-markets/insights/how-much-does-a-website-cost" target="_blank" rel="noopener noreferrer">Gartner's digital markets research</a>, the average business website costs between $5,000 and $50,000 depending on complexity. Here is a realistic breakdown of what determines pricing and what you should expect at each budget level.</p>

<h2>What Drives Website Development Cost</h2>

<p>Five factors determine the final price of any website project: page count, design complexity, backend functionality, AI feature integration, and ongoing maintenance requirements.</p>

<p>A five page marketing site with a contact form is fundamentally different from a 40 page platform with user authentication, a CRM integration, and AI powered personalization. The first might take two weeks. The second takes two months. Pricing reflects that difference in engineering hours.</p>

<h2>Pricing Tiers for AI Websites in 2026</h2>

<h3>$2,500 to $5,000: Foundation Tier</h3>
<p>At this level, you get a professionally designed marketing website with 5 to 10 pages, mobile responsiveness, basic SEO setup, and a contact form. AI features are limited, typically an AI chatbot integration or basic analytics. This works well for service businesses, consultants, and early stage startups that need a professional web presence fast. Typical timeline: 2 to 3 weeks.</p>

<h3>$5,000 to $15,000: Growth Tier</h3>
<p>This is where most mid market companies land. You get 10 to 30 pages, custom design (not templates), CMS integration for content management, AI powered search, personalization elements, contact forms with CRM sync, and analytics dashboards. The site is built on modern frameworks like Next.js or React with server side rendering for SEO performance. Timeline: 3 to 6 weeks.</p>

<h3>$15,000 to $50,000+: Enterprise Tier</h3>
<p>Enterprise builds include everything above plus custom backend architecture, user authentication systems, API integrations with existing tools (Salesforce, HubSpot, custom CRMs), AI recommendation engines, multi language support, advanced security hardening, and load testing for high traffic. These projects typically involve a dedicated team of 3 to 5 engineers. Timeline: 6 to 12 weeks.</p>

<h2>Hidden Costs to Plan For</h2>

<p>Budget for these items beyond the initial build: domain registration ($10 to $50/year), SSL certificates (often free with modern providers), content creation ($1,000 to $5,000 if you need professional copywriting), ongoing maintenance ($200 to $1,000/month), and AI API costs if you are running inference heavy features like real time personalization.</p>

<h2>How to Get an Accurate Quote</h2>

<p>The best approach is to prepare a clear scope document before talking to any agency. List your pages, describe the functionality you need, identify your must have integrations, and set a realistic timeline. Agencies that give you a price without asking detailed questions are the ones that will surprise you with change orders later.</p>

<p>At <a href="/services/ai-based-website-building">PropelusAI</a>, our website development projects start from $2,500 and include a detailed scope document before any work begins. We break every project into weekly milestones so you know exactly where your budget is going. <a href="/contact">Get a custom quote</a> based on your specific requirements.</p>
`,
  },
  {
    title: 'Custom CRM vs Off the Shelf: Which Is Right for Your Business',
    slug: 'custom-crm-vs-off-the-shelf',
    subtitle: 'A comparison of custom built CRM systems versus platforms like Salesforce and HubSpot, with cost and feature analysis.',
    category: 'Technology',
    tags: ['CRM', 'custom software', 'Salesforce', 'HubSpot', 'comparison'],
    featured_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop',
    meta_description: 'Custom CRM vs off the shelf CRM: compare costs, features, timelines, and long term ROI. Learn which approach fits your business size and growth stage.',
    publish_date: '2026-02-17T10:00:00Z',
    content_html: `
<p>The CRM decision is one of the most consequential technology choices a growing business makes. <a href="https://www.forrester.com/research/crm/" target="_blank" rel="noopener noreferrer">Forrester estimates</a> that companies spend an average of $150,000 annually on CRM systems when including licensing, customization, and maintenance. Get it wrong and your sales team fights the tool instead of using it. Get it right and you have a system that compounds value every quarter. Here is an honest comparison of building custom versus buying off the shelf.</p>

<h2>Off the Shelf CRM: When It Makes Sense</h2>

<p>Platforms like Salesforce, HubSpot, and Zoho CRM work well for companies with standard sales processes. If your pipeline follows a predictable pattern where a lead comes in, gets qualified, moves through stages, then closes or drops, an off the shelf CRM handles this out of the box.</p>

<p>The upside is speed to deploy. You can have HubSpot running in a week. Salesforce takes longer but offers deep configurability. Zoho sits in between with reasonable pricing for smaller teams. All three have ecosystems of integrations, training resources, and community support.</p>

<p>The downside is cost at scale and forced compromise. Salesforce licensing for a 50 person sales team runs $75,000 to $150,000 per year depending on tier. HubSpot is cheaper but locks advanced features behind enterprise pricing. And every off the shelf CRM forces you to adapt your process to their data model rather than the other way around.</p>

<h2>Custom CRM: When It Makes Sense</h2>

<p>A custom CRM is worth the investment when your business process does not fit standard templates. Industries like manufacturing, logistics, healthcare, and financial services often have workflows that no commercial CRM handles well without extensive (and expensive) customization.</p>

<p>Custom CRMs also make sense when you need deep integration with proprietary systems, when data ownership and security requirements rule out cloud vendors, or when per seat licensing costs would exceed the build cost within 18 to 24 months.</p>

<p>The typical custom CRM build costs $8,000 to $40,000 depending on complexity, with a timeline of 6 to 12 weeks. Annual maintenance runs 15 to 20 percent of the initial build cost. Compare that to $150,000/year in Salesforce licensing and the math often favors custom within two years.</p>

<h2>Decision Framework</h2>

<p>Ask yourself three questions. First, does your sales process match the default workflow of a major CRM? If yes, go off the shelf. Second, do you have more than 20 users who need CRM access? Per-seat costs add up fast and may justify a custom build. Third, do you need integrations with proprietary systems? Custom integration with off the shelf CRMs often costs more than building the whole system from scratch.</p>

<h2>The Hybrid Approach</h2>

<p>Some companies start with an off the shelf CRM and layer custom functionality on top via APIs. This gets you running quickly while building toward a system that truly fits. At <a href="/services/ai-powered-crm-building-and-integration">PropelusAI</a>, we build custom CRMs and also offer a <a href="/products/ai-powered-crm-analytics-and-lead-management">managed CRM subscription</a> that includes AI powered lead scoring and pipeline analytics. Both options start with a discovery call where we map your process before recommending an approach. <a href="/contact">Schedule a consultation</a> to discuss which path fits your business.</p>
`,
  },
  {
    title: 'AI Marketing Automation Guide for B2B Companies',
    slug: 'ai-marketing-automation-guide-b2b',
    subtitle: 'How B2B companies can implement AI marketing automation to reduce manual work and improve lead conversion.',
    category: 'Marketing',
    tags: ['marketing automation', 'B2B', 'AI', 'lead generation', 'email marketing'],
    featured_image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=630&fit=crop',
    meta_description: 'Complete guide to AI marketing automation for B2B companies. Learn implementation steps, tool selection, ROI measurement, and common mistakes to avoid.',
    publish_date: '2026-02-24T10:00:00Z',
    content_html: `
<p>Marketing automation has been around for a decade, but AI has changed what it can actually accomplish. A <a href="https://www.hubspot.com/state-of-marketing" target="_blank" rel="noopener noreferrer">2025 HubSpot study</a> found that companies using AI driven marketing automation see 45% higher lead to customer conversion rates. Instead of just sending emails on a schedule, modern automation systems score leads in real time, personalize content dynamically, and predict which prospects are most likely to convert. Here is how B2B companies should approach it in 2026.</p>

<h2>What AI Marketing Automation Actually Does</h2>

<p>At its core, marketing automation handles repetitive tasks: sending email sequences, scoring leads based on behavior, routing qualified leads to sales, and tracking campaign performance. AI adds a layer of intelligence on top. Instead of scoring leads with static rules (visited pricing page = +10 points), AI models analyze patterns across hundreds of signals to predict purchase intent with significantly higher accuracy.</p>

<p>The practical impact: your sales team spends time on prospects who are actually ready to buy instead of chasing every form submission equally.</p>

<h2>Implementation Steps</h2>

<h3>Step 1: Audit Your Current Funnel</h3>
<p>Before implementing any automation, document your existing lead flow from first touch to closed deal. Where are leads entering? What happens after a form submission? How long does it take for sales to follow up? Where do leads drop off? This audit reveals the specific bottlenecks automation should fix.</p>

<h3>Step 2: Choose Your Automation Stack</h3>
<p>For B2B, the primary options are HubSpot, Marketo, Pardot (Salesforce), ActiveCampaign, and custom built systems. HubSpot is the most accessible for teams under 50. Marketo handles complex enterprise workflows. Custom systems make sense when you need deep integration with proprietary tools or when licensing costs exceed your budget.</p>

<h3>Step 3: Build Your Lead Scoring Model</h3>
<p>Start with a simple scoring model based on two dimensions: demographic fit (company size, industry, role) and behavioral engagement (pages visited, content downloaded, emails opened). Set a threshold score that triggers a handoff to sales. AI models can refine this over time by analyzing which scored leads actually converted.</p>

<h3>Step 4: Create Automated Sequences</h3>
<p>Build sequences for each stage of your funnel. Welcome sequence for new leads (3 to 5 emails over 2 weeks). Nurture sequence for leads that are not sales ready (educational content, case studies). Re engagement sequence for leads that go cold (sent at 30, 60, and 90 days of inactivity). Each sequence should have clear exit criteria. When the lead takes a qualifying action, they exit the nurture and enter the sales pipeline.</p>

<h3>Step 5: Measure and Optimize</h3>
<p>Track three metrics obsessively: marketing qualified lead (MQL) to sales qualified lead (SQL) conversion rate, average time from first touch to closed deal, and revenue attributed to automated sequences. If MQL to SQL conversion is below 20 percent, your scoring model needs work. If time to close is not improving, your nurture content is not moving prospects forward.</p>

<h2>Common Mistakes</h2>

<p>The biggest mistake is automating before you have a working manual process. If your sales team cannot convert leads with personal outreach, automation will not fix that. It will just scale the failure faster. Fix your messaging and offer first, then automate the delivery.</p>

<p>At <a href="/services/marketing-automation-and-workflow-implementation">PropelusAI</a>, we implement marketing automation systems that integrate with your existing CRM and sales process. We also offer an <a href="/products/ai-powered-email-marketing-and-automation">AI email marketing subscription</a> for teams that want ongoing optimization without managing the system themselves. <a href="/contact">Start with a free consultation</a> to map your automation roadmap.</p>
`,
  },
  {
    title: 'LinkedIn Ads ROI for B2B: How to Measure and Improve Performance',
    slug: 'linkedin-ads-roi-b2b-guide',
    subtitle: 'Practical framework for measuring LinkedIn advertising ROI and specific tactics to improve B2B campaign performance.',
    category: 'Marketing',
    tags: ['LinkedIn ads', 'B2B', 'ROI', 'advertising', 'lead generation'],
    featured_image: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=1200&h=630&fit=crop',
    meta_description: 'Learn how to measure LinkedIn ads ROI for B2B companies. Includes benchmark CPL data, attribution models, and 7 tactics to improve campaign performance.',
    publish_date: '2026-03-03T10:00:00Z',
    content_html: `
<p>LinkedIn advertising is the most effective paid channel for B2B lead generation, but it is also the most expensive. According to <a href="https://business.linkedin.com/marketing-solutions" target="_blank" rel="noopener noreferrer">LinkedIn's own marketing data</a>, the platform reaches 950 million professionals across 200 countries. Average cost per click runs $5 to $12, compared to $1 to $3 on Google and under $1 on Meta for most B2B audiences. The question is not whether LinkedIn ads work. It is whether they work well enough to justify the premium. Here is how to measure that and improve it.</p>

<h2>LinkedIn Ads Benchmarks for B2B</h2>

<p>Before optimizing, you need to know what good looks like. Based on aggregate data from B2B campaigns across SaaS, professional services, and technology sectors:</p>

<p>Click through rate (CTR): 0.4 to 0.7 percent for sponsored content. Above 0.7 percent is strong. Below 0.3 percent means your targeting or creative needs work.</p>

<p>Cost per lead (CPL): $30 to $150 depending on your offer and audience specificity. A whitepaper download costs less than a demo request. Enterprise targeted campaigns cost more than SMB targeted ones.</p>

<p>Lead to opportunity conversion: 10 to 25 percent of LinkedIn leads should convert to qualified opportunities if your targeting and offer are aligned.</p>

<h2>How to Calculate True ROI</h2>

<p>The formula is straightforward but most companies skip steps. LinkedIn ROI = (Revenue from LinkedIn sourced deals - Total LinkedIn spend) / Total LinkedIn spend x 100.</p>

<p>The hard part is attribution. A prospect might click your LinkedIn ad, visit your site, leave, come back via Google two weeks later, and then fill out a contact form. Multi touch attribution models give LinkedIn credit for the initial awareness touch. Last touch models give it zero credit. The truth is somewhere in between. Use a weighted attribution model that gives 40 percent credit to the first touch and distributes the rest across subsequent interactions.</p>

<h2>7 Tactics to Improve LinkedIn Ad Performance</h2>

<p>1. Narrow your audience ruthlessly. LinkedIn targeting is precise, so use it. Target by job title, company size, industry, and seniority level. Broad audiences waste budget on people who will never buy.</p>

<p>2. Test single-image ads against carousel formats. Carousels consistently outperform single images for B2B content because they allow you to tell a story in multiple frames.</p>

<p>3. Use lead gen forms instead of landing pages. LinkedIn lead gen forms auto-fill user data, reducing friction. Conversion rates are typically 2 to 3 times higher than landing page forms.</p>

<p>4. Retarget website visitors with specific offers. Someone who visited your pricing page should see a different ad than someone who read a blog post. Create audience segments based on page level intent signals.</p>

<p>5. Rotate creative every 2 to 3 weeks. LinkedIn ad fatigue sets in faster than other platforms because audience sizes are smaller. Fresh creative maintains CTR and reduces cost per click.</p>

<p>6. Align your offer to the buying stage. Awareness stage: educational content. Consideration stage: case studies and comparison guides. Decision stage: demo requests and free consultations.</p>

<p>7. Track offline conversions. Most B2B deals close after sales conversations, not online. Upload your CRM deal data back to LinkedIn Campaign Manager to measure true conversion rates.</p>

<p>Our <a href="/products/ai-driven-linkedin-advertising">AI driven LinkedIn advertising subscription</a> handles all of this including targeting, creative rotation, bidding optimization, and monthly performance reporting. We also offer <a href="/products/ai-based-linkedin-targeting-and-lead-segmentation">LinkedIn lead segmentation</a> for companies that want to build qualified prospect lists without running ads. <a href="/contact">Talk to our team</a> about your LinkedIn advertising goals.</p>
`,
  },
  {
    title: 'SaaS Development Process: From Idea to Launch',
    slug: 'saas-development-process-idea-to-launch',
    subtitle: 'A step-by-step guide to building a SaaS product, covering architecture decisions, technology choices, timelines, and costs.',
    category: 'Development',
    tags: ['SaaS', 'development', 'startup', 'product development', 'MVP'],
    featured_image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=630&fit=crop',
    meta_description: 'Complete SaaS development guide: from idea validation to launch. Covers architecture, technology stack, MVP timeline, costs, and scaling strategies.',
    publish_date: '2026-03-10T10:00:00Z',
    content_html: `
<p>Building a SaaS product is a fundamentally different exercise than building a website or internal tool. <a href="https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-saas-factor" target="_blank" rel="noopener noreferrer">McKinsey's analysis</a> shows that the median SaaS company takes 12-18 months to reach product market fit. You are building something that needs to scale, handle concurrent users, manage billing, and evolve continuously. Here is the process we follow at PropelusAI, refined across dozens of SaaS builds.</p>

<h2>Phase 1: Validation (1 to 2 Weeks)</h2>

<p>Before writing any code, validate that people will pay for what you are building. This does not mean surveys or landing page tests. It means talking to 10 to 15 potential customers and asking specific questions: What are you using now? What does it cost you? What is broken about it? Would you pay $X/month for a solution that does Y?</p>

<p>If you cannot get 3 out of 10 prospects to say "yes, I would pay for that," go back to the drawing board. No amount of engineering excellence saves a product nobody wants.</p>

<h2>Phase 2: Architecture and Stack Decisions (1 Week)</h2>

<p>For most SaaS products in 2026, this is the stack we recommend:</p>

<p>Frontend: Next.js with React and TypeScript. Server-side rendering gives you SEO benefits, and the React ecosystem has the largest talent pool for future hires.</p>

<p>Backend: Node.js with Express or Next.js API routes for simpler products. Python with FastAPI for data heavy or ML intensive products.</p>

<p>Database: PostgreSQL for relational data (financial, transactional). MongoDB for flexible schemas (content, user profiles, configurations). Most SaaS products need both.</p>

<p>Infrastructure: AWS or Vercel for deployment. Stripe for billing. Auth0 or Clerk for authentication. Resend or SendGrid for transactional email.</p>

<p>This is not about chasing trends. These choices optimize for developer productivity, hiring availability, and long term maintainability.</p>

<h2>Phase 3: MVP Build (4 to 8 Weeks)</h2>

<p>The MVP should include exactly three things: the core value loop that users pay for, authentication and basic account management, and Stripe billing integration. Everything else (admin dashboards, analytics, team features, integrations) comes later.</p>

<p>A common mistake is building features nobody asked for. Stick to the minimum set that lets paying users accomplish their primary goal. If you validated properly in Phase 1, you know exactly what that goal is.</p>

<h2>Phase 4: Beta and Iteration (2 to 4 Weeks)</h2>

<p>Launch the MVP to 10 to 20 beta users. Not a public launch, but a controlled group that gives you direct feedback. Watch how they use the product. Where do they get stuck? What features do they ask for first? What do they ignore?</p>

<p>Iterate in one week sprints during beta. Fix the critical friction points. Add the most requested feature. Do not add anything else until your beta users are actively using the core product daily.</p>

<h2>Phase 5: Public Launch</h2>

<p>Public launch is not a single day event. It is a 4 week campaign that includes Product Hunt or Hacker News for initial visibility, content marketing targeting your buyer keywords, email outreach to your validated prospect list, and social proof from beta users.</p>

<h2>Cost Breakdown</h2>

<p>MVP development: $10,000 to $40,000 depending on complexity. Monthly infrastructure: $100 to $1,000 for the first year. Marketing budget for launch: $2,000 to $10,000. Total to get from idea to revenue: $15,000 to $55,000 for most B2B SaaS products.</p>

<p>At <a href="/services/saas-development">PropelusAI</a>, we have built SaaS products across fintech, healthcare, education, and enterprise software. Our development process follows the phases outlined above, with weekly sprint reviews and transparent milestone tracking. We also build <a href="/services/ai-based-website-building">marketing websites</a> and <a href="/products/performance-dashboard-subscription">analytics dashboards</a> that support post launch growth. <a href="/contact">Start a conversation</a> about your SaaS idea.</p>
`,
  },
  {
    title: 'How AI Automation Reduces Sales Cycle Time by 40 Percent',
    slug: 'ai-automation-reduces-sales-cycle-time',
    subtitle: 'Practical strategies for using AI automation to shorten B2B sales cycles, with implementation steps and metrics.',
    category: 'Sales',
    tags: ['AI automation', 'sales cycle', 'B2B sales', 'lead scoring', 'CRM'],
    featured_image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop',
    meta_description: 'Learn how AI automation reduces B2B sales cycle time by 40%. Covers lead scoring, automated follow ups, pipeline intelligence, and implementation steps.',
    publish_date: '2026-03-14T10:00:00Z',
    content_html: `
<p>The average B2B sales cycle runs 3 to 6 months. For enterprise deals, it stretches to 9 to 12 months. Most of that time is not spent in productive conversations. It is lost to slow follow ups, manual data entry, unqualified leads clogging the pipeline, and deals stalling without clear next steps. AI automation addresses each of these bottlenecks directly.</p>

<h2>Where Time Gets Wasted in B2B Sales</h2>

<p>We audited sales processes for over 40 companies before building our automation systems. The pattern is consistent: 35 percent of sales rep time goes to administrative tasks (data entry, CRM updates, meeting scheduling). 25 percent goes to prospecting unqualified leads. 15 percent goes to follow up delays (waiting to send the next email, forgetting to check in). Only 25 percent of their time is spent on actual selling: discovery calls, demos, negotiations, and closing.</p>

<p>AI automation flips that ratio by handling the 75 percent of non-selling tasks automatically.</p>

<h2>Four AI Automation Strategies That Shorten Sales Cycles</h2>

<h3>1. AI Lead Scoring and Prioritization</h3>
<p>Instead of treating every inbound lead equally, AI scoring models analyze behavioral signals (pages visited, content downloaded, email engagement), firmographic data (company size, industry, funding stage), and intent signals (pricing page visits, competitor research) to rank leads by purchase readiness.</p>

<p>The result: your sales team calls the hottest leads first. Response time for high intent leads drops from hours to minutes. Conversion rate on first calls improves because reps are talking to people who are actually in a buying motion.</p>

<h3>2. Automated Follow Up Sequences</h3>
<p>The number one reason deals stall is inconsistent follow up. A rep has a great discovery call, then gets busy with other deals and does not send the follow up email for three days. By then, the prospect has moved on.</p>

<p>AI automation triggers personalized follow up sequences based on where the deal is in the pipeline. Post discovery: send a recap email with next steps within 2 hours. Post demo: send relevant case studies within 24 hours. Post proposal: check in at 3 days, 7 days, and 14 days with progressively more direct messaging. These sequences run automatically but feel personal because AI tailors the content to each prospect's specific interests and concerns.</p>

<h3>3. Pipeline Intelligence and Deal Alerts</h3>
<p>AI monitors your entire pipeline and flags deals that are at risk. A deal that has not advanced stages in 14 days gets flagged. A prospect who stops opening emails triggers an alert. A competitor mention in email threads gets surfaced to the rep. This early warning system prevents deals from dying silently.</p>

<h3>4. Automated Administrative Tasks</h3>
<p>Meeting scheduling, CRM data entry, call transcription and summarization, proposal generation from templates, and contract routing for signatures. All of these can be automated. When reps spend zero time on admin, they spend more time selling. The math is simple: if you give each rep back 10 hours per week, a 10 person team gains the equivalent of 2.5 additional full time sellers.</p>

<h2>Implementation Roadmap</h2>

<p>Week 1 to 2: Audit your current sales process and identify the three biggest time sinks. Week 3 to 4: Implement lead scoring based on your historical conversion data. Week 5 to 6: Build automated follow up sequences for each pipeline stage. Week 7 to 8: Deploy pipeline monitoring and deal alerts. Ongoing: Review performance data monthly and refine the models.</p>

<p>At PropelusAI, our clients see an average 42 percent reduction in sales cycle length after implementing AI automation. Our <a href="/products/ai-powered-crm-analytics-and-lead-management">CRM analytics subscription</a> includes lead scoring, pipeline intelligence, and automated workflows. For companies that need a ground up build, our <a href="/services/ai-powered-crm-building-and-integration">custom CRM development</a> service delivers a system tailored to your exact sales process. <a href="/contact">Schedule a consultation</a> to map your automation roadmap.</p>
`,
  },
];
