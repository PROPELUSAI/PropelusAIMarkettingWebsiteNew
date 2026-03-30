import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Blog } from '@/models/Blog';
import { withAuth, type JwtPayload } from '@/lib/auth';
import { submitToIndexNow } from '@/lib/indexnow';

export const GET = withAuth(
  async (_request: NextRequest, _user: JwtPayload, context?: { params: Record<string, string> }) => {
    try {
      await connectDB();
      const id = context?.params?.id;
      const blog = await Blog.findById(id).lean();
      if (!blog) {
        return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: blog });
    } catch (error) {
      console.error('Get blog error:', error);
      return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
  }
);

export const PUT = withAuth(
  async (request: NextRequest, _user: JwtPayload, context?: { params: Record<string, string> }) => {
    try {
      await connectDB();
      const id = context?.params?.id;
      const body = await request.json();

      const { _id, id: bodyId, __v, created_at, createdAt, ...updateData } = body;

      if (updateData.status === 'published' && !updateData.publish_date) {
        updateData.publish_date = new Date();
      }

      const updated = await Blog.findByIdAndUpdate(id, updateData, { new: true }).lean();
      if (!updated) {
        return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 });
      }
      // Notify search engines when published blog is updated
      if (updated.status === 'published' && updated.slug) {
        submitToIndexNow(`/blogs/${updated.slug}`).catch(() => {});
      }

      return NextResponse.json({ success: true, data: updated, message: 'Blog updated' });
    } catch (error) {
      console.error('Update blog error:', error);
      return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
  }
);

export const DELETE = withAuth(
  async (_request: NextRequest, _user: JwtPayload, context?: { params: Record<string, string> }) => {
    try {
      await connectDB();
      const id = context?.params?.id;
      const deleted = await Blog.findByIdAndDelete(id);
      if (!deleted) {
        return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'Blog deleted' });
    } catch (error) {
      console.error('Delete blog error:', error);
      return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
  }
);
