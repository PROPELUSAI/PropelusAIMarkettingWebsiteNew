import { api } from '../lib/api';

export const testimonialService = {
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.search) params.set('search', filters.search);

    const query = params.toString();
    return api.get(`/testimonials${query ? `?${query}` : ''}`);
  },

  async getById(id) {
    return api.get(`/testimonials/${id}`);
  },

  async approve(id) {
    return this.updateStatus(id, 'approved');
  },

  async deny(id) {
    return this.updateStatus(id, 'denied');
  },

  async updateStatus(id, status) {
    return api.patch(`/testimonials/${id}/status`, { status });
  },

  async delete(id) {
    return api.delete(`/testimonials/${id}`);
  },
};
