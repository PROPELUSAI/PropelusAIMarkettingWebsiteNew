import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ContactSubmission } from '@/models/ContactSubmission';
import { validate, contactSchema, ValidationError } from '@/lib/validators';
import { sendContactNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const data = validate(contactSchema, body);

    const submission = await ContactSubmission.create({
      fullName: data.full_name,
      companyName: data.company_name || null,
      email: data.email,
      country: data.country,
      mobileNumber: data.mobile_number || null,
      interest: data.interest || null,
      linkedinUrl: data.linkedin_url || null,
      teamSize: data.team_size || null,
      scheduledTime: new Date(data.scheduled_time),
      description: data.description || null,
      promoCode: data.promo_code || null,
      affiliateCode: data.affiliate_code || null,
    });

    sendContactNotification({
      full_name: data.full_name,
      email: data.email,
      company_name: data.company_name || undefined,
      country: data.country,
      scheduled_time: data.scheduled_time,
      description: data.description || undefined,
    }).catch(() => {});

    return NextResponse.json(
      { success: true, data: { id: submission._id }, message: 'Contact submission received successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
    console.error('Contact submission error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
