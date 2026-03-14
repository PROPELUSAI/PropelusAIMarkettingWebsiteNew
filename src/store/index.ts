// Store
export { store } from './store';
export type { RootState, AppDispatch } from './store';

// Hooks
export { useAppDispatch, useAppSelector } from './hooks';

// Base API
export { baseApi } from './api/baseApi';

// Auth slice
export {
  setCredentials,
  clearCredentials,
} from './slices/authSlice';
export type { AuthUser } from './slices/authSlice';

// UI slice
export {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  toggleTheme,
  setGlobalLoading,
} from './slices/uiSlice';

// Contact API
export { useSubmitContactMutation } from './api/contactApi';
export type { ContactFormData, ApiResponse } from './api/contactApi';

// Blog API
export { useGetBlogsQuery, useGetBlogBySlugQuery } from './api/blogApi';
export type { BlogPost, BlogListResponse } from './api/blogApi';

// Testimonial API
export {
  useGetTestimonialsQuery,
  useSubmitTestimonialMutation,
} from './api/testimonialApi';
export type {
  Testimonial,
  TestimonialFormData,
} from './api/testimonialApi';

// Affiliate API
export { useSubmitAffiliateMutation } from './api/affiliateApi';
export type { AffiliateFormData } from './api/affiliateApi';

// Newsletter API
export { useSubscribeNewsletterMutation } from './api/newsletterApi';
export type { NewsletterFormData } from './api/newsletterApi';

// Chatbot API
export {
  useSendMessageMutation,
  useGetChatHistoryQuery,
  useSubscribeChatNewsletterMutation,
} from './api/chatbotApi';
export type {
  ChatMessage,
  ChatRequest,
  ChatResponse,
} from './api/chatbotApi';

// Admin API
export {
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
} from './api/adminApi';
export type {
  LoginRequest,
  LoginResponse,
  AdminContact,
  AdminBlog,
  CreateBlogData,
  UpdateBlogData,
  AdminTestimonial,
  AdminAffiliate,
  AdminSubscriber,
  AdminCampaign,
  CreateCampaignData,
  AdminChatConversation,
  AdminChatDetail,
  DashboardData,
} from './api/adminApi';

// Legacy alias: some code may still reference `api` directly
export { baseApi as api } from './api/baseApi';
