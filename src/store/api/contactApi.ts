import { baseApi } from './baseApi';

export interface ContactFormData {
  full_name: string;
  email: string;
  country: string;
  mobile_number?: string | null;
  interest?: string | null;
  linkedin_url?: string | null;
  team_size?: string | null;
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

const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitContact: builder.mutation<ApiResponse, ContactFormData>({
      query: (data) => ({
        url: '/contact/submit',
        method: 'POST',
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useSubmitContactMutation } = contactApi;
