import { Request, Response } from 'express';
import { Testimonial } from '../db/mongodb/models/Testimonial';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { parsePagination, AuthRequest } from '../types';
import { emailService } from '../services/email.service';

/**
 * Submit a testimonial (public)
 */
export const submitTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const { full_name, email, testimonial, mobile_number, rating } = req.body;

  const result = await Testimonial.create({
    fullName: full_name.trim(),
    email: email.trim().toLowerCase(),
    testimonial: testimonial.trim(),
    mobileNumber: mobile_number || null,
    rating: rating || null,
    status: 'pending',
  });

  ApiResponse.created(res, result, 'Testimonial submitted successfully');
});

/**
 * Get approved testimonials (public)
 */
export const getApproved = asyncHandler(async (_req: Request, res: Response) => {
  const data = await Testimonial.find({ status: 'approved' })
    .select('fullName testimonial rating createdAt')
    .sort({ createdAt: -1 })
    .lean();

  ApiResponse.success(res, data);
});

/**
 * Get all testimonials with filter (admin)
 */
export const getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, offset } = parsePagination(req.query);
  const { status } = req.query;

  const filter: Record<string, any> = {};
  if (status && typeof status === 'string') filter.status = status;

  const [data, total] = await Promise.all([
    Testimonial.find(filter).sort({ createdAt: -1 }).skip(offset).limit(limit).lean(),
    Testimonial.countDocuments(filter),
  ]);

  ApiResponse.paginated(res, data, page, limit, total);
});

/**
 * Approve a testimonial (admin)
 */
export const approve = asyncHandler(async (req: Request, res: Response) => {
  const updated = await Testimonial.findByIdAndUpdate(
    req.params.id,
    { status: 'approved' },
    { new: true }
  ).lean();

  if (!updated) throw ApiError.notFound('Testimonial not found');

  // Send approval email (fire-and-forget)
  emailService.sendTestimonialApprovalEmail(updated.email, updated.fullName).catch(() => {});

  ApiResponse.success(res, updated, 'Testimonial approved');
});

/**
 * Reject a testimonial (admin)
 */
export const reject = asyncHandler(async (req: Request, res: Response) => {
  const updated = await Testimonial.findByIdAndUpdate(
    req.params.id,
    { status: 'rejected' },
    { new: true }
  ).lean();

  if (!updated) throw ApiError.notFound('Testimonial not found');
  ApiResponse.success(res, updated, 'Testimonial rejected');
});

/**
 * Delete a testimonial (admin)
 */
export const deleteTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await Testimonial.findByIdAndDelete(req.params.id);
  if (!deleted) throw ApiError.notFound('Testimonial not found');
  ApiResponse.success(res, null, 'Testimonial deleted');
});
