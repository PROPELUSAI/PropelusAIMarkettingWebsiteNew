import { Request, Response } from 'express';
import { ContactSubmission } from '../db/mongodb/models/ContactSubmission';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { parsePagination, AuthRequest } from '../types';
import { emailService } from '../services/email.service';
import { analyticsService } from '../services/analytics.service';

/**
 * Submit a new contact form (public)
 */
export const submitContact = asyncHandler(async (req: Request, res: Response) => {
  const { full_name, company_name, email, country, mobile_number, interest, scheduled_time, description, promo_code, affiliate_code } = req.body;

  const submission = await ContactSubmission.create({
    fullName: full_name,
    companyName: company_name || null,
    email,
    country,
    mobileNumber: mobile_number || null,
    interest: interest || null,
    scheduledTime: new Date(scheduled_time),
    description: description || null,
    promoCode: promo_code || null,
    affiliateCode: affiliate_code || null,
  });

  // Fire-and-forget: send notification email + track analytics
  emailService.sendContactNotification({ full_name, email, company_name, country, scheduled_time, description }).catch(() => {});
  analyticsService.trackFormSubmission('contact', { email, country });

  ApiResponse.created(res, { id: submission._id }, 'Contact submission received successfully');
});

/**
 * Get all contacts with pagination & filters (admin)
 */
export const getContacts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, offset } = parsePagination(req.query);
  const { status, priority, search } = req.query;

  const filter: Record<string, any> = {};
  if (status && typeof status === 'string') filter.leadStatus = status;
  if (priority && typeof priority === 'string') filter.priority = priority;
  if (search && typeof search === 'string') {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const [data, total] = await Promise.all([
    ContactSubmission.find(filter).sort({ createdAt: -1 }).skip(offset).limit(limit).lean(),
    ContactSubmission.countDocuments(filter),
  ]);

  ApiResponse.paginated(res, data, page, limit, total);
});

/**
 * Get single contact by ID (admin)
 */
export const getContact = asyncHandler(async (req: Request, res: Response) => {
  const contact = await ContactSubmission.findById(req.params.id).lean();
  if (!contact) throw ApiError.notFound('Contact not found');
  ApiResponse.success(res, contact);
});

/**
 * Update a contact (admin)
 */
export const updateContact = asyncHandler(async (req: AuthRequest, res: Response) => {
  const updates = req.body;

  const updateData: Record<string, any> = {};
  if (updates.lead_status) updateData.leadStatus = updates.lead_status;
  if (updates.priority) updateData.priority = updates.priority;
  if (updates.assigned_to !== undefined) updateData.assignedTo = updates.assigned_to;
  if (updates.admin_notes !== undefined) updateData.adminNotes = updates.admin_notes;
  if (updates.response_sent !== undefined) updateData.responseSent = updates.response_sent;
  if (updates.response_date) updateData.responseDate = new Date(updates.response_date);
  if (updates.response_method !== undefined) updateData.responseMethod = updates.response_method;
  if (updates.follow_up_date !== undefined) updateData.followUpDate = updates.follow_up_date ? new Date(updates.follow_up_date) : null;
  if (req.user) updateData.updatedBy = req.user.email;

  const updated = await ContactSubmission.findByIdAndUpdate(req.params.id, updateData, { new: true }).lean();
  if (!updated) throw ApiError.notFound('Contact not found');
  ApiResponse.success(res, updated, 'Contact updated');
});

/**
 * Delete a contact (admin)
 */
export const deleteContact = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await ContactSubmission.findByIdAndDelete(req.params.id);
  if (!deleted) throw ApiError.notFound('Contact not found');
  ApiResponse.success(res, null, 'Contact deleted');
});
