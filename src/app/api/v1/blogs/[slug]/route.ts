import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Blog } from '@/models/Blog';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    const blog = await Blog.findOneAndUpdate(
      { slug, status: 'published' },
      { $inc: { view_count: 1 } },
      { new: true }
    ).lean();

    if (!blog) {
      return NextResponse.json({ success: false, message: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    console.error('Get blog by slug error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
