import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Testimonial } from '@/models/Testimonial';
import { withAuth, type JwtPayload } from '@/lib/auth';

export const GET = withAuth(
  async (_request: NextRequest, _user: JwtPayload, context?: { params: Record<string, string> }) => {
    try {
      await connectDB();
      const id = context?.params?.id;
      const testimonial = await Testimonial.findById(id).lean();
      if (!testimonial) {
        return NextResponse.json({ success: false, message: 'Testimonial not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: testimonial });
    } catch (error) {
      console.error('Get testimonial error:', error);
      return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
  }
);

export const PATCH = withAuth(
  async (request: NextRequest, _user: JwtPayload, context?: { params: Record<string, string> }) => {
    try {
      await connectDB();
      const id = context?.params?.id;
      const body = await request.json();

      const updateData: Record<string, unknown> = {};
      if (body.status) updateData.status = body.status;
      if (body.featuredOrder !== undefined) updateData.featuredOrder = body.featuredOrder;

      const updated = await Testimonial.findByIdAndUpdate(id, updateData, { new: true }).lean();
      if (!updated) {
        return NextResponse.json({ success: false, message: 'Testimonial not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updated, message: 'Testimonial updated' });
    } catch (error) {
      console.error('Update testimonial error:', error);
      return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
  }
);

export const DELETE = withAuth(
  async (_request: NextRequest, _user: JwtPayload, context?: { params: Record<string, string> }) => {
    try {
      await connectDB();
      const id = context?.params?.id;
      const deleted = await Testimonial.findByIdAndDelete(id);
      if (!deleted) {
        return NextResponse.json({ success: false, message: 'Testimonial not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'Testimonial deleted' });
    } catch (error) {
      console.error('Delete testimonial error:', error);
      return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
  }
);
