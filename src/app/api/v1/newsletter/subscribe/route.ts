import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { NewsletterSubscriber } from '@/models/NewsletterSubscriber';
import { validate, newsletterSchema, ValidationError } from '@/lib/validators';
import { sendNewsletterWelcome } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const data = validate(newsletterSchema, body);
    const normalizedEmail = data.email.trim().toLowerCase();

    const existing = await NewsletterSubscriber.findOne({ email: normalizedEmail });

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json({ success: true, message: 'Already subscribed' });
      }
      existing.status = 'active';
      existing.name = data.name;
      existing.phone = data.phone;
      existing.unsubscribedAt = null;
      await existing.save();
      return NextResponse.json({ success: true, message: 'Re-subscribed successfully' });
    }

    await NewsletterSubscriber.create({
      name: data.name,
      email: normalizedEmail,
      phone: data.phone,
      source: data.source || 'api',
      status: 'active',
    });

    sendNewsletterWelcome(normalizedEmail).catch(() => {});

    return NextResponse.json(
      { success: true, message: 'Subscribed successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
