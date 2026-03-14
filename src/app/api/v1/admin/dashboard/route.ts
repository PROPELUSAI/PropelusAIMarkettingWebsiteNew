import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ContactSubmission } from '@/models/ContactSubmission';
import { Testimonial } from '@/models/Testimonial';
import { AffiliateRegistration } from '@/models/AffiliateRegistration';
import { NewsletterSubscriber } from '@/models/NewsletterSubscriber';
import { ChatConversation } from '@/models/ChatConversation';
import { Blog } from '@/models/Blog';
import { withAuth } from '@/lib/auth';

export const GET = withAuth(async (_request: NextRequest) => {
  try {
    await connectDB();

    const [contacts, testimonials, affiliates, subscriberCount, chatCount, blogCount, recentContacts] =
      await Promise.all([
        ContactSubmission.aggregate([{ $group: { _id: '$leadStatus', count: { $sum: 1 } } }]),
        Testimonial.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        AffiliateRegistration.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        NewsletterSubscriber.countDocuments(),
        ChatConversation.countDocuments(),
        Blog.countDocuments(),
        ContactSubmission.find().sort({ createdAt: -1 }).limit(5).lean(),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        contacts: Object.fromEntries(contacts.map((c: { _id: string; count: number }) => [c._id, c.count])),
        testimonials: Object.fromEntries(testimonials.map((t: { _id: string; count: number }) => [t._id, t.count])),
        affiliates: Object.fromEntries(affiliates.map((a: { _id: string; count: number }) => [a._id, a.count])),
        newsletterSubscribers: subscriberCount,
        totalChats: chatCount,
        totalBlogs: blogCount,
        recentContacts,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
});
