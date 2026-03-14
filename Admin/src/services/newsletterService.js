import { api } from '../lib/api';

const API_BASE = '/api';

export const newsletterService = {
  // ── Subscribers ──────────────────────────────────────────────────────────

  async getSubscribers(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.search) params.set('search', filters.search);
    if (filters.source) params.set('source', filters.source);
    const query = params.toString();
    return api.get(`/newsletter/subscribers${query ? `?${query}` : ''}`);
  },

  async getStats() {
    return api.get('/newsletter/subscribers/stats');
  },

  async deleteSubscriber(id) {
    return api.delete(`/newsletter/subscribers/${id}`);
  },

  async unsubscribeSubscriber(id) {
    return api.patch(`/newsletter/subscribers/${id}/unsubscribe`, {});
  },

  // ── Campaigns ─────────────────────────────────────────────────────────────

  async getCampaigns() {
    return api.get('/newsletter/campaigns');
  },

  async getCampaign(id) {
    return api.get(`/newsletter/campaigns/${id}`);
  },

  async sendCampaign({ subject, body_html, body_text, compose_mode, sent_by, attachments }) {
    return api.post('/newsletter/campaigns/send', {
      subject,
      body_html,
      body_text,
      compose_mode,
      sent_by,
      attachments,
    });
  },

  // ── File Uploads ─────────────────────────────────────────────────────────

  async uploadFiles(files) {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }

    const response = await fetch(`${API_BASE}/newsletter/upload`, {
      method: 'POST',
      body: formData,
      // No Content-Type header — browser sets it with boundary for multipart
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Upload failed with status ${response.status}`);
    }

    return response.json();
  },
};
