import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ChatConversation, type IChatMessage } from '@/models/ChatConversation';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    await connectDB();
    const { sessionId } = await params;

    const conversation = await ChatConversation.findOne({ sessionId });
    const messages =
      conversation?.messages?.map((m: IChatMessage) => ({
        role: m.role,
        content: m.content,
      })) || [];

    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error('Get chat history error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
