import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Testimonial } from '@/models/Testimonial';
import { validate, testimonialSchema, ValidationError } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const data = validate(testimonialSchema, body);

    const result = await Testimonial.create({
      fullName: data.full_name.trim(),
      email: data.email.trim().toLowerCase(),
      testimonial: data.testimonial.trim(),
      mobileNumber: data.mobile_number || null,
      rating: data.rating || null,
      status: 'pending',
    });

    return NextResponse.json(
      { success: true, data: result, message: 'Testimonial submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
    console.error('Testimonial submit error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
