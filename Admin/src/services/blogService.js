import { api } from '../lib/api';

export const blogService = {
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.category) params.set('category', filters.category);
    if (filters.search) params.set('search', filters.search);
    if (filters.featured !== undefined) params.set('featured', filters.featured);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const query = params.toString();
    return api.get(`/blogs${query ? `?${query}` : ''}`);
  },

  async getById(id) {
    return api.get(`/blogs/${id}`);
  },

  async create(blogData) {
    return api.post('/blogs', blogData);
  },

  async update(id, blogData) {
    return api.put(`/blogs/${id}`, blogData);
  },

  async updateStatus(id, status, rejectionReason = null) {
    return api.patch(`/blogs/${id}/status`, { status, rejectionReason });
  },

  async toggleFeatured(id) {
    return api.patch(`/blogs/${id}/toggle-featured`, {});
  },

  async incrementViews(id) {
    return api.post(`/blogs/${id}/increment-views`, {});
  },

  async trackCTAClick(id, ctaType) {
    return api.post(`/blogs/${id}/cta-click`, { ctaType });
  },

  async getAnalytics(id) {
    return api.get(`/blogs/${id}/analytics`);
  },

  async delete(id) {
    return api.delete(`/blogs/${id}`);
  },

  async generateSlug(title) {
    const result = await api.post('/blogs/generate-slug', { title });
    return result.slug;
  },
};