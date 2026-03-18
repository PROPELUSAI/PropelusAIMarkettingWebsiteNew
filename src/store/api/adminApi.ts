import { baseApi } from './baseApi';
import type { ApiResponse } from './contactApi';
import type { AuthUser } from '../slices/authSlice';

// ── Request / Response types ──

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: AuthUser;
  };
}

export interface AdminContact {
  _id: string;
  fullName: string;
  email: string;
  country: string;
  mobileNumber?: string;
  interest?: string;
  scheduledTime: string;
  companyName?: string;
  description?: string;
  promoCode?: string;
  affiliateCode?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  tags: string[];
  status: 'draft' | 'published';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogData {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  content_raw?: string;
  content_html?: string;
  coverImage?: string;
  featured_image?: string;
  author?: string;
  tags?: string[];
  category?: string;
  status?: 'draft' | 'published';
  cta_button_text?: string;
  cta_link?: string;
  cta_description?: string;
  read_time?: number;
  [key: string]: unknown;
}

export interface UpdateBlogData extends Partial<CreateBlogData> {
  id: string;
}

export interface AdminTestimonial {
  _id: string;
  fullName: string;
  email: string;
  testimonial: string;
  mobileNumber?: string;
  rating?: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface AdminAffiliate {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  description: string;
  affiliateCode: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSubscriber {
  _id: string;
  email: string;
  name?: string;
  source: string;
  subscribedAt: string;
}

export interface AdminCampaign {
  _id: string;
  subject: string;
  content: string;
  sentAt?: string;
  recipientCount: number;
  status: string;
  createdAt: string;
}

export interface CreateCampaignData {
  subject: string;
  content: string;
}

export interface AdminChatConversation {
  _id: string;
  sessionId: string;
  userName?: string;
  userEmail?: string;
  messageCount: number;
  leadScore?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminChatDetail extends AdminChatConversation {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
}

export interface DashboardData {
  totalContacts: number;
  totalBlogs: number;
  totalTestimonials: number;
  totalAffiliates: number;
  totalSubscribers: number;
  totalChats: number;
  recentContacts: AdminContact[];
  recentTestimonials: AdminTestimonial[];
}

// ── Admin API endpoints ──

const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Auth
    adminLogin: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: '/admin/login',
        method: 'POST',
        body: data,
      }),
    }),
    getMe: builder.query<ApiResponse<AuthUser>, void>({
      query: () => '/admin/me',
      providesTags: ['AdminUser'],
    }),

    // Contacts
    getContacts: builder.query<ApiResponse<AdminContact[]>, void>({
      query: () => '/admin/contacts',
      providesTags: ['Contact'],
    }),
    getContactById: builder.query<ApiResponse<AdminContact>, string>({
      query: (id) => `/admin/contacts/${id}`,
      providesTags: ['Contact'],
    }),
    updateContact: builder.mutation<
      ApiResponse,
      { id: string; data: Partial<AdminContact> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/contacts/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Contact'],
    }),
    deleteContact: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/admin/contacts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Contact'],
    }),

    // Blogs
    getAdminBlogs: builder.query<ApiResponse<AdminBlog[]>, void>({
      query: () => '/admin/blogs',
      providesTags: ['Blog'],
    }),
    createBlog: builder.mutation<ApiResponse<AdminBlog>, CreateBlogData>({
      query: (data) => ({
        url: '/admin/blogs',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Blog'],
    }),
    updateBlog: builder.mutation<ApiResponse<AdminBlog>, UpdateBlogData>({
      query: ({ id, ...data }) => ({
        url: `/admin/blogs/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Blog'],
    }),
    deleteBlog: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/admin/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),

    // Testimonials
    getAdminTestimonials: builder.query<ApiResponse<AdminTestimonial[]>, void>({
      query: () => '/admin/testimonials',
      providesTags: ['Testimonial'],
    }),
    updateTestimonialStatus: builder.mutation<
      ApiResponse,
      { id: string; status: 'approved' | 'rejected' }
    >({
      query: ({ id, ...data }) => ({
        url: `/admin/testimonials/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Testimonial'],
    }),
    deleteTestimonial: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/admin/testimonials/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Testimonial'],
    }),

    // Affiliates
    getAffiliates: builder.query<ApiResponse<AdminAffiliate[]>, void>({
      query: () => '/admin/affiliates',
      providesTags: ['Affiliate'],
    }),
    updateAffiliateStatus: builder.mutation<
      ApiResponse,
      { id: string; status: string }
    >({
      query: ({ id, ...data }) => ({
        url: `/admin/affiliates/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Affiliate'],
    }),
    deleteAffiliate: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/admin/affiliates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Affiliate'],
    }),

    // Newsletter
    getSubscribers: builder.query<ApiResponse<AdminSubscriber[]>, void>({
      query: () => '/admin/newsletter/subscribers',
      providesTags: ['Newsletter'],
    }),
    getCampaigns: builder.query<ApiResponse<AdminCampaign[]>, void>({
      query: () => '/admin/newsletter/campaigns',
      providesTags: ['Newsletter'],
    }),
    createCampaign: builder.mutation<ApiResponse<AdminCampaign>, CreateCampaignData>({
      query: (data) => ({
        url: '/admin/newsletter/campaigns',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Newsletter'],
    }),

    // Chats
    getChats: builder.query<ApiResponse<AdminChatConversation[]>, void>({
      query: () => '/admin/chats',
      providesTags: ['Chat'],
    }),
    getChatById: builder.query<ApiResponse<AdminChatDetail>, string>({
      query: (id) => `/admin/chats/${id}`,
      providesTags: ['Chat'],
    }),

    // Dashboard
    getDashboard: builder.query<ApiResponse<DashboardData>, void>({
      query: () => '/admin/dashboard',
      providesTags: ['Dashboard'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAdminLoginMutation,
  useGetMeQuery,
  useGetContactsQuery,
  useGetContactByIdQuery,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useGetAdminBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetAdminTestimonialsQuery,
  useUpdateTestimonialStatusMutation,
  useDeleteTestimonialMutation,
  useGetAffiliatesQuery,
  useUpdateAffiliateStatusMutation,
  useDeleteAffiliateMutation,
  useGetSubscribersQuery,
  useGetCampaignsQuery,
  useCreateCampaignMutation,
  useGetChatsQuery,
  useGetChatByIdQuery,
  useGetDashboardQuery,
} = adminApi;
