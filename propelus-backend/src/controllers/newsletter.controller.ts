/**
 * newsletter.controller.ts — Newsletter subscription and campaign endpoints.
 * Public: subscribe/unsubscribe with welcome email via Resend.
 * Admin: manage subscribers, create/send campaigns, view all campaigns.
 */
import { Request, Response } from 'express';import { NewsletterSubscriber } from '../db/mongodb/models/NewsletterSubscriber';
import { NewsletterCampaign } from '../db/mongodb/models/NewsletterCampaign';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { parsePagination, AuthRequest } from '../types';
import { emailService } from '../services/email.service';

/**
 * Subscribe to newsletter (public)
 */
export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, source } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  // Check if already subscribed
  const existing = await NewsletterSubscriber.findOne({ email: normalizedEmail });

  if (existing) {
    if (existing.status === 'active') {
      return ApiResponse.success(res, null, 'Already subscribed');
    }
    // Re-subscribe and update info
    existing.status = 'active';
    existing.name = name;
    existing.phone = phone;
    existing.unsubscribedAt = null;
    await existing.save();
    return ApiResponse.success(res, null, 'Re-subscribed successfully');
  }

  await NewsletterSubscriber.create({
    name,
    email: normalizedEmail,
    phone,
    source: source || 'api',
    status: 'active',
  });

  // Send welcome email (fire-and-forget with error logging)
  emailService.sendNewsletterWelcome(normalizedEmail).catch(() => {});

  ApiResponse.created(res, null, 'Subscribed successfully');
});

/**
 * Unsubscribe from newsletter (public)
 */
export const unsubscribe = asyncHandler(async (req: Request, res: Response) => {
  const normalizedEmail = req.body.email.trim().toLowerCase();

  const updated = await NewsletterSubscriber.findOneAndUpdate(
    { email: normalizedEmail },
    { status: 'unsubscribed', unsubscribedAt: new Date() },
    { new: true }
  );

  if (!updated) throw ApiError.notFound('Subscriber not found');
  ApiResponse.success(res, null, 'Unsubscribed successfully');
});

/**
 * Get all subscribers (admin)
 */
export const getSubscribers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, offset } = parsePagination(req.query);
  const { status } = req.query;

  const filter: Record<string, any> = {};
  if (status && typeof status === 'string') filter.status = status;

  const [data, total] = await Promise.all([
    NewsletterSubscriber.find(filter).sort({ createdAt: -1 }).skip(offset).limit(limit).lean(),
    NewsletterSubscriber.countDocuments(filter),
  ]);

  ApiResponse.paginated(res, data, page, limit, total);
});

/**
 * Create a newsletter campaign (admin)
 */
export const createCampaign = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { subject, body_html, body_text, scheduled_for } = req.body;

  const campaign = await NewsletterCampaign.create({
    subject,
    bodyHtml: body_html,
    bodyText: body_text || null,
    status: scheduled_for ? 'scheduled' : 'draft',
    scheduledFor: scheduled_for ? new Date(scheduled_for) : null,
    createdBy: req.user?.userId || null,
  });

  ApiResponse.created(res, campaign, 'Campaign created');
});

/**
 * Send a campaign (admin)
 */
export const sendCampaign = asyncHandler(async (req: AuthRequest, res: Response) => {
  const campaign = await NewsletterCampaign.findById(req.params.id);
  if (!campaign) throw ApiError.notFound('Campaign not found');
  if (campaign.status === 'sent') throw ApiError.badRequest('Campaign already sent');

  // Get active subscribers
  const subscribers = await NewsletterSubscriber.find({ status: 'active' }).select('email').lean();
  const recipientEmails = subscribers.map((s) => s.email);

  // Update campaign status
  campaign.status = 'sending';
  campaign.recipientCount = recipientEmails.length;
  await campaign.save();

  // Send emails
  const { sent, failed } = await emailService.sendCampaignEmail(
    recipientEmails,
    campaign.subject,
    campaign.bodyHtml,
    campaign.bodyText || undefined
  );

  // Update final status
  campaign.status = failed === recipientEmails.length ? 'failed' : 'sent';
  campaign.sentAt = new Date();
  campaign.sentCount = sent;
  await campaign.save();

  ApiResponse.success(res, { sent, failed, total: recipientEmails.length }, 'Campaign sent');
});

/**
 * Get all campaigns (admin)
 */
export const getCampaigns = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, offset } = parsePagination(req.query);

  const [data, total] = await Promise.all([
    NewsletterCampaign.find().sort({ createdAt: -1 }).skip(offset).limit(limit).lean(),
    NewsletterCampaign.countDocuments(),
  ]);

  ApiResponse.paginated(res, data, page, limit, total);
});
