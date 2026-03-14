import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let model: GenerativeModel | null = null;

if (GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 800,
      topP: 0.9,
      topK: 40,
    },
  });
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are "Propel" - PropelusAI's dedicated website assistant. You exist SOLELY to help visitors understand PropelusAI and convert them into leads. Follow every rule below with zero exceptions.

ABSOLUTE RULES (NEVER BREAK THESE):

1. SCOPE LOCK: You ONLY discuss PropelusAI - its services, products, pricing approach, company info, team, and how to get started. Nothing else. Ever.
2. OFF-TOPIC BLOCK: If someone asks about ANYTHING unrelated to PropelusAI, respond ONLY with: "I appreciate your curiosity! However, I'm exclusively here to help you with PropelusAI's services and solutions. What can I tell you about how we can grow your business with AI?"
3. IDENTITY: You are "Propel", PropelusAI's assistant. NEVER say you're an AI model, ChatGPT, Gemini, or any other AI.
4. LENGTH: Keep every response under 150 words. Be punchy, professional, and value-driven. Up to 200 words for detailed service/product info.
5. CTA FOCUS: End EVERY response by guiding toward action - visiting /contact, /services, or /products.
6. TONE: Confident, warm, professional.
7. PERSONALIZATION: If you know the visitor's name, use it naturally.
8. NO HALLUCINATION: Only state facts from the knowledge base. If unsure, direct to /contact.
9. DETAIL ACCURACY: When asked about a specific service or product, provide EXACT details from the knowledge base.
10. FORMATTING: Use bullet points for lists. Use line breaks for readability.

COMPANY OVERVIEW:
PropelusAI is a global AI-first business growth company.
- Founded: 2023
- HQ: Phoenix, Arizona, USA
- India: Surat, Gujarat and Kolkata, West Bengal
- Email: support@propelusai.com
- Website: www.propelusai.com
- 150+ Projects Delivered, 3.1x Pipeline Growth, 42% Faster Sales Cycles, 24/5 Support

SERVICES (One-Time Projects):
- Website Building: $67,600-$169,000
- Mobile App Development: $101,400-$253,500
- CRM Development: $33,800-$84,500
- Custom CRM: $50,700-$101,400
- Domain/Email Setup: $169-$507
- Cybersecurity: $8,450-$25,350
- Marketing Automation: $16,900-$42,250
- Funnel Buildouts: $8,450-$25,350
- LinkedIn Ads: $8,450-$16,900/mo
- Meta/Google Ads: $2,535-$5,070/mo
- Content Marketing: $3,380-$8,450/mo
- Cold Calling: $1,690-$5,070
- Video Editing, Logo Design, Pitch Decks, and more

PRODUCTS (Monthly Subscriptions):
21 subscription products including LinkedIn Ads, Content Engine, Cold Calling, Meta Ads, CRM Analytics, Content Creation, Thought Leadership, WhatsApp Automation, Social Media Reels, Copywriting, Funnel Tracking, Cybersecurity Monitoring, and more.`;

export async function generateChatResponse(
  userMessage: string,
  conversationHistory: ChatMessage[],
  userName?: string
): Promise<string> {
  if (!model) {
    return getRuleBasedResponse(userMessage, userName);
  }

  try {
    const context = conversationHistory
      .slice(-10)
      .map((m) => `${m.role === 'user' ? 'User' : 'Propel'}: ${m.content}`)
      .join('\n');

    const nameContext = userName
      ? `\n\nIMPORTANT: The visitor's name is "${userName}". Use it naturally in your response.`
      : '';

    const prompt = `${SYSTEM_PROMPT}${nameContext}\n\n--- CONVERSATION ---\n${context}\n\nUser: ${userMessage}\n\nPropel:`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    if (!response || response.trim().length === 0) {
      return getRuleBasedResponse(userMessage, userName);
    }

    return response.trim();
  } catch (error) {
    console.error('Gemini API error:', error);
    return getRuleBasedResponse(userMessage, userName);
  }
}

export async function qualifyLead(
  conversationHistory: ChatMessage[]
): Promise<'hot' | 'warm' | 'cold'> {
  const allMessages = conversationHistory
    .filter((m) => m.role === 'user')
    .map((m) => m.content.toLowerCase())
    .join(' ');

  const hotKeywords = [
    'buy', 'purchase', 'pricing', 'quote', 'budget', 'start now',
    'ready', 'urgent', 'asap', 'contract', 'sign up', 'onboard', 'proposal',
  ];
  const warmKeywords = [
    'interested', 'learn more', 'demo', 'consultation', 'consider',
    'compare', 'timeline', 'how much', 'tell me more', 'what do you offer', 'need help',
  ];

  const hotCount = hotKeywords.filter((k) => allMessages.includes(k)).length;
  const warmCount = warmKeywords.filter((k) => allMessages.includes(k)).length;

  if (hotCount >= 2 || (hotCount >= 1 && conversationHistory.length > 6)) return 'hot';
  if (warmCount >= 2 || hotCount >= 1) return 'warm';
  return 'cold';
}

function getRuleBasedResponse(message: string, userName?: string): string {
  const lower = message.toLowerCase();
  const n = userName ? `, ${userName}` : '';

  if (/\b(hi|hello|hey|greetings|yo|sup|good morning|good afternoon|good evening)\b/.test(lower)) {
    return `Hey${n}! Welcome to PropelusAI. I'm Propel, your AI assistant. Whether you need an AI-powered website, CRM automation, or growth marketing - I'm here to help. What are you looking for today?`;
  }
  if (/\b(website|web development|web build|site build)\b/.test(lower)) {
    return `Great choice${n}! Our AI-Based Website Building and Hosting delivers enterprise-grade websites.\n\n- Investment: $67,600 - $169,000\n- Timeline: 2-4 weeks build + managed hosting\n- Deliverables: Custom AI-powered website, Domain + SSL, Hosting + CDN, Performance optimization, SEO foundation\n\nVisit /contact to get a custom quote!`;
  }
  if (/\b(mobile app|ios|android|app develop)\b/.test(lower)) {
    return `Our AI-Based Mobile App Development builds cross-platform apps with embedded intelligence${n}!\n\n- Investment: $101,400 - $253,500\n- Timeline: 8-12 weeks build + 2 weeks store approvals\n- Deliverables: Native app bundle, App store submissions, User documentation, Analytics dashboard\n\nVisit /contact to discuss your app!`;
  }
  if (/\b(crm|customer relationship|lead management|pipeline)\b/.test(lower)) {
    return `We have powerful CRM solutions${n}!\n\n- AI-Powered CRM Building: $33,800-$84,500 (one-time)\n- Custom Brand-Tailored CRM: $50,700-$101,400 (one-time)\n- CRM Analytics and Lead Management: Monthly subscription\n\nVisit /contact to discuss your needs!`;
  }
  if (/\b(service|build|develop)\b/.test(lower)) {
    return `We offer 31 one-time services across 5 categories${n}: Web and Mobile, AI Marketing, CRM and Automation, MediaWorks, and Security and Support. Explore at /services or visit /contact!`;
  }
  if (/\b(product|subscription|monthly|quarterly)\b/.test(lower)) {
    return `We offer 21 monthly subscription products${n} including LinkedIn Ads, Content Engine, Cold Calling, Meta Ads, CRM Analytics, and more! Explore at /products!`;
  }
  if (/\b(price|pricing|cost|quote|budget|how much|rate|fee)\b/.test(lower)) {
    return `Our pricing ranges vary by service${n}. For example:\n\n- Websites: $67,600-$169,000\n- Mobile Apps: $101,400-$253,500\n- CRM: $33,800-$84,500\n\nVisit /contact for a custom proposal tailored to your needs!`;
  }
  if (/\b(contact|email|phone|call|reach|talk|meet|book|consult|schedule)\b/.test(lower)) {
    return `Reach us at support@propelusai.com or WhatsApp: +1 6232357330 (US) / +91 9477466514 (India). Visit /contact to book a free consultation${n}!`;
  }
  if (/\b(about|who|company|team|mission)\b/.test(lower)) {
    return `PropelusAI is a global AI-first growth company (founded 2023)${n}!\n\n- HQ: Phoenix, Arizona, USA\n- India: Surat and Kolkata\n- 150+ projects, 3.1x pipeline growth, 42% faster sales cycles\n\nLearn more at /about!`;
  }

  return `Thanks for your message${n}! I'd love to help you find the perfect AI solution. We offer 31 one-time services and 21 subscription products.\n\nTry asking me about:\n- A specific service (e.g., "website building", "CRM")\n- Pricing, timelines, or deliverables\n\nOr visit /contact to schedule a free consultation!`;
}

export const geminiService = {
  generateChatResponse,
  qualifyLead,
};
