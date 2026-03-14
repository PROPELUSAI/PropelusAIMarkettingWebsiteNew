/**
 * AnalyticsService — Client for the GA4 analytics Edge Function.
 * Calls the Supabase-hosted Edge Function which proxies requests
 * to the Google Analytics Data API (GA4).  Methods cover real-time
 * overview, traffic trends, page performance, acquisition channels,
 * custom events, and conversion data.  All date-range methods accept
 * startDate/endDate strings in YYYY-MM-DD format.
 */
import axios from 'axios';

const API_ENDPOINT = import.meta.env.VITE_GA4_API_ENDPOINT;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

class AnalyticsService {
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY
    };
  }

  // Transform GA4 API response to component format
  transformGA4Response(data, type) {
    if (!data.rows || data.rows.length === 0) {
      return this.getEmptyResponse(type);
    }

    switch (type) {
      case 'realtime':
        return this.transformRealTimeData(data);
      case 'traffic':
        return this.transformTrafficData(data);
      case 'pages':
        return this.transformPageData(data);
      case 'acquisition':
        return this.transformAcquisitionData(data);
      case 'events':
        return this.transformEventsData(data);
      case 'conversions':
        return this.transformConversionsData(data);
      default:
        return data;
    }
  }

  getEmptyResponse(type) {
    switch (type) {
      case 'realtime':
        return { activeUsers: 0, activePages: 0, topPages: [], trafficSources: [] };
      case 'traffic':
        return { totalSessions: 0, uniqueUsers: 0, pageViews: 0, bounceRate: 0, avgSessionDuration: 0, chartData: [] };
      case 'pages':
        return { pages: [] };
      default:
        return { rows: [] };
    }
  }

  transformRealTimeData(data) {
    const totalUsers = data.rows.reduce((sum, row) => sum + parseInt(row.metricValues[0].value || 0), 0);
    
    return {
      activeUsers: totalUsers,
      activePages: data.rows.length,
      topPages: data.rows.slice(0, 10).map(row => ({
        path: row.dimensionValues[0]?.value || 'Unknown',
        users: parseInt(row.metricValues[0]?.value || 0)
      })),
      trafficSources: []
    };
  }

  transformTrafficData(data) {
    let totalSessions = 0;
    let totalUsers = 0;
    let totalPageViews = 0;
    let totalBounceRate = 0;
    let totalDuration = 0;
    const chartData = [];

    data.rows.forEach(row => {
      const date = row.dimensionValues[0]?.value || '';
      const sessions = parseInt(row.metricValues[0]?.value || 0);
      const users = parseInt(row.metricValues[1]?.value || 0);
      const pageViews = parseInt(row.metricValues[2]?.value || 0);
      const bounceRate = parseFloat(row.metricValues[3]?.value || 0);
      const duration = parseFloat(row.metricValues[4]?.value || 0);

      totalSessions += sessions;
      totalUsers += users;
      totalPageViews += pageViews;
      totalBounceRate += bounceRate;
      totalDuration += duration;

      chartData.push({
        date,
        sessions,
        users,
        pageViews
      });
    });

    const rowCount = data.rows.length;

    return {
      totalSessions,
      uniqueUsers: totalUsers,
      pageViews: totalPageViews,
      bounceRate: rowCount > 0 ? (totalBounceRate / rowCount) * 100 : 0,
      avgSessionDuration: rowCount > 0 ? totalDuration / rowCount : 0,
      chartData
    };
  }

  transformPageData(data) {
    const pages = data.rows.map(row => ({
      path: row.dimensionValues[0]?.value || 'Unknown',
      title: row.dimensionValues[1]?.value || 'Untitled',
      views: parseInt(row.metricValues[0]?.value || 0),
      avgTimeOnPage: parseFloat(row.metricValues[1]?.value || 0),
      scrollDepth: Math.round((1 - parseFloat(row.metricValues[2]?.value || 0)) * 100),
      ctaClicks: 0
    }));

    return { pages };
  }

  transformAcquisitionData(data) {
    return {
      sources: data.rows.map(row => ({
        source: row.dimensionValues[0]?.value || 'Unknown',
        medium: row.dimensionValues[1]?.value || 'Unknown',
        campaign: row.dimensionValues[2]?.value || '(not set)',
        sessions: parseInt(row.metricValues[0]?.value || 0),
        users: parseInt(row.metricValues[1]?.value || 0),
        newUsers: parseInt(row.metricValues[2]?.value || 0)
      }))
    };
  }

  transformEventsData(data) {
    return {
      events: data.rows.map(row => ({
        name: row.dimensionValues[0]?.value || 'Unknown',
        count: parseInt(row.metricValues[0]?.value || 0),
        users: parseInt(row.metricValues[1]?.value || 0)
      }))
    };
  }

  transformConversionsData(data) {
    return {
      conversions: data.rows.map(row => ({
        name: row.dimensionValues[0]?.value || 'Unknown',
        count: parseInt(row.metricValues[0]?.value || 0),
        users: parseInt(row.metricValues[1]?.value || 0)
      }))
    };
  }

  // Real-time data
  async getRealTimeData() {
    try {
      const response = await axios.post(API_ENDPOINT, {
        endpoint: 'realtime',
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'activeUsers' }]
      }, {
        headers: this.getHeaders()
      });
      
      return this.transformGA4Response(response.data, 'realtime');
    } catch (error) {
      console.error('Failed to fetch real-time data:', error);
      throw error;
    }
  }

  // Traffic analytics
  async getTrafficData(startDate, endDate) {
    try {
      const response = await axios.post(API_ENDPOINT, {
        endpoint: 'traffic',
        startDate,
        endDate
      }, {
        headers: this.getHeaders()
      });
      
      return this.transformGA4Response(response.data, 'traffic');
    } catch (error) {
      console.error('Failed to fetch traffic data:', error);
      throw error;
    }
  }

  // Page performance
  async getPagePerformance(startDate, endDate) {
    try {
      const response = await axios.post(API_ENDPOINT, {
        endpoint: 'pages',
        startDate,
        endDate
      }, {
        headers: this.getHeaders()
      });
      
      return this.transformGA4Response(response.data, 'pages');
    } catch (error) {
      console.error('Failed to fetch page performance:', error);
      throw error;
    }
  }

  // Acquisition report
  async getAcquisitionData(startDate, endDate) {
    try {
      const response = await axios.post(API_ENDPOINT, {
        endpoint: 'acquisition',
        startDate,
        endDate
      }, {
        headers: this.getHeaders()
      });
      
      return this.transformGA4Response(response.data, 'acquisition');
    } catch (error) {
      console.error('Failed to fetch acquisition data:', error);
      throw error;
    }
  }

  // Events report
  async getEventsData(startDate, endDate) {
    try {
      const response = await axios.post(API_ENDPOINT, {
        endpoint: 'events',
        startDate,
        endDate
      }, {
        headers: this.getHeaders()
      });
      
      return this.transformGA4Response(response.data, 'events');
    } catch (error) {
      console.error('Failed to fetch events data:', error);
      throw error;
    }
  }

  // Conversions
  async getConversionsData(startDate, endDate) {
    try {
      const response = await axios.post(API_ENDPOINT, {
        endpoint: 'conversions',
        startDate,
        endDate
      }, {
        headers: this.getHeaders()
      });
      
      return this.transformGA4Response(response.data, 'conversions');
    } catch (error) {
      console.error('Failed to fetch conversions data:', error);
      throw error;
    }
  }

  // Demographics (countries and cities)
  async getDemographicsData(startDate, endDate) {
    try {
      const response = await axios.post(API_ENDPOINT, {
        endpoint: 'demographics',
        startDate,
        endDate,
        dimensions: [{ name: 'country' }, { name: 'city' }]
      }, {
        headers: this.getHeaders()
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch demographics data:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
