import { z } from 'zod';

export const submitContactSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(255),
  company_name: z.string().max(255).optional().nullable(),
  email: z.string().email('Invalid email format'),
  country: z.string().min(1, 'Country is required').max(100),
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
  mobile_number: z.string().max(50).optional().nullable(),
  affiliate_code: z.string().max(50).optional().nullable(),
});

export const updateContactSchema = z.object({
  lead_status: z.enum(['open', 'in_progress', 'contacted', 'qualified', 'converted', 'closed', 'lost', 'spam']).optional(),
  priority: z.enum(['high', 'medium', 'low']).optional(),
  assigned_to: z.string().max(255).optional().nullable(),
  admin_notes: z.string().optional().nullable(),
  response_sent: z.boolean().optional(),
  response_date: z.string().datetime().optional().nullable(),
  response_method: z.enum(['email', 'phone', 'meeting', 'chat', 'other']).optional().nullable(),
  follow_up_date: z.string().datetime().optional().nullable(),
  updated_by: z.string().max(255).optional().nullable(),
});

export type SubmitContactInput = z.infer<typeof submitContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
