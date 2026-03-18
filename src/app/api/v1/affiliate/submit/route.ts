import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { AffiliateRegistration } from '@/models/AffiliateRegistration';
import { validate, affiliateSchema, ValidationError } from '@/lib/validators';
import { sendAffiliateConfirmation } from '@/lib/email';

function generateAffiliateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'PAI-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const data = validate(affiliateSchema, body);

    const existing = await AffiliateRegistration.findOne({
      email: data.email.toLowerCase(),
    }).lean();
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'An affiliate registration with this email already exists' },
        { status: 409 }
      );
    }

    const registration = await AffiliateRegistration.create({
      fullName: data.full_name.trim(),
      email: data.email.trim().toLowerCase(),
      mobileNumber: data.mobile_number.trim(),
      description: data.description.trim(),
      hasNetwork: data.has_network || null,
      networkType: data.network_type || null,
      industry: data.industry || null,
      interestedServices: data.interested_services || [],
      status: 'pending',
      affiliateCode: generateAffiliateCode(),
    });

    sendAffiliateConfirmation(registration.email, registration.fullName).catch(() => {});

    return NextResponse.json(
      { success: true, data: registration, message: 'Affiliate registration submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
    console.error('Affiliate submit error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
