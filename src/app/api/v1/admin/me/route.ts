import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { AdminUser } from '@/models/AdminUser';
import { withAuth, type JwtPayload } from '@/lib/auth';

export const GET = withAuth(async (_request: NextRequest, user: JwtPayload) => {
  try {
    await connectDB();
    const adminUser = await AdminUser.findById(user.userId)
      .select('email fullName role lastLogin createdAt')
      .lean();

    if (!adminUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: adminUser });
  } catch (error) {
    console.error('Get me error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
});
