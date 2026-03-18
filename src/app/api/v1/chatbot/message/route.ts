import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ChatConversation, type IChatMessage } from '@/models/ChatConversation';
import { ContactSubmission } from '@/models/ContactSubmission';
import { validate, chatMessageSchema, ValidationError } from '@/lib/validators';
import { generateChatResponse, computeLeadScore } from '@/lib/gemini';
import { sendContactNotification, sendChatNotification } from '@/lib/email';

// Regex patterns for detecting contact info in messages
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4})/;
const LINKEDIN_REGEX = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/i;
const NAME_REGEX = /(?:my name is|i am|i'm|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i;

interface ExtractedContact {
  name?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
}

function extractContactInfo(messages: { role: string; content: string }[]): ExtractedContact {
  const userMessages = messages
    .filter((m) => m.role === 'user')
    .map((m) => m.content);
  const allText = userMessages.join(' ');

  const contact: ExtractedContact = {};

  const emailMatch = allText.match(EMAIL_REGEX);
  if (emailMatch) contact.email = emailMatch[0].toLowerCase();

  const phoneMatch = allText.match(PHONE_REGEX);
  if (phoneMatch) contact.phone = phoneMatch[0];

  const linkedinMatch = allText.match(LINKEDIN_REGEX);
  if (linkedinMatch) contact.linkedinUrl = `https://${linkedinMatch[0]}`;

  // Check each message for name patterns
  for (const msg of userMessages) {
    const nameMatch = msg.match(NAME_REGEX);
    if (nameMatch && nameMatch[1]) {
      contact.name = nameMatch[1].trim();
      break;
    }
  }

  return contact;
}

async function createLeadFromChat(
  contact: ExtractedContact,
  sessionId: string,
  pageUrl?: string,
  existingUserName?: string,
  existingUserEmail?: string
): Promise<void> {
  const email = contact.email || existingUserEmail;
  if (!email) return;

  // Check if a submission from this email + chatbot source already exists
  const existing = await ContactSubmission.findOne({ email, interest: 'chatbot-lead' });
  if (existing) return;

  const name = contact.name || existingUserName || 'Chat Visitor';

  try {
    await ContactSubmission.create({
      fullName: name,
      email,
      country: 'Not specified',
      mobileNumber: contact.phone || null,
      linkedinUrl: contact.linkedinUrl || null,
      interest: 'chatbot-lead',
      description: `Lead captured from chatbot conversation. Session: ${sessionId}. Page: ${pageUrl || 'unknown'}`,
      scheduledTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
      leadStatus: 'open',
      priority: 'high',
    });

    sendContactNotification({
      full_name: name,
      email,
      country: 'Chatbot Lead',
      scheduled_time: new Date().toISOString(),
      description: `New lead captured from chatbot conversation (Session: ${sessionId}). Phone: ${contact.phone || 'N/A'}. LinkedIn: ${contact.linkedinUrl || 'N/A'}. Page: ${pageUrl || 'N/A'}`,
    }).catch(() => {});
  } catch (err) {
    console.error('Failed to create chatbot lead:', err);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const data = validate(chatMessageSchema, body);
    const sessionId = data.session_id || data.sessionId!;
    const message = data.message;
    const userName = data.userName;
    const userEmail = data.userEmail;

    let conversation = await ChatConversation.findOne({ sessionId });

    if (!conversation) {
      conversation = new ChatConversation({
        sessionId,
        messages: [],
        metadata: {
          userName: userName || null,
          userEmail: userEmail || null,
          pageUrl: body.pageUrl || null,
        },
      });

      // Notify admin when a new chat conversation starts
      if (userName && userEmail) {
        sendChatNotification({
          userName,
          userEmail,
          message,
          sessionId,
          pageUrl: body.pageUrl,
        }).catch(() => {});
      }
    } else {
      const meta = conversation.metadata || {};
      if (userName && !meta.userName) meta.userName = userName;
      if (userEmail && !meta.userEmail) meta.userEmail = userEmail;
      if (body.pageUrl && !meta.pageUrl) meta.pageUrl = body.pageUrl;
      conversation.metadata = meta;
    }

    const resolvedName = userName || (conversation.metadata as Record<string, string>)?.userName || undefined;

    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    const response = await generateChatResponse(
      message,
      conversation.messages.map((m: IChatMessage) => ({ role: m.role, content: m.content })),
      resolvedName
    );

    conversation.messages.push({
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    });

    // Compute lead score after every message
    const { score, qualification } = computeLeadScore(
      conversation.messages.map((m: IChatMessage) => ({ role: m.role, content: m.content }))
    );
    conversation.leadScore = qualification;
    if (!conversation.metadata) conversation.metadata = {};
    (conversation.metadata as Record<string, unknown>).numericScore = score;

    if (score >= 20 && !conversation.leadQualified) {
      conversation.leadQualified = true;
    }

    await conversation.save();

    // Detect contact info in conversation and create lead if found
    const contactInfo = extractContactInfo(
      conversation.messages.map((m: IChatMessage) => ({ role: m.role, content: m.content }))
    );
    if (contactInfo.email || contactInfo.phone) {
      const meta = conversation.metadata as Record<string, string>;
      createLeadFromChat(
        contactInfo,
        sessionId,
        meta?.pageUrl,
        meta?.userName,
        meta?.userEmail
      ).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      data: {
        reply: response,
        sessionId,
        leadScore: conversation.leadScore,
      },
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
    console.error('Chatbot message error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
