import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { NewsletterSubscriber } from '@/models/NewsletterSubscriber';
import { ChatConversation } from '@/models/ChatConversation';
import { validate, newsletterSchema, ValidationError } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const data = validate(newsletterSchema, body);
    const normalizedEmail = data.email.trim().toLowerCase();

    const existing = await NewsletterSubscriber.findOne({ email: normalizedEmail });

    if (existing) {
      if (existing.status !== 'active') {
        existing.status = 'active';
        existing.name = data.name;
        existing.phone = data.phone;
        existing.unsubscribedAt = null;
        await existing.save();
      }
    } else {
      await NewsletterSubscriber.create({
        name: data.name,
        email: normalizedEmail,
        phone: data.phone,
        source: 'chatbot',
        status: 'active',
      });
    }

    if (data.sessionId) {
      try {
        let conversation = await ChatConversation.findOne({ sessionId: data.sessionId });
        if (!conversation) {
          conversation = new ChatConversation({
            sessionId: data.sessionId,
            messages: [],
            metadata: {
              userName: data.name?.trim() || null,
              userEmail: normalizedEmail,
              userPhone: data.phone || null,
              leadCapturedAt: new Date().toISOString(),
            },
          });
        } else {
          conversation.metadata = {
            ...conversation.metadata,
            userName: data.name?.trim() || (conversation.metadata as Record<string, string>)?.userName || null,
            userEmail: normalizedEmail,
            userPhone: data.phone || (conversation.metadata as Record<string, string>)?.userPhone || null,
            leadCapturedAt: (conversation.metadata as Record<string, string>)?.leadCapturedAt || new Date().toISOString(),
          };
        }
        await conversation.save();
      } catch (err) {
        console.error('Failed to save chatbot lead to conversation:', err);
      }
    }

    return NextResponse.json({ success: true, message: 'You have been subscribed to our newsletter!' });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
    console.error('Chatbot subscribe error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
