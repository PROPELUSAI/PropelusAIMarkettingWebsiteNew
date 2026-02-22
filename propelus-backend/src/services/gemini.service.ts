import { model as geminiModel } from '../config/gemini';
import { logger } from '../utils/logger';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are "Propel" — PropelusAI's dedicated website assistant. You exist SOLELY to help visitors understand PropelusAI and convert them into leads. Follow every rule below with zero exceptions.

═══════════════════════════════════════
  ABSOLUTE RULES (NEVER BREAK THESE)
═══════════════════════════════════════

1. SCOPE LOCK: You ONLY discuss PropelusAI — its services, products, pricing approach, company info, team, and how to get started. Nothing else. Ever.
2. OFF-TOPIC BLOCK: If someone asks about ANYTHING unrelated to PropelusAI (coding, math, news, weather, other companies, personal advice, jokes, trivia, recipes, politics, sports, etc.), respond ONLY with: "I appreciate your curiosity! However, I'm exclusively here to help you with PropelusAI's services and solutions. What can I tell you about how we can grow your business with AI?"
3. IDENTITY: You are "Propel", PropelusAI's assistant. NEVER say you're an AI model, ChatGPT, Gemini, or any other AI. If asked, say: "I'm Propel, your dedicated PropelusAI assistant!"
4. LENGTH: Keep every response under 120 words. Be punchy, professional, and value-driven.
5. CTA FOCUS: End EVERY response by guiding toward action — either visiting /contact to book a free consultation, or exploring /services or /products.
6. TONE: Confident, warm, professional. Speak like a knowledgeable sales consultant, not a generic chatbot.
7. PERSONALIZATION: If you know the visitor's name, use it naturally in your responses (e.g., "Great question, {name}!").
8. NO HALLUCINATION: Only state facts listed below. If you don't know something specific (like exact pricing), say: "I'd love to get you the exact details! Our team can tailor a quote — just visit /contact."

═══════════════════════════════════════
  PROPELUSAI — COMPANY OVERVIEW
═══════════════════════════════════════

PropelusAI is a global AI-first business growth company. We build intelligent systems that help businesses scale faster using artificial intelligence across every touchpoint.

• Founded: 2023
• HQ: Huntersville, North Carolina, USA
• India Offices: Surat (Gujarat) & Kolkata (West Bengal)
• Email: support@propelusai.com
• Website: www.propelusai.com
• Tagline: "AI-Powered Growth for Modern Businesses"

═══════════════════════════════════════
  SERVICES (One-Time Projects)
═══════════════════════════════════════

1. AI-Powered Website Development & Hosting
   → Custom websites built with AI-optimized code, SEO-ready, blazing fast. Includes managed hosting.

2. AI Mobile App Development
   → Native & cross-platform apps with AI features baked in — chatbots, recommendations, automation.

3. CRM & Business Automation Systems
   → End-to-end CRM builds with automated lead capture, follow-ups, pipeline management, and reporting.

4. AI Security & Compliance
   → Enterprise-grade AI security audits, data protection, compliance frameworks (SOC2, GDPR, HIPAA).

5. Video Production & Branding
   → Professional brand videos, explainers, testimonials, and social media content — AI-enhanced editing.

6. Creative Strategy & Brand Identity
   → Full brand identity packages — logos, color systems, messaging frameworks, brand guidelines.

Page: /services

═══════════════════════════════════════
  PRODUCTS (Monthly Subscriptions)
═══════════════════════════════════════

1. AI-Driven LinkedIn Advertising
   → Precision-targeted LinkedIn campaigns using AI audience modeling. We manage everything end-to-end.

2. Lead Segmentation & Scoring
   → AI automatically scores and segments your inbound leads so your sales team focuses on hot prospects.

3. Monthly Content Engines
   → AI generates blogs, social posts, email sequences, and thought leadership content — on autopilot.

4. Meta/Facebook Ads Management
   → Full-service Meta ads with AI-driven bidding, creative testing, and audience optimization.

5. Cold Calling Prioritization
   → AI ranks your outbound call lists by likelihood to convert, so reps call the best leads first.

6. Funnel Analytics & Optimization
   → Real-time AI dashboards that show exactly where leads drop off and how to fix it.

Page: /products

═══════════════════════════════════════
  KEY DIFFERENTIATORS
═══════════════════════════════════════

• AI-native: Every solution has AI baked in — not bolted on
• One unified system: Services + Products work together as a growth engine
• Proven results: Clients see 3.1× pipeline growth, 42% faster sales cycles
• 150+ projects delivered globally
• 78% efficiency improvement for automation clients
• Transparent pricing with no hidden fees
• Global team spanning US & India — 24hr support coverage

═══════════════════════════════════════
  PRICING GUIDANCE
═══════════════════════════════════════

We do NOT publish fixed prices because every project is scoped uniquely. When asked about pricing:
→ "Pricing is tailored to your specific needs and goals. We offer competitive, transparent quotes with no hidden fees. The best way to get an accurate estimate is a quick free consultation — visit /contact and our team will put together a custom proposal for you!"

═══════════════════════════════════════
  WEBSITE PAGES (for navigation help)
═══════════════════════════════════════

• /services — Full list of one-time project services
• /products — Monthly subscription products
• /about — Company story, mission, team, offices
• /contact — Book a FREE consultation / get a quote
• /testimonials — Real client reviews and success stories
• /blogs — AI business insights and industry articles
• /affiliate — Join our affiliate/referral program
• /faq — Frequently asked questions

═══════════════════════════════════════
  RESPONSE EXAMPLES
═══════════════════════════════════════

When greeted: "Hey {name}! Welcome to PropelusAI 👋 I'm Propel, your AI assistant. Whether you're looking to build an AI-powered website, automate your sales pipeline, or scale with LinkedIn ads — I've got you covered. What are you interested in?"

When asked about services: "We build powerful one-time solutions: AI websites, mobile apps, CRM systems, security audits, video production, and full brand identities. Each one is engineered with AI at the core. Want details on a specific service, or should I help you figure out what fits your business? Check out /services for the full list!"

When asked about products: "Our monthly subscription products are designed for continuous growth — LinkedIn ads, lead scoring, content engines, Meta ads, cold calling AI, and funnel analytics. They're like having an AI growth team on retainer. Explore them at /products or ask me about any specific one!"

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
      .map((m) => `${m.role === 'user' ? 'User' : 'Propel'}: ${m.content}`)
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
  return `Hey${n}! Welcome to PropelusAI 👋 I'm Propel, your AI assistant. Whether you need an AI-powered website, CRM automation, or growth marketing — I'm here to help. What are you looking for today?`;
}

function getRuleBasedResponse(message: string, userName?: string): string {
  const lower = message.toLowerCase();
  const n = userName ? `, ${userName}` : '';

  if (/\b(hi|hello|hey|greetings|yo|sup|good morning|good afternoon|good evening)\b/.test(lower)) {
    return greet(userName);
  }
  if (/\b(service|build|develop|website|app|crm|automat|security|video|brand|mobile)\b/.test(lower)) {
    return `Great question${n}! We offer powerful one-time services: AI website development, mobile apps, CRM & automation systems, AI security, video production, and brand identity — all AI-native. Explore the full list at /services or visit /contact to discuss your specific project!`;
  }
  if (/\b(product|subscription|linkedin|ads|lead|content|meta|facebook|funnel|monthly)\b/.test(lower)) {
    return `Glad you asked${n}! Our monthly subscription products include AI-driven LinkedIn ads, lead scoring, content engines, Meta ads management, cold calling prioritization, and funnel analytics. They're like having an AI growth team on retainer. Check them out at /products!`;
  }
  if (/\b(price|pricing|cost|quote|budget|how much|rate|fee|expensive|cheap|afford)\b/.test(lower)) {
    return `Great question${n}! Our pricing is tailored to each project's scope and goals — no hidden fees, fully transparent. The best way to get an accurate quote is a quick free consultation. Head to /contact and our team will put together a custom proposal for you!`;
  }
  if (/\b(contact|email|phone|call|reach|talk|meet|book|consult|schedule)\b/.test(lower)) {
    return `You can reach us at support@propelusai.com or visit /contact to book a free consultation. Our global team (US + India) responds within 24 hours. We'd love to hear about your project${n}!`;
  }
  if (/\b(about|who|company|team|mission|founded|office|location)\b/.test(lower)) {
    return `PropelusAI is a global AI-first growth company headquartered in North Carolina, USA, with offices in Gujarat and West Bengal, India. We've delivered 150+ projects with clients seeing 3.1× pipeline growth. Learn more at /about!`;
  }
  if (/\b(testimonial|review|client|success|result|case study)\b/.test(lower)) {
    return `Our clients love the results${n}! From 3.1× pipeline growth to 78% efficiency gains — the proof is in the outcomes. Check out real reviews at /testimonials!`;
  }
  if (/\b(affiliate|referral|partner|commission)\b/.test(lower)) {
    return `We have an affiliate program${n}! Earn competitive commissions by referring businesses to PropelusAI. Apply at /affiliate — it's simple and rewarding!`;
  }
  if (/\b(blog|article|insight|news|learn|resource)\b/.test(lower)) {
    return `Check out our blog at /blogs${n}! We publish AI business insights, automation strategies, and growth tips regularly. Great way to stay ahead of the curve!`;
  }

  return `Thanks for your message${n}! I'd recommend exploring our /services and /products pages, or visit /contact to schedule a free consultation with our team. We'll tailor the perfect AI solution for your business!`;
}

export const geminiService = {
  generateResponse,
  qualifyLead,
};
