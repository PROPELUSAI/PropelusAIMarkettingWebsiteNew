import { baseApi } from './baseApi';
import type { ApiResponse } from './contactApi';

export interface AffiliateFormData {
  full_name: string;
  email: string;
  mobile_number: string;
  description: string;
}

const affiliateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitAffiliate: builder.mutation<ApiResponse, AffiliateFormData>({
      query: (data) => ({
        url: '/affiliate/submit',
        method: 'POST',
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useSubmitAffiliateMutation } = affiliateApi;
