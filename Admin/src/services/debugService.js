/**
 * DebugService — Quick connectivity checks for every backend collection.
 * Each method calls its corresponding API endpoint and logs success/failure
 * to the browser console with emoji indicators. Used by the AffiliateDebug page.
 */
import { api } from '../lib/api';

// Debug service to test API connectivity
export const debugService = {
  async testContacts() {
    console.log('🧪 Testing contacts API...');
    try {
      const data = await api.get('/contacts');
      console.log('✅ Contacts result:', { count: data?.length || 0 });
      return { success: true, count: data?.length || 0 };
    } catch (err) {
      console.error('❌ Contacts error:', err);
      return { success: false, error: err.message };
    }
  },

  async testTestimonials() {
    console.log('🧪 Testing testimonials API...');
    try {
      const data = await api.get('/testimonials');
      console.log('✅ Testimonials result:', { count: data?.length || 0 });
      return { success: true, count: data?.length || 0 };
    } catch (err) {
      console.error('❌ Testimonials error:', err);
      return { success: false, error: err.message };
    }
  },

  async testAffiliates() {
    console.log('🧪 Testing affiliates API...');
    try {
      const data = await api.get('/affiliates');
      console.log('✅ Affiliates result:', { count: data?.length || 0 });
      return { success: true, count: data?.length || 0 };
    } catch (err) {
      console.error('❌ Affiliates error:', err);
      return { success: false, error: err.message };
    }
  },

  async testHealth() {
    console.log('🧪 Testing API health...');
    try {
      const data = await api.get('/health');
      console.log('✅ Health result:', data);
      return { success: true, data };
    } catch (err) {
      console.error('❌ Health error:', err);
      return { success: false, error: err.message };
    }
  },

  async runAllTests() {
    console.log('🔍 Running API tests...');
    const results = {
      health: await this.testHealth(),
      contacts: await this.testContacts(),
      testimonials: await this.testTestimonials(),
      affiliates: await this.testAffiliates(),
    };
    console.log('📊 Test Results Summary:', results);
    return results;
  }
};