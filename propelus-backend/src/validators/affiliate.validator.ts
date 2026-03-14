import { z } from 'zod';

export const registerAffiliateSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(255),
  email: z.string().email('Invalid email format'),
  mobile_number: z.string().min(1, 'Mobile number is required').max(50),
  description: z.string().min(50, 'Description must be at least 50 characters'),
});

export const approveAffiliateSchema = z.object({
  commission_rate: z.number().min(0).max(100).optional(),
  admin_notes: z.string().optional(),
});

export const rejectAffiliateSchema = z.object({
  admin_notes: z.string().optional(),
});

export type RegisterAffiliateInput = z.infer<typeof registerAffiliateSchema>;
export type ApproveAffiliateInput = z.infer<typeof approveAffiliateSchema>;
