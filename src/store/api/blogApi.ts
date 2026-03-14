import { baseApi } from './baseApi';
import type { ApiResponse } from './contactApi';

export interface BlogPost {
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

export interface BlogListResponse {
  blogs: BlogPost[];
  total: number;
  page: number;
  limit: number;
}

const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<ApiResponse<BlogListResponse>, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: '/blogs',
        params: params || undefined,
      }),
      providesTags: ['Blog'],
    }),
    getBlogBySlug: builder.query<ApiResponse<BlogPost>, string>({
      query: (slug) => `/blogs/${slug}`,
      providesTags: ['Blog'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetBlogsQuery, useGetBlogBySlugQuery } = blogApi;
