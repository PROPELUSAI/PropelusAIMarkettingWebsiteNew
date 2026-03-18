import { baseApi } from './baseApi';
import type { ApiResponse } from './contactApi';

export interface TestimonialFormData {
  full_name: string;
  email: string;
  testimonial: string;
  mobile_number?: string | null;
  rating?: number;
  designation?: string | null;
  company?: string | null;
  industry?: string | null;
  city?: string | null;
  image_url?: string | null;
}

export interface Testimonial {
  _id: string;
  fullName: string;
  email?: string;
  testimonial: string;
  mobile_number?: string;
  rating?: number;
  designation?: string | null;
  company?: string | null;
  industry?: string | null;
  city?: string | null;
  imageUrl?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const testimonialApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestimonials: builder.query<ApiResponse<Testimonial[]>, void>({
      query: () => '/testimonials',
      providesTags: ['Testimonial'],
    }),
    submitTestimonial: builder.mutation<ApiResponse, TestimonialFormData>({
      query: (data) => ({
        url: '/testimonials/submit',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Testimonial'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetTestimonialsQuery, useSubmitTestimonialMutation } =
  testimonialApi;
