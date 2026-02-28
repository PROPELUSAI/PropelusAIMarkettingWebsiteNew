/**
 * api.ts — RTK Query API slice for all frontend-to-backend communication.
 * Defines TypeScript interfaces for all form payloads and API responses,
 * and exports auto-generated React hooks for each endpoint:
 *   - Contact form, Lead popup, Testimonials (submit + fetch),
 *   - Affiliate registration, Newsletter subscription,
 *   - AI Chatbot (message + newsletter subscribe + history),
 *   - Health check.
 * Base URL routes through Next.js /api proxy in browser, direct backend URL on server.
 */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// ── Types matching BACKEND validators exactly ──

export interface ContactFormData {
  full_name: string;
  email: string;
  country: string;
  mobile_number?: string | null;
  interest?: string | null;
  scheduled_time: string;
  company_name?: string | null;
  description?: string | null;
  promo_code?: string | null;
  affiliate_code?: string | null;
}

export interface TestimonialFormData {
  full_name: string;
  email: string;
  testimonial: string;
  mobile_number?: string | null;
  rating?: number;
}

export interface Testimonial {
  _id: string;
  fullName: string;
  email?: string;
  testimonial: string;
  mobile_number?: string;
  rating?: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface AffiliateFormData {
  full_name: string;
  email: string;
  mobile_number: string;
  description: string;
}

export interface NewsletterFormData {
  email: string;
  name?: string;
  phone?: string;
  source?: 'footer' | 'chatbot' | 'popup' | 'api';
  sessionId?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  sessionId: string;
  userName?: string;
  userEmail?: string;
}

export interface ChatResponse {
  success: boolean;
  data: {
    reply: string;
    sessionId: string;
    leadScore?: string | null;
  };
}

export interface LeadFormData {
  full_name: string;
  email: string;
  country: string;
  mobile_number?: string | null;
  interest?: string | null;
  scheduled_time: string;
  company_name?: string | null;
  description?: string | null;
  promo_code?: string | null;
  affiliate_code?: string | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

// API base URL
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '/api';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
};

// Create the API slice
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Testimonials', 'Chat'],
  endpoints: (builder) => ({
    // Contact form submission
    submitContact: builder.mutation<ApiResponse, ContactFormData>({
      query: (data) => ({
        url: '/contact/submit',
        method: 'POST',
        body: data,
      }),
    }),

    // Lead popup form submission (same endpoint as contact)
    submitLead: builder.mutation<ApiResponse, LeadFormData>({
      query: (data) => ({
        url: '/contact/submit',
        method: 'POST',
        body: data,
      }),
    }),

    // Testimonial submission
    submitTestimonial: builder.mutation<ApiResponse, TestimonialFormData>({
      query: (data) => ({
        url: '/testimonials/submit',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Testimonials'],
    }),

    // Get approved testimonials
    getTestimonials: builder.query<ApiResponse<Testimonial[]>, void>({
      query: () => '/testimonials',
      providesTags: ['Testimonials'],
    }),

    // Affiliate registration
    submitAffiliate: builder.mutation<ApiResponse, AffiliateFormData>({
      query: (data) => ({
        url: '/affiliate/submit',
        method: 'POST',
        body: data,
      }),
    }),

    // Newsletter subscription
    subscribeNewsletter: builder.mutation<ApiResponse, NewsletterFormData>({
      query: (data) => ({
        url: '/newsletter/subscribe',
        method: 'POST',
        body: data,
      }),
    }),

    // AI Chatbot message
    sendChatMessage: builder.mutation<ChatResponse, ChatRequest>({
      query: (data) => ({
        url: '/chatbot/message',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Chat'],
    }),

    // Chatbot newsletter subscribe
    chatbotSubscribeNewsletter: builder.mutation<ApiResponse, NewsletterFormData>({
      query: (data) => ({
        url: '/chatbot/subscribe-newsletter',
        method: 'POST',
        body: data,
      }),
    }),

    // Get chat history
    getChatHistory: builder.query<ApiResponse<ChatMessage[]>, string>({
      query: (sessionId) => `/chatbot/history/${sessionId}`,
      providesTags: ['Chat'],
    }),

    // Health check
    healthCheck: builder.query<ApiResponse, void>({
      query: () => '/health',
    }),
  }),
});

// Export hooks
export const {
  useSubmitContactMutation,
  useSubmitLeadMutation,
  useSubmitTestimonialMutation,
  useGetTestimonialsQuery,
  useSubmitAffiliateMutation,
  useSubscribeNewsletterMutation,
  useSendChatMessageMutation,
  useChatbotSubscribeNewsletterMutation,
  useGetChatHistoryQuery,
  useHealthCheckQuery,
} = api;
