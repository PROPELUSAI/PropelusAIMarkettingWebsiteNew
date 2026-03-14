/**
 * ConversionsReport — Goal completion and conversion rate trends.
 * Shows conversion rate over time (LineChart), goal completions
 * by type (BarChart), and summary StatCards for total conversions,
 * average rate, and top-performing goal.
 */
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { analyticsService } from '../../services/analyticsService';
import { AnalyticsCard } from './AnalyticsCard';
import { StatCard } from './StatCard';

export const ConversionsReport = ({ startDate, endDate }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversionsData();
  }, [startDate, endDate]);

  const loadConversionsData = async () => {
    setLoading(true);
    try {
      const result = await analyticsService.getConversionsData(startDate, endDate);
      setData(result);
    } catch (error) {
      console.error('Failed to load conversions data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="conversions-report">
      <div className="stats-grid">
        <StatCard
          title="Total Leads"
          value={data?.totalLeads?.toLocaleString() || 0}
          change={data?.leadsChange}
          icon="🎯"
          loading={loading}
        />
        <StatCard
          title="Conversion Rate"
          value={data?.conversionRate ? `${data.conversionRate.toFixed(2)}%` : '0%'}
          change={data?.conversionRateChange}
          icon="📈"
          loading={loading}
        />
        <StatCard
          title="Form Submissions"
          value={data?.formSubmissions?.toLocaleString() || 0}
          change={data?.submissionsChange}
          icon="📝"
          loading={loading}
        />
        <StatCard
          title="Avg Time to Convert"
          value={data?.avgTimeToConvert ? `${data.avgTimeToConvert.toFixed(1)} days` : '0 days'}
          icon="⏰"
          loading={loading}
        />
      </div>

      <AnalyticsCard title="Conversion Trend">
        {loading ? (
          <div className="skeleton-chart"></div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data?.trendData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="conversions" stroke="#8884d8" name="Conversions" />
              <Line type="monotone" dataKey="conversionRate" stroke="#82ca9d" name="Conversion Rate %" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </AnalyticsCard>

      <AnalyticsCard title="Form Submission Analytics">
        {loading ? (
          <div className="skeleton-chart"></div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.formAnalytics || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formType" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="submissions" fill="#8884d8" name="Submissions" />
                <Bar dataKey="completionRate" fill="#82ca9d" name="Completion Rate %" />
              </BarChart>
            </ResponsiveContainer>

            <div className="form-details">
              <table>
                <thead>
                  <tr>
                    <th>Form Type</th>
                    <th>Submissions</th>
                    <th>Started</th>
                    <th>Completion Rate</th>
                    <th>Avg Time</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.formAnalytics || []).map((form, index) => (
                    <tr key={index}>
                      <td>{form.formType}</td>
                      <td>{form.submissions}</td>
                      <td>{form.started}</td>
                      <td>{form.completionRate.toFixed(1)}%</td>
                      <td>{form.avgTime}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </AnalyticsCard>
    </div>
  );
};
