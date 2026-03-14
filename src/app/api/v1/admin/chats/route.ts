import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ChatConversation } from '@/models/ChatConversation';
import { withAuth } from '@/lib/auth';

export const GET = withAuth(async (request: NextRequest) => {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    const [data, total] = await Promise.all([
      ChatConversation.find()
        .sort({ updatedAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean()
        .then((conversations) =>
          conversations.map((c) => ({
            _id: c._id,
            sessionId: c.sessionId,
            userName: (c.metadata as Record<string, string>)?.userName || null,
            userEmail: (c.metadata as Record<string, string>)?.userEmail || null,
            messageCount: c.messages?.length || 0,
            leadScore: c.leadScore,
            leadQualified: c.leadQualified,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
          }))
        ),
      ChatConversation.countDocuments(),
    ]);

    return NextResponse.json({ success: true, data: { data, total, page, limit } });
  } catch (error) {
    console.error('Get chats error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
});
