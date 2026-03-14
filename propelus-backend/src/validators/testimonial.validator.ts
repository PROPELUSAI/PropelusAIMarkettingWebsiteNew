import { z } from 'zod';

export const submitTestimonialSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(255),
  email: z.string().email('Invalid email format'),
  testimonial: z.string().min(20, 'Testimonial must be at least 20 characters').max(350, 'Testimonial must not exceed 350 characters'),
  mobile_number: z.string().max(50).optional().nullable(),
  rating: z.number().int().min(1).max(5).optional(),
});

export type SubmitTestimonialInput = z.infer<typeof submitTestimonialSchema>;
