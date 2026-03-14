import { api } from '../lib/api';

export const chatService = {
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.leadQualified) params.set('leadQualified', filters.leadQualified);
    if (filters.page) params.set('page', filters.page);
    if (filters.limit) params.set('limit', filters.limit);

    const query = params.toString();
    return api.get(`/chats${query ? `?${query}` : ''}`);
  },

  async getStats() {
    return api.get('/chats/stats');
  },

  async getById(id) {
    return api.get(`/chats/${id}`);
  },

  async delete(id) {
    return api.delete(`/chats/${id}`);
  },
};
