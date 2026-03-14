import { api } from '../lib/api';

export const affiliateService = {
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.leadStatus) params.set('leadStatus', filters.leadStatus);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.search) params.set('search', filters.search);

    const query = params.toString();
    return api.get(`/affiliates${query ? `?${query}` : ''}`);
  },

  async getById(id) {
    return api.get(`/affiliates/${id}`);
  },

  async update(id, updates) {
    return api.put(`/affiliates/${id}`, updates);
  },

  async updateStatus(id, status) {
    return api.patch(`/affiliates/${id}/status`, { status });
  },

  async updateLeadStatus(id, leadStatus) {
    return api.patch(`/affiliates/${id}/lead-status`, { lead_status: leadStatus });
  },

  async updatePriority(id, priority) {
    return api.patch(`/affiliates/${id}/priority`, { priority });
  },

  async addNote(id, note) {
    return api.post(`/affiliates/${id}/note`, { note });
  },

  async markContacted(id) {
    return api.post(`/affiliates/${id}/contacted`, {});
  },

  async approve(id, commissionRate = null) {
    return api.post(`/affiliates/${id}/approve`, { commissionRate });
  },

  async reject(id, reason = null) {
    return api.post(`/affiliates/${id}/reject`, { reason });
  },

  async activate(id) {
    return this.update(id, { status: 'active', lead_status: 'converted' });
  },

  async deactivate(id) {
    return this.update(id, { status: 'inactive', lead_status: 'closed' });
  },

  async delete(id) {
    return api.delete(`/affiliates/${id}`);
  },

  async generateAffiliateCode(id) {
    return api.post(`/affiliates/${id}/generate-code`, {});
  },
};
