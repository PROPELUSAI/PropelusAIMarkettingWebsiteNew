import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { NewsletterCampaign } from '@/models/NewsletterCampaign';
import { NewsletterSubscriber } from '@/models/NewsletterSubscriber';
import { withAuth, type JwtPayload } from '@/lib/auth';
import { validate, createCampaignSchema, ValidationError } from '@/lib/validators';
import { sendCampaignEmail } from '@/lib/email';

export const GET = withAuth(async (request: NextRequest) => {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    const [data, total] = await Promise.all([
      NewsletterCampaign.find().sort({ createdAt: -1 }).skip(offset).limit(limit).lean(),
      NewsletterCampaign.countDocuments(),
    ]);

    return NextResponse.json({ success: true, data: { data, total, page, limit } });
  } catch (error) {
    console.error('Get campaigns error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(async (request: NextRequest, user: JwtPayload) => {
  try {
    await connectDB();
    const body = await request.json();
    const data = validate(createCampaignSchema, body);

    const campaign = await NewsletterCampaign.create({
      subject: data.subject,
      bodyHtml: data.body_html,
      bodyText: data.body_text || null,
      status: 'sending',
      createdBy: user.userId,
    });

    const subscribers = await NewsletterSubscriber.find({ status: 'active' }).select('email').lean();
    const recipientEmails = subscribers.map((s) => s.email);

    campaign.recipientCount = recipientEmails.length;
    await campaign.save();

    const { sent, failed } = await sendCampaignEmail(
      recipientEmails,
      campaign.subject,
      campaign.bodyHtml,
      campaign.bodyText || undefined
    );

    campaign.status = failed === recipientEmails.length ? 'failed' : 'sent';
    campaign.sentAt = new Date();
    campaign.sentCount = sent;
    await campaign.save();

    return NextResponse.json(
      { success: true, data: campaign, message: `Campaign sent to ${sent} subscribers` },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
    console.error('Create campaign error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
});
