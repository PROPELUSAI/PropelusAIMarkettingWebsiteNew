/**
 * affiliate.controller.ts — Affiliate program registration and management.
 * Public: register with auto-generated affiliate code.
 * Admin: list, approve (with commission rate), reject, and update status.
 */
import { Request, Response } from 'express';import { AffiliateRegistration } from '../db/mongodb/models/AffiliateRegistration';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { parsePagination, AuthRequest } from '../types';
import { emailService } from '../services/email.service';

/**
 * Generate a unique affiliate code
 */
function generateAffiliateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'PAI-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Register as an affiliate (public)
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { full_name, email, mobile_number, description } = req.body;

  // Check if already registered
  const existing = await AffiliateRegistration.findOne({ email: email.toLowerCase() }).lean();
  if (existing) {
    throw ApiError.conflict('An affiliate registration with this email already exists');
  }

  const registration = await AffiliateRegistration.create({
    fullName: full_name.trim(),
    email: email.trim().toLowerCase(),
    mobileNumber: mobile_number.trim(),
    description: description.trim(),
    status: 'pending',
    affiliateCode: generateAffiliateCode(),
  });

  ApiResponse.created(res, registration, 'Affiliate registration submitted successfully');
});

/**
 * Get all registrations (admin)
 */
export const getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, offset } = parsePagination(req.query);
  const { status } = req.query;

  const filter: Record<string, any> = {};
  if (status && typeof status === 'string') filter.status = status;

  const [data, total] = await Promise.all([
    AffiliateRegistration.find(filter).sort({ createdAt: -1 }).skip(offset).limit(limit).lean(),
    AffiliateRegistration.countDocuments(filter),
  ]);

  ApiResponse.paginated(res, data, page, limit, total);
});

/**
 * Approve an affiliate (admin)
 */
export const approveAffiliate = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { commission_rate, admin_notes } = req.body;
  const affiliateCode = generateAffiliateCode();

  const updated = await AffiliateRegistration.findByIdAndUpdate(
    req.params.id,
    {
      status: 'approved',
      affiliateCode,
      commissionRate: commission_rate || 10.0,
      adminNotes: admin_notes || null,
      reviewedAt: new Date(),
      reviewedBy: req.user?.email || null,
    },
    { new: true }
  ).lean();

  if (!updated) throw ApiError.notFound('Affiliate registration not found');

  // Send approval email with code
  emailService.sendAffiliateApprovalEmail(updated.email, affiliateCode).catch(() => {});

  ApiResponse.success(res, updated, 'Affiliate approved');
});

/**
 * Reject an affiliate (admin)
 */
export const rejectAffiliate = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { admin_notes } = req.body;

  const updated = await AffiliateRegistration.findByIdAndUpdate(
    req.params.id,
    {
      status: 'rejected',
      adminNotes: admin_notes || null,
      reviewedAt: new Date(),
      reviewedBy: req.user?.email || null,
    },
    { new: true }
  ).lean();

  if (!updated) throw ApiError.notFound('Affiliate registration not found');
  ApiResponse.success(res, updated, 'Affiliate rejected');
});

/**
 * Update affiliate status (admin)
 */
export const updateStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status } = req.body;

  const updated = await AffiliateRegistration.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).lean();

  if (!updated) throw ApiError.notFound('Affiliate registration not found');
  ApiResponse.success(res, updated, 'Status updated');
});
