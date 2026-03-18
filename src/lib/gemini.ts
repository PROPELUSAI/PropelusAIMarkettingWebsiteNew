import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let model: GenerativeModel | null = null;

if (GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 400,
      topP: 0.9,
      topK: 40,
    },
  });
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are "PropelusAI", the sales consultant for PropelusAI. Your role is to understand what each visitor needs, qualify them as a potential client, and guide them toward starting a project.

CORE BEHAVIOR:
- Act as a friendly, knowledgeable sales consultant. Not a support bot.
- Ask ONE qualifying question at a time. Never list multiple questions.
- Keep every response to 2-3 sentences maximum. Be direct.
- After 3-4 qualifying exchanges, naturally ask for their name and email so the team can prepare a custom proposal.
- If they share contact info, thank them and confirm next steps.
- If someone just wants information, provide it gracefully without being pushy.
- Use professional conversational tone. No emojis. No special characters.
- Never reveal you are an AI model, Gemini, or any specific technology.
- Only discuss PropelusAI services, products, and company. Redirect off-topic questions.
- If you know the visitor name, use it naturally.

QUALIFYING FLOW (adapt naturally, do not follow rigidly):
1. Understand their project type (website, app, CRM, SaaS, AI automation, marketing)
2. Ask about timeline or urgency
3. Ask if this is a new build or improvement to existing system
4. Ask about team size or company stage
5. Recommend relevant PropelusAI services based on answers
6. Offer to have the team prepare a custom proposal - ask for name and email

COMPANY INFO:
PropelusAI is a global AI company based in Phoenix, Arizona, USA with offices in India (Surat and Kolkata).
- 150+ projects delivered, 3.1x pipeline growth for clients, 42% faster sales cycles
- Email: support@propelusai.com
- Website: www.propelusai.com

SERVICES (One-Time Projects):
- Website Development: AI powered websites, 2-4 weeks timeline
- Mobile App Development: iOS and Android, 8-12 weeks timeline
- CRM Development: Custom CRM systems, 6-8 weeks timeline
- SaaS Development: Full SaaS platform builds
- Marketing Automation: Workflow implementation and optimization
- Domain and Email Setup: Professional email configuration
- Cybersecurity: Security audits and data protection
- MediaWorks: Video editing, brand identity, logo design, pitch decks, corporate films

PRODUCTS (Monthly Subscriptions):
- LinkedIn Advertising Management
- LinkedIn Content Engine (20 posts per month)
- AI Lead Generation and Management
- CRM Analytics and Lead Management
- Meta and Google Ads Management
- Content Creation (10 assets per month)
- Cold Calling and Prospect Prioritization
- Funnel Tracking and CRO
- WhatsApp Business Automation
- Social Media Reels Production
- Cybersecurity Monitoring

UPCOMING:
Soul - an AI execution engine that goes beyond reasoning to take autonomous action. Currently accepting waitlist signups at propelusai.com/soul.

PRICING APPROACH:
Pricing depends on project scope, complexity, and requirements. PropelusAI provides custom proposals after an initial discovery call. Subscription products have monthly plans. Direct visitors to /contact for custom pricing.`;

export async function generateChatResponse(
  userMessage: string,
  conversationHistory: ChatMessage[],
  userName?: string
): Promise<string> {
  if (!model) {
    return getRuleBasedResponse(userMessage, userName, conversationHistory.length);
  }

  try {
    const context = conversationHistory
      .slice(-10)
      .map((m) => `${m.role === 'user' ? 'User' : 'PropelusAI'}: ${m.content}`)
      .join('\n');

    const nameContext = userName
      ? `\nThe visitor's name is "${userName}". Use it naturally but not in every message.`
      : '';

    const exchangeCount = conversationHistory.filter(m => m.role === 'user').length;
    const qualifyingHint = exchangeCount >= 3 && exchangeCount <= 5
      ? '\nThis is a good time to naturally ask for their contact information so the team can prepare a proposal.'
      : '';

    const prompt = `${SYSTEM_PROMPT}${nameContext}${qualifyingHint}\n\n--- CONVERSATION ---\n${context}\n\nUser: ${userMessage}\n\nPropel:`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    if (!response || response.trim().length === 0) {
      return getRuleBasedResponse(userMessage, userName, conversationHistory.length);
    }

    return response.trim();
  } catch (error) {
    console.error('Gemini API error:', error);
    return getRuleBasedResponse(userMessage, userName, conversationHistory.length);
  }
}

export interface LeadScoreResult {
  score: number;
  qualification: 'hot' | 'warm' | 'cold';
}

export function computeLeadScore(
  conversationHistory: ChatMessage[]
): LeadScoreResult {
  const allUserMessages = conversationHistory
    .filter((m) => m.role === 'user')
    .map((m) => m.content.toLowerCase())
    .join(' ');

  let score = 0;

  // Service interest
  if (/\b(website|web dev|web build|site|landing page|saas)\b/.test(allUserMessages)) score += 10;
  if (/\b(mobile app|ios|android|app develop)\b/.test(allUserMessages)) score += 10;
  if (/\b(crm|customer relationship|lead management|pipeline)\b/.test(allUserMessages)) score += 10;
  if (/\b(automat|workflow|marketing automation)\b/.test(allUserMessages)) score += 10;

  // Timeline mentioned
  if (/\b(timeline|deadline|urgent|asap|this month|this quarter|next month|weeks?|months?)\b/.test(allUserMessages)) score += 10;

  // Budget mentioned
  if (/\b(budget|price|pricing|cost|invest|afford|quote|how much|rate)\b/.test(allUserMessages)) score += 15;

  // Contact info shared
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(allUserMessages)) score += 20;
  if (/(\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4})/.test(allUserMessages)) score += 15;

  // Company name mentioned
  if (/\b(my company|our company|we are|i work at|i run|our team|our business)\b/.test(allUserMessages)) score += 10;

  // Conversation depth
  const userMessages = conversationHistory.filter(m => m.role === 'user').length;
  if (userMessages >= 5) score += 10;

  let qualification: 'hot' | 'warm' | 'cold' = 'cold';
  if (score >= 50) qualification = 'hot';
  else if (score >= 20) qualification = 'warm';

  return { score, qualification };
}

// Backward-compatible wrapper
export async function qualifyLead(
  conversationHistory: ChatMessage[]
): Promise<'hot' | 'warm' | 'cold'> {
  return computeLeadScore(conversationHistory).qualification;
}

function getRuleBasedResponse(message: string, userName?: string, msgCount = 0): string {
  const lower = message.toLowerCase();
  const n = userName ? `, ${userName}` : '';

  if (/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/.test(lower)) {
    return `Hey${n}! Welcome to PropelusAI. What kind of project are you exploring right now?`;
  }
  if (/\b(website|web development|web build|site build|landing page)\b/.test(lower)) {
    return `We build AI powered websites with a typical timeline of 2-4 weeks${n}. Are you looking to build something new or redesign an existing site?`;
  }
  if (/\b(mobile app|ios|android|app develop)\b/.test(lower)) {
    return `We handle full mobile app development for iOS and Android, usually 8-12 weeks${n}. Do you have a specific app concept in mind?`;
  }
  if (/\b(crm|customer relationship|lead management|pipeline)\b/.test(lower)) {
    return `We build custom CRM systems tailored to your sales process${n}. Are you currently using any CRM, or would this be a fresh start?`;
  }
  if (/\b(saas|software as a service|platform)\b/.test(lower)) {
    return `We specialize in SaaS development from architecture to launch${n}. What problem would your platform solve?`;
  }
  if (/\b(price|pricing|cost|quote|budget|how much|rate|fee)\b/.test(lower)) {
    return `Pricing depends on project scope and complexity${n}. If you share a few details about what you need, our team can prepare a custom proposal within 24 hours. Would you like to do that?`;
  }
  if (/\b(service|what do you|what can you|build|develop)\b/.test(lower)) {
    return `We handle website development, mobile apps, CRM systems, SaaS builds, marketing automation, and AI integration${n}. Which area interests you most?`;
  }
  if (/\b(product|subscription|monthly)\b/.test(lower)) {
    return `We offer monthly subscription products including LinkedIn advertising, content creation, lead generation, and CRM analytics${n}. Which growth area are you focused on?`;
  }
  if (/\b(soul|ai engine|execution)\b/.test(lower)) {
    return `Soul is our upcoming AI execution engine that goes beyond reasoning to take autonomous action for businesses${n}. You can join the waitlist at propelusai.com/soul. Want me to tell you more about it?`;
  }
  if (/\b(contact|email|phone|call|reach|talk)\b/.test(lower)) {
    return `You can reach us at support@propelusai.com or visit propelusai.com/contact for a free consultation${n}. Our team responds within 24 hours.`;
  }

  if (msgCount >= 4) {
    return `Thanks for the details${n}. I would love to have our team prepare a custom proposal for you. Could you share your email address so we can send it over?`;
  }

  return `Thanks for your message${n}. To point you in the right direction, could you tell me what type of project you are looking for? For example, a website, mobile app, CRM, or marketing automation.`;
}

export const geminiService = {
  generateChatResponse,
  qualifyLead,
  computeLeadScore,
};
