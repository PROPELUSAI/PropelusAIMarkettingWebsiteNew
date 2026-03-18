/**
 * gemini.service.ts — Google Gemini AI integration for the chatbot.
 * Contains the system prompt with PropelusAI knowledge base,
 * conversation context formatting, and response generation.
 * Enforces scope-locked responses (PropelusAI-only topics).
 */
import { model as geminiModel } from '../config/gemini';
import { KNOWLEDGE_BASE } from '../config/knowledgeBase';
import { logger } from '../utils/logger';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are "PropelusAI" — PropelusAI's dedicated website assistant. You exist SOLELY to help visitors understand PropelusAI and convert them into leads. Follow every rule below with zero exceptions.

═══════════════════════════════════════
  ABSOLUTE RULES (NEVER BREAK THESE)
═══════════════════════════════════════

1. SCOPE LOCK: You ONLY discuss PropelusAI — its services, products, pricing approach, company info, team, and how to get started. Nothing else. Ever.
2. OFF-TOPIC BLOCK: If someone asks about ANYTHING unrelated to PropelusAI (coding, math, news, weather, other companies, personal advice, jokes, trivia, recipes, politics, sports, etc.), respond ONLY with: "I appreciate your curiosity! However, I'm exclusively here to help you with PropelusAI's services and solutions. What can I tell you about how we can grow your business with AI?"
3. IDENTITY: You are "PropelusAI", PropelusAI's assistant. NEVER say you're an AI model, ChatGPT, Gemini, or any other AI. If asked, say: "I'm PropelusAI, your dedicated PropelusAI assistant!"
4. LENGTH: Keep every response under 150 words. Be punchy, professional, and value-driven. If the user asks for detailed info about a specific service or product, you may go up to 200 words to cover key details (headline, description, deliverables, investment range, timeline).
5. CTA FOCUS: End EVERY response by guiding toward action — either visiting /contact to book a free consultation, or exploring /services or /products.
6. TONE: Confident, warm, professional. Speak like a knowledgeable sales consultant, not a generic chatbot.
7. PERSONALIZATION: If you know the visitor's name, use it naturally in your responses (e.g., "Great question, {name}!").
8. NO HALLUCINATION: Only state facts from the knowledge base below. If you don't know something specific, say: "I'd love to get you the exact details! Our team can tailor a quote — just visit /contact."
9. DETAIL ACCURACY: When a user asks about a specific service or product, provide the EXACT details from the knowledge base — headline, investment range, timeline, deliverables, and description. Do NOT generalize when you have specific data.
10. COMPARISON SUPPORT: If asked to compare services or products, use the knowledge base to highlight key differences in scope, pricing, deliverables, and timeline.
11. USE CASE MATCHING: If a user describes their business problem without naming a specific service, identify the best-fit service(s) or product(s) from the knowledge base and recommend them with specific details.
12. FORMATTING: Use bullet points (•) for lists. Use line breaks for readability. Keep the response scannable.

═══════════════════════════════════════
  RESPONSE STRATEGY
═══════════════════════════════════════

When greeting: Welcome warmly, introduce yourself as PropelusAI, and ask what they're looking for.

When asked about a SPECIFIC service: Provide headline, investment range, key deliverables, and timeline from the knowledge base. End with CTA to /contact.

When asked about a SPECIFIC product: Provide subtitle, description, key deliverables. End with CTA to /products or /contact.

When asked about pricing: If you have the investment range for that service, share it. For products, mention it's scope-based and suggest /contact.

When asked to COMPARE: Create a brief comparison highlighting 2-3 key differences.

When asked about the COMPANY: Share relevant stats, offices, differentiators.

When user describes a PROBLEM: Match it to 1-2 best-fit services/products, explain why, and provide their details.

When asked about RESULTS: Share relevant client testimonials with specific metrics.

When off-topic: Use the off-topic block response from Rule 2.

${KNOWLEDGE_BASE}

═══════════════════════════════════════
  RESPONSE EXAMPLES
═══════════════════════════════════════

When greeted: "Hey {name}! Welcome to PropelusAI 👋 I'm PropelusAI, your AI assistant. Whether you're looking to build an AI-powered website, automate your sales pipeline, or scale with LinkedIn ads — I've got you covered. What are you interested in?"

When asked about a specific service (e.g., "tell me about your website building service"):
"Great choice! Here's what you get with our AI-Based Website Building & Hosting:

• Enterprise grade corporate experiences without the overhead.
• Investment: $67,600 – $169,000
• Timeline: 2–4 weeks build + managed hosting
• Deliverables: Custom AI-powered website, Domain + SSL, Hosting + CDN, Performance optimization, SEO foundation

We pair strategic UX with AI-assisted design to deliver websites that scale like products. Ready to get started? Visit /contact for a free consultation!"

When asked about products generically: "Our monthly subscription products are designed for continuous growth — LinkedIn ads, content engines, Meta ads, cold calling AI, CRM analytics, thought leadership, social media reels, copywriting, funnel tracking, cybersecurity monitoring, and more! They're like having an AI growth team on retainer. Explore all 21 products at /products or ask me about any specific one!"

When off-topic: "I appreciate the curiosity! But I'm exclusively here to help with PropelusAI's services and solutions. What can I tell you about how we can help your business grow with AI?"`;

/**
 * Generate a response using Gemini AI
 */
export async function generateResponse(
  userMessage: string,
  conversationHistory: ChatMessage[],
  userName?: string
): Promise<string> {
  if (!geminiModel) {
    return getRuleBasedResponse(userMessage, userName);
  }

  try {
    // Build conversation context
    const context = conversationHistory
      .slice(-10) // Last 10 messages for context
      .map((m) => `${m.role === 'user' ? 'User' : 'PropelusAI'}: ${m.content}`)
      .join('\n');

    const nameContext = userName ? `\n\nIMPORTANT: The visitor's name is "${userName}". Use it naturally in your response.` : '';

    const prompt = `${SYSTEM_PROMPT}${nameContext}\n\n--- CONVERSATION ---\n${context}\n\nUser: ${userMessage}\n\nPropel:`;

    const result = await geminiModel.generateContent(prompt);
    const response = result.response.text();

    if (!response || response.trim().length === 0) {
      return getRuleBasedResponse(userMessage, userName);
    }

    return response.trim();
  } catch (error) {
    logger.error('Gemini API error:', error);
    return getRuleBasedResponse(userMessage, userName);
  }
}

/**
 * Qualify a lead based on conversation
 */
export async function qualifyLead(
  conversationHistory: ChatMessage[]
): Promise<'hot' | 'warm' | 'cold'> {
  const allMessages = conversationHistory
    .filter((m) => m.role === 'user')
    .map((m) => m.content.toLowerCase())
    .join(' ');

  const hotKeywords = ['buy', 'purchase', 'pricing', 'quote', 'budget', 'start now', 'ready', 'urgent', 'asap', 'contract', 'sign up', 'onboard', 'proposal'];
  const warmKeywords = ['interested', 'learn more', 'demo', 'consultation', 'consider', 'compare', 'timeline', 'how much', 'tell me more', 'what do you offer', 'need help'];

  const hotCount = hotKeywords.filter((k) => allMessages.includes(k)).length;
  const warmCount = warmKeywords.filter((k) => allMessages.includes(k)).length;

  if (hotCount >= 2 || (hotCount >= 1 && conversationHistory.length > 6)) return 'hot';
  if (warmCount >= 2 || hotCount >= 1) return 'warm';
  return 'cold';
}

// ─── Rule-based fallback responses ───────────────────

function greet(name?: string): string {
  const n = name ? `, ${name}` : '';
  return `Hey${n}! Welcome to PropelusAI 👋 I'm PropelusAI, your AI assistant. Whether you need an AI-powered website, CRM automation, or growth marketing — I'm here to help. What are you looking for today?`;
}

function getRuleBasedResponse(message: string, userName?: string): string {
  const lower = message.toLowerCase();
  const n = userName ? `, ${userName}` : '';

  // Greetings
  if (/\b(hi|hello|hey|greetings|yo|sup|good morning|good afternoon|good evening)\b/.test(lower)) {
    return greet(userName);
  }

  // ── Specific Service Queries ──

  // Website
  if (/\b(website|web development|web build|site build)\b/.test(lower)) {
    return `Great choice${n}! Our AI-Based Website Building & Hosting delivers Enterprise grade websites without the overhead.\n\n• Investment: $67,600 – $169,000\n• Timeline: 2–4 weeks build + managed hosting\n• Deliverables: Custom AI-powered website, Domain + SSL, Hosting + CDN, Performance optimization, SEO foundation\n\nWe pair strategic UX with AI-assisted design. Visit /contact to get a custom quote!`;
  }

  // Mobile App
  if (/\b(mobile app|ios|android|app develop)\b/.test(lower)) {
    return `Our AI-Based Mobile App Development builds cross-platform apps with embedded intelligence${n}!\n\n• Investment: $101,400 – $253,500\n• Timeline: 8–12 weeks build + 2 weeks store approvals\n• Deliverables: Native app bundle, App store submissions, User documentation, Analytics dashboard, Maintenance plan\n\nWe design product-ready mobile experiences that learn from user behavior. Visit /contact to discuss your app!`;
  }

  // LinkedIn Ads
  if (/\b(linkedin ad|linkedin campaign|linkedin market)\b/.test(lower)) {
    return `We offer both a one-time LinkedIn Ads service ($8,450–$16,900/mo) and a monthly LinkedIn Ads product subscription${n}!\n\n• Predictive targeting for professional audiences\n• AI audience segmentation, creative testing, weekly optimization\n• Monthly ROI reports and performance analytics\n\nWhether B2B or B2C, we maximize your LinkedIn ROI. Visit /contact to get started!`;
  }

  // CRM
  if (/\b(crm|customer relationship|lead management|pipeline)\b/.test(lower)) {
    return `We have powerful CRM solutions${n}!\n\n• AI-Powered CRM Building: $33,800–$84,500 (one-time)\n• Custom Brand-Tailored CRM: $50,700–$101,400 (one-time)\n• CRM Analytics & Lead Management: Monthly subscription\n\nFrom custom builds to white-label solutions with predictive intelligence. Visit /contact to discuss your needs!`;
  }

  // Video
  if (/\b(video|film|editing|testimonial video|event coverage|animation|motion graphic)\b/.test(lower)) {
    return `We offer full video production services${n}!\n\n• Video Editing: $550–$1,925\n• Event Coverage: $1,650–$5,500\n• Testimonial Videos: $1,375–$4,400\n• Corporate Films: $5,070–$25,350\n• Animation & Motion Graphics: $3,380–$16,900\n\nAll with AI-enhanced editing and creative direction. Visit /contact for a quote!`;
  }

  // Logo / Brand
  if (/\b(logo|brand identity|brand design|branding)\b/.test(lower)) {
    return `We create memorable brand identities${n}!\n\n• Logo Design: $3,380–$16,900\n• Complete Brand Identity Package: $8,450–$25,350\n• Brand Voice & Messaging: $2,750–$8,250\n\nIncludes logo in all formats, brand style guide, color palettes, typography, and positioning. Visit /contact to get started!`;
  }

  // Graphics / Design
  if (/\b(graphic|design|pitch deck|presentation|collateral)\b/.test(lower)) {
    return `Our Creative & Design services include${n}:\n\n• AI-Enhanced Graphics: $2,535–$8,450\n• Pitch Decks: $2,535–$8,450\n• Marketing Collateral: $1,690–$5,070\n\nWe blend AI-powered tools with creative expertise for high-impact visuals. Check out /services or visit /contact!`;
  }

  // Security
  if (/\b(security|cybersecurity|data protection|email domain|email setup)\b/.test(lower)) {
    return `We protect your business${n}!\n\n• Custom Email Domain Setup: $169–$507\n• Cybersecurity & Data Protection: $8,450–$25,350\n\nFrom DNS configuration to Enterprise grade security. Visit /contact for details!`;
  }

  // Content / Marketing
  if (/\b(content|blog|seo|content market|content creat|copywriting)\b/.test(lower)) {
    return `We have AI-powered content solutions${n}!\n\n• Content Creation & Marketing (service): $3,380–$8,450/month\n• Content Creation (product): Monthly subscription\n• Multi-Platform Content Calendar: 40-60 posts/month\n\n10+ SEO optimized assets per month. Visit /products or /contact!`;
  }

  // Cold Calling
  if (/\b(cold call|prospect|outbound|calling)\b/.test(lower)) {
    return `Our AI-Assisted Cold Calling combines human conversations with machine intelligence${n}!\n\n• Service: $1,690–$5,070 (one-time setup)\n• Product: Monthly subscription with ongoing optimization\n• Includes priority prospect lists, custom scripts, performance analytics, and coaching feedback loops\n\nVisit /contact to get started!`;
  }

  // Automation
  if (/\b(automat|workflow|funnel|marketing automat)\b/.test(lower)) {
    return `Our Complete Marketing Automation builds end-to-end automation architecture${n}!\n\n• Investment: $16,900–$42,250\n• Timeline: 3–4 weeks + managed optimization\n• Lead capture to customer retention, intelligent workflows that scale effortlessly\n\nVisit /contact to learn more!`;
  }

  // Meta / Facebook / Instagram Ads
  if (/\b(meta ad|facebook ad|instagram ad|social media ad|paid social)\b/.test(lower)) {
    return `Our AI-Based Meta & Google Advertising is full-funnel paid social engineered for compounding ROI${n}!\n\n• Service: $2,535–$5,070/month\n• Product: Monthly managed subscription\n• Campaign setup, AI creative optimization, audience research, monthly performance reports\n\nROAS improvements up to 5.2×! Visit /contact to learn more!`;
  }

  // WhatsApp
  if (/\b(whatsapp|messaging|chatbot flow)\b/.test(lower)) {
    return `Our WhatsApp Business Messaging & Automation product includes${n}:\n\n• 4-8 broadcast campaigns/month\n• AI chatbot conversation flows\n• Automated response templates\n• Segmentation and targeting strategy\n\nReach customers where they are! Visit /products or /contact!`;
  }

  // Reels / Short-form Video
  if (/\b(reel|short|tiktok|youtube short)\b/.test(lower)) {
    return `We offer professional short-form video production${n}!\n\n• Social Media Reels & Shorts (monthly): 8-12 videos/month\n• Weekly Reels & Shorts (weekly): 4 videos/week with 48hr turnaround\n• Video Editing (service): from $550\n\nPlatform-optimized for Instagram, YouTube, and TikTok. Visit /products or /contact!`;
  }

  // Copywriting
  if (/\b(copywriting|copy writing|messaging strategy)\b/.test(lower)) {
    return `We have powerful copywriting solutions${n}!\n\n• AI-Enhanced Copywriting & Messaging (monthly): Landing pages, emails, ads\n• Conversion Copywriting Retainer (monthly): Sales pages, funnels, A/B testing\n• Brand Voice & Messaging (service): $2,750–$8,250\n\nAll optimized through AI analysis. Visit /products or /contact!`;
  }

  // Community / Engagement
  if (/\b(community|engagement|social media manage)\b/.test(lower)) {
    return `Our Audience Engagement & Community Management product handles${n}:\n\n• Daily social media engagement\n• Comment & DM response management\n• Community building strategy\n• Brand sentiment monitoring\n\nTurn followers into brand advocates! Visit /products or /contact!`;
  }

  // Campaign Strategy
  if (/\b(campaign strategy|campaign plan|campaign support|campaign execution)\b/.test(lower)) {
    return `Our Campaign Strategy & Execution Support product includes${n}:\n\n• Monthly campaign strategy & planning\n• Creative brief development\n• Channel selection & budget allocation\n• Campaign execution oversight\n• Performance tracking & optimization\n\nEnd-to-end campaign management! Visit /products or /contact!`;
  }

  // Pitch Deck
  if (/\b(pitch deck|pitch presentation|investor deck|fundrais)\b/.test(lower)) {
    return `Our Pitch Decks & Corporate Presentations service delivers${n}:\n\n• Investment: $2,535–$8,450\n• Custom-designed pitch deck (15-30 slides)\n• Strategic narrative and story arc\n• Data visualization and infographics\n• Speaker notes and editable source files\n\nPresentations that close deals! Visit /services or /contact!`;
  }

  // Corporate Film
  if (/\b(corporate film|brand story video|company film|brand film)\b/.test(lower)) {
    return `Our Corporate Films & Brand Story Videos service includes${n}:\n\n• Investment: $5,070–$25,350\n• Full production (up to 10 minutes)\n• Script development and storyboarding\n• Professional cinematography\n• AI-enhanced post-production\n\nCinematic storytelling for your brand! Visit /services or /contact!`;
  }

  // ── General Queries ──

  if (/\b(service|build|develop)\b/.test(lower)) {
    return `We offer 31 one-time services across 5 categories${n}: Web & Mobile, AI Marketing, CRM & Automation, MediaWorks, and Security & Support. Each includes dedicated account manager, weekly reports, and full launch support. Explore at /services or visit /contact!`;
  }
  if (/\b(product|subscription|monthly|quarterly)\b/.test(lower)) {
    return `We offer 21 monthly subscription products${n}: LinkedIn Ads, Content Engine, Cold Calling, Meta Ads, CRM & Analytics, Content Creation, Thought Leadership, Content Calendar, WhatsApp Automation, Instagram/Facebook Ads, LinkedIn Targeting, Lead Generation, Social Media Reels, AI Copywriting, Funnel Tracking, Cybersecurity Monitoring, Weekly Reels, Motion Graphics Series, Conversion Copywriting, Campaign Strategy, and Audience Engagement! Explore at /products!`;
  }
  if (/\b(price|pricing|cost|quote|budget|how much|rate|fee|expensive|cheap|afford|invest)\b/.test(lower)) {
    return `Our pricing ranges vary by service${n}. For example:\n\n• Websites: $67,600–$169,000\n• Mobile Apps: $101,400–$253,500\n• CRM: $33,800–$84,500\n• Video Editing: from $550\n• Email Setup: from $169\n\nAll pricing is transparent with no hidden fees. Visit /contact for a custom proposal tailored to your needs!`;
  }
  if (/\b(contact|email|phone|call|reach|talk|meet|book|consult|schedule)\b/.test(lower)) {
    return `Reach us at support@propelusai.com or WhatsApp: +1 6232357330 (US) / +91 9477466514 (India). Visit /contact to book a free consultation. Our global team responds within 24 hours${n}!`;
  }
  if (/\b(about|who|company|team|mission|founded|office|location|where)\b/.test(lower)) {
    return `PropelusAI is a global AI-first growth company (founded 2023)${n}!\n\n• HQ: Phoenix, Arizona, USA\n• India: Surat, Gujarat & Kolkata, West Bengal\n• Stats: 150+ projects, 3.1× pipeline growth, 42% faster sales cycles\n• Values: Precision, Product-Grade Engineering, AI at the Core, Outcome first Thinking\n\nLearn more at /about!`;
  }
  if (/\b(testimonial|review|client|success|result|case study|proof)\b/.test(lower)) {
    return `Our clients see incredible results${n}!\n\n• 3.1× pipeline growth (Manufacturing COO)\n• 42% faster sales cycles (SaaS VP Growth)\n• 4× organic traffic in 120 days (Education Director)\n• 78% efficiency improvement (Consulting Partner)\n• ROAS from 1.8× to 5.2× (Consumer App Growth Lead)\n\nRead all 16 testimonials at /testimonials!`;
  }
  if (/\b(affiliate|referral|partner|commission)\b/.test(lower)) {
    return `We have an affiliate program${n}! Earn competitive commissions by referring businesses to PropelusAI. Apply at /affiliate — it's simple and rewarding!`;
  }
  if (/\b(blog|article|insight|news|learn|resource)\b/.test(lower)) {
    return `Check out our blog at /blogs${n}! We publish AI business insights, automation strategies, and growth tips regularly. Great way to stay ahead of the curve!`;
  }
  if (/\b(faq|question|how does|how do)\b/.test(lower)) {
    return `Great question${n}! Here are some common ones:\n\n• Services = one-time projects, Products = monthly subscriptions\n• We work across ALL industries globally\n• Every service includes post-launch support\n• Bundle pricing available for combined packages\n\nVisit /faq for the complete list or ask me anything specific!`;
  }
  if (/\b(difference|compare|vs|versus|which one|what should i|recommend)\b/.test(lower)) {
    return `Happy to help you choose${n}! Could you tell me a bit about your business goals? For example:\n\n• Need a one-time build? → /services\n• Need ongoing monthly support? → /products\n• Not sure? → Visit /contact for a free consultation\n\nI can also compare specific services or products for you — just name them!`;
  }

  return `Thanks for your message${n}! I'd love to help you find the perfect AI solution. We offer 33 one-time services and 21 subscription products.\n\nTry asking me about:\n• A specific service (e.g., "website building", "CRM")\n• A specific product (e.g., "LinkedIn ads", "content creation")\n• Pricing, timelines, or deliverables\n\nOr visit /contact to schedule a free consultation!`;
}

export const geminiService = {
  generateResponse,
  qualifyLead,
};
