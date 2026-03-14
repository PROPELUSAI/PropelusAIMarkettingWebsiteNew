import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ChatConversation } from '@/models/ChatConversation';
import { withAuth, type JwtPayload } from '@/lib/auth';

export const GET = withAuth(
  async (_request: NextRequest, _user: JwtPayload, context?: { params: Record<string, string> }) => {
    try {
      await connectDB();
      const id = context?.params?.id;
      const chat = await ChatConversation.findById(id).lean();
      if (!chat) {
        return NextResponse.json({ success: false, message: 'Chat not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: chat });
    } catch (error) {
      console.error('Get chat error:', error);
      return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
  }
);
