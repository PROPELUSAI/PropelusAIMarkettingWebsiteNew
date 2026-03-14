import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Blog } from '@/models/Blog';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const filter: Record<string, unknown> = { status: 'published' };
    if (category) filter.category = { $regex: new RegExp(category, 'i') };
    if (featured === 'true') filter.is_featured = true;

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .select('title subtitle slug category tags featured_image is_featured status publish_date created_at seo_title meta_description read_time view_count author')
        .sort({ publish_date: -1, created_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: { blogs, total, page, limit },
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
