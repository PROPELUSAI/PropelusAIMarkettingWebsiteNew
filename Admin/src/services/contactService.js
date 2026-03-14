import { api } from '../lib/api';

export const contactService = {
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.country) params.set('country', filters.country);
    if (filters.affiliateCode) params.set('affiliateCode', filters.affiliateCode);
    if (filters.search) params.set('search', filters.search);

    const query = params.toString();
    return api.get(`/contacts${query ? `?${query}` : ''}`);
  },

  async getById(id) {
    return api.get(`/contacts/${id}`);
  },

  async update(id, updates) {
    return api.put(`/contacts/${id}`, updates);
  },

  async delete(id) {
    return api.delete(`/contacts/${id}`);
  },
};
