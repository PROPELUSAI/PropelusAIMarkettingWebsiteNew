import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Testimonial } from '@/models/Testimonial';

export async function GET() {
  try {
    await connectDB();
    const data = await Testimonial.find({ status: 'approved' })
      .select('fullName testimonial rating createdAt')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Get testimonials error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
