import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminUser } from '../db/mongodb/models/AdminUser';
import { ContactSubmission } from '../db/mongodb/models/ContactSubmission';
import { Testimonial } from '../db/mongodb/models/Testimonial';
import { AffiliateRegistration } from '../db/mongodb/models/AffiliateRegistration';
import { NewsletterSubscriber } from '../db/mongodb/models/NewsletterSubscriber';
import env from '../config/env';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { AuthRequest, JwtPayload } from '../types';

/**
 * Admin login
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await AdminUser.findOne({ email: email.toLowerCase() });
  if (!user) throw ApiError.unauthorized('Invalid email or password');
  if (!user.isActive) throw ApiError.forbidden('Account is disabled');

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw ApiError.unauthorized('Invalid email or password');

  // Generate JWT
  const payload: JwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role as any,
  };

  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  ApiResponse.success(res, {
    token,
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  }, 'Login successful');
});

/**
 * Get admin profile
 */
export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();

  const user = await AdminUser.findById(req.user.userId)
    .select('email fullName role lastLogin createdAt')
    .lean();

  if (!user) throw ApiError.notFound('User not found');
  ApiResponse.success(res, user);
});

/**
 * Update admin profile
 */
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const { full_name, email } = req.body;

  const updates: Record<string, any> = {};
  if (full_name) updates.fullName = full_name;
  if (email) updates.email = email.toLowerCase();

  const updated = await AdminUser.findByIdAndUpdate(req.user.userId, updates, { new: true })
    .select('email fullName role')
    .lean();

  if (!updated) throw ApiError.notFound('User not found');
  ApiResponse.success(res, updated, 'Profile updated');
});

/**
 * Change password
 */
export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const { current_password, new_password } = req.body;

  const user = await AdminUser.findById(req.user.userId);
  if (!user) throw ApiError.notFound('User not found');

  const isMatch = await bcrypt.compare(current_password, user.passwordHash);
  if (!isMatch) throw ApiError.badRequest('Current password is incorrect');

  user.passwordHash = await bcrypt.hash(new_password, env.BCRYPT_ROUNDS);
  await user.save();

  ApiResponse.success(res, null, 'Password changed successfully');
});

/**
 * Dashboard stats (admin)
 */
export const getDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const [contacts, testimonials, affiliates, subscriberCount] = await Promise.all([
    ContactSubmission.aggregate([{ $group: { _id: '$leadStatus', count: { $sum: 1 } } }]),
    Testimonial.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    AffiliateRegistration.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    NewsletterSubscriber.countDocuments(),
  ]);

  ApiResponse.success(res, {
    contacts: Object.fromEntries(contacts.map((c: any) => [c._id, c.count])),
    testimonials: Object.fromEntries(testimonials.map((t: any) => [t._id, t.count])),
    affiliates: Object.fromEntries(affiliates.map((a: any) => [a._id, a.count])),
    newsletterSubscribers: subscriberCount,
  });
});
