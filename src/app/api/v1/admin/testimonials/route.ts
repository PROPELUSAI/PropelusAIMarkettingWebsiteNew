import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Testimonial } from '@/models/Testimonial';
import { withAuth } from '@/lib/auth';

export const GET = withAuth(async (request: NextRequest) => {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;
    const status = searchParams.get('status');

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const [data, total] = await Promise.all([
      Testimonial.find(filter).sort({ createdAt: -1 }).skip(offset).limit(limit).lean(),
      Testimonial.countDocuments(filter),
    ]);

    return NextResponse.json({ success: true, data: { data, total, page, limit } });
  } catch (error) {
    console.error('Get admin testimonials error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
});
