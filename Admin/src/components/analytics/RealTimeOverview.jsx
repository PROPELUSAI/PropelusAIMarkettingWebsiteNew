/**
 * RealTimeOverview — Live visitor data from GA4 real-time API.
 * Shows active users, pageviews in last 30 min, top active pages,
 * and top countries. Auto-refreshes every 60 seconds.
 */
import { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { AnalyticsCard } from './AnalyticsCard';
import { StatCard } from './StatCard';

export const RealTimeOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRealTimeData();
    const interval = setInterval(loadRealTimeData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadRealTimeData = async () => {
    try {
      const result = await analyticsService.getRealTimeData();
      setData(result);
    } catch (error) {
      console.error('Failed to load real-time data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnalyticsCard title="Real-Time Overview">
      <div className="stats-grid">
        <StatCard
          title="Active Users"
          value={data?.activeUsers || 0}
          icon="👥"
          loading={loading}
        />
        <StatCard
          title="Active Pages"
          value={data?.activePages || 0}
          icon="📄"
          loading={loading}
        />
      </div>

      {!loading && data?.topPages && (
        <div className="realtime-pages">
          <h4>Current Active Pages</h4>
          <ul className="page-list">
            {data.topPages.map((page, index) => (
              <li key={index}>
                <span className="page-path">{page.path}</span>
                <span className="page-users">{page.users} users</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && data?.trafficSources && (
        <div className="realtime-sources">
          <h4>Traffic Sources</h4>
          <ul className="source-list">
            {data.trafficSources.map((source, index) => (
              <li key={index}>
                <span className="source-name">{source.name}</span>
                <span className="source-users">{source.users} users</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </AnalyticsCard>
  );
};
