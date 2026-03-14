/**
 * TrafficAnalytics — Overall traffic trends from GA4.
 * LineChart of daily sessions, pageviews, and users over the date range.
 * StatCards show totals and period-over-period percentage change.
 */
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyticsService } from '../../services/analyticsService';
import { AnalyticsCard } from './AnalyticsCard';
import { StatCard } from './StatCard';

export const TrafficAnalytics = ({ startDate, endDate }) => {
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrafficData();
  }, [startDate, endDate]);

  const loadTrafficData = async () => {
    setLoading(true);
    try {
      const result = await analyticsService.getTrafficData(startDate, endDate);
      setData(result);
      setChartData(result.chartData || []);
    } catch (error) {
      console.error('Failed to load traffic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="traffic-analytics">
      <div className="stats-grid">
        <StatCard
          title="Total Sessions"
          value={data?.totalSessions?.toLocaleString() || 0}
          change={data?.sessionsChange}
          icon="📊"
          loading={loading}
        />
        <StatCard
          title="Unique Users"
          value={data?.uniqueUsers?.toLocaleString() || 0}
          change={data?.usersChange}
          icon="👤"
          loading={loading}
        />
        <StatCard
          title="Page Views"
          value={data?.pageViews?.toLocaleString() || 0}
          change={data?.pageViewsChange}
          icon="👁️"
          loading={loading}
        />
        <StatCard
          title="Bounce Rate"
          value={data?.bounceRate ? `${data.bounceRate.toFixed(1)}%` : '0%'}
          change={data?.bounceRateChange}
          icon="⚡"
          loading={loading}
        />
        <StatCard
          title="Avg Session Duration"
          value={data?.avgSessionDuration ? formatDuration(data.avgSessionDuration) : '0m 0s'}
          change={data?.durationChange}
          icon="⏱️"
          loading={loading}
        />
      </div>

      <AnalyticsCard title="Traffic Trend">
        {loading ? (
          <div className="skeleton-chart"></div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sessions" stroke="#8884d8" name="Sessions" />
              <Line type="monotone" dataKey="users" stroke="#82ca9d" name="Users" />
              <Line type="monotone" dataKey="pageViews" stroke="#ffc658" name="Page Views" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </AnalyticsCard>
    </div>
  );
};
