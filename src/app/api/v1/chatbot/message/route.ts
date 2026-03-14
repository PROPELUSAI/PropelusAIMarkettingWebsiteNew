import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ChatConversation, type IChatMessage } from '@/models/ChatConversation';
import { validate, chatMessageSchema, ValidationError } from '@/lib/validators';
import { generateChatResponse, qualifyLead } from '@/lib/gemini';

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
        },
      });
    } else {
      const meta = conversation.metadata || {};
      if (userName && !meta.userName) meta.userName = userName;
      if (userEmail && !meta.userEmail) meta.userEmail = userEmail;
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

    if (conversation.messages.length >= 6 && !conversation.leadQualified) {
      const score = await qualifyLead(
        conversation.messages.map((m: IChatMessage) => ({ role: m.role, content: m.content }))
      );
      conversation.leadScore = score;
      conversation.leadQualified = true;
    }

    await conversation.save();

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
