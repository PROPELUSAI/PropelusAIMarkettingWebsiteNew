import { baseApi } from './baseApi';

interface WaitlistRequest {
  name: string;
  email: string;
  mobile_number?: string;
  purpose?: string;
  industry?: string;
  current_tools?: string;
}

interface WaitlistResponse {
  success: boolean;
  message: string;
}

export const soulApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    joinSoulWaitlist: builder.mutation<WaitlistResponse, WaitlistRequest>({
      query: (body) => ({
        url: '/soul/waitlist',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useJoinSoulWaitlistMutation } = soulApi;
