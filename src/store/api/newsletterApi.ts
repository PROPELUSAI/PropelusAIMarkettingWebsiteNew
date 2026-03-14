import { baseApi } from './baseApi';
import type { ApiResponse } from './contactApi';

export interface NewsletterFormData {
  email: string;
  name?: string;
  phone?: string;
  source?: 'footer' | 'chatbot' | 'popup' | 'api';
  sessionId?: string;
}

const newsletterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    subscribeNewsletter: builder.mutation<ApiResponse, NewsletterFormData>({
      query: (data) => ({
        url: '/newsletter/subscribe',
        method: 'POST',
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useSubscribeNewsletterMutation } = newsletterApi;
