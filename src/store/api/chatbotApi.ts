import { baseApi } from './baseApi';
import type { ApiResponse } from './contactApi';
import type { NewsletterFormData } from './newsletterApi';

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

const chatbotApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation<ChatResponse, ChatRequest>({
      query: (data) => ({
        url: '/chatbot/message',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Chat'],
    }),
    getChatHistory: builder.query<ApiResponse<ChatMessage[]>, string>({
      query: (sessionId) => `/chatbot/history/${sessionId}`,
      providesTags: ['Chat'],
    }),
    subscribeChatNewsletter: builder.mutation<ApiResponse, NewsletterFormData>({
      query: (data) => ({
        url: '/chatbot/subscribe-newsletter',
        method: 'POST',
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useSendMessageMutation,
  useGetChatHistoryQuery,
  useSubscribeChatNewsletterMutation,
} = chatbotApi;
