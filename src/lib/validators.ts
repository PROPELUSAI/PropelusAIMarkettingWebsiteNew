import { z } from 'zod';

// ── Contact ──

export const contactSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(255),
  company_name: z.string().max(255).optional().nullable(),
  email: z.string().email('Invalid email format'),
  country: z.string().min(1, 'Country is required').max(100),
  mobile_number: z.string().max(50).optional().nullable(),
  interest: z.string().max(100).optional().nullable(),
  scheduled_time: z.string().refine(
    (val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) return false;
      const minTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      return date >= minTime;
    },
    { message: 'Scheduled time must be a valid date at least 24 hours from now' }
  ),
  description: z.string().max(5000).optional().nullable(),
  promo_code: z.string().max(50).optional().nullable(),
  affiliate_code: z.string().max(50).optional().nullable(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const updateContactSchema = z.object({
  lead_status: z
    .enum(['open', 'in_progress', 'contacted', 'qualified', 'converted', 'closed', 'lost', 'spam'])
    .optional(),
  priority: z.enum(['high', 'medium', 'low']).optional(),
  assigned_to: z.string().max(255).optional().nullable(),
  admin_notes: z.string().optional().nullable(),
  response_sent: z.boolean().optional(),
  response_date: z.string().datetime().optional().nullable(),
  response_method: z.enum(['email', 'phone', 'meeting', 'chat', 'other']).optional().nullable(),
  follow_up_date: z.string().datetime().optional().nullable(),
  updated_by: z.string().max(255).optional().nullable(),
});

export type UpdateContactInput = z.infer<typeof updateContactSchema>;

// ── Newsletter ──

export const newsletterSchema = z.object({
  name: z.string().max(255).optional().default(''),
  email: z.string().email('Invalid email format'),
  phone: z.string().max(50).optional().default(''),
  source: z.enum(['footer', 'chatbot', 'popup', 'api']).optional().default('api'),
  sessionId: z.string().min(1).optional(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const createCampaignSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(255),
  body_html: z.string().min(1, 'HTML body is required'),
  body_text: z.string().optional(),
  scheduled_for: z.string().datetime().optional(),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;

// ── Affiliate ──

export const affiliateSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(255),
  email: z.string().email('Invalid email format'),
  mobile_number: z.string().min(1, 'Mobile number is required').max(50),
  description: z.string().min(50, 'Description must be at least 50 characters'),
});

export type AffiliateInput = z.infer<typeof affiliateSchema>;

// ── Testimonial ──

export const testimonialSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(255),
  email: z.string().email('Invalid email format'),
  testimonial: z
    .string()
    .min(20, 'Testimonial must be at least 20 characters')
    .max(350, 'Testimonial must not exceed 350 characters'),
  mobile_number: z.string().max(50).optional().nullable(),
  rating: z.number().int().min(1).max(5).optional(),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

// ── Chat ──

export const chatMessageSchema = z
  .object({
    session_id: z.string().min(1, 'Session ID is required').optional(),
    sessionId: z.string().min(1, 'Session ID is required').optional(),
    message: z.string().min(1, 'Message is required').max(2000, 'Message too long'),
    userName: z.string().max(255).optional(),
    userEmail: z.string().email().optional(),
  })
  .refine((data) => data.session_id || data.sessionId, {
    message: 'Session ID is required (session_id or sessionId)',
  });

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

// ── Auth ──

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ── Validate helper ──

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map((i) => i.message).join(', ');
    throw new ValidationError(errors, result.error.issues);
  }
  return result.data;
}

export class ValidationError extends Error {
  public issues: z.ZodIssue[];

  constructor(message: string, issues: z.ZodIssue[]) {
    super(message);
    this.name = 'ValidationError';
    this.issues = issues;
  }
}
