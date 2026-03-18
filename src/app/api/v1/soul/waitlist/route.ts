import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SoulWaitlist from '@/models/SoulWaitlist';
import { soulWaitlistSchema, validate, ValidationError } from '@/lib/validators';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const data = validate(soulWaitlistSchema, body);

    const existing = await SoulWaitlist.findOne({ email: data.email });
    if (existing) {
      return NextResponse.json(
        { success: true, message: 'You are already on the waitlist. We will reach out soon.' },
        { status: 200 }
      );
    }

    await SoulWaitlist.create(data);

    return NextResponse.json(
      { success: true, message: 'You have been added to the waitlist. We will notify you when Soul launches.' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    console.error('Soul waitlist error:', error);
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 });
  }
}
