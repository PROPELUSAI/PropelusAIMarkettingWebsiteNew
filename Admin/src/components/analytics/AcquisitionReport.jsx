/**
 * AcquisitionReport — Traffic source breakdown (organic, direct, referral, social, paid).
 * Renders a PieChart of channel distribution and a BarChart of top referral sources.
 * Fetches data from analyticsService.getAcquisitionData() for the given date range.
 */
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { analyticsService } from '../../services/analyticsService';
import { AnalyticsCard } from './AnalyticsCard';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const AcquisitionReport = ({ startDate, endDate }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAcquisitionData();
  }, [startDate, endDate]);

  const loadAcquisitionData = async () => {
    setLoading(true);
    try {
      const result = await analyticsService.getAcquisitionData(startDate, endDate);
      setData(result);
    } catch (error) {
      console.error('Failed to load acquisition data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="acquisition-report">
      <div className="acquisition-grid">
        <AnalyticsCard title="Traffic Sources">
          {loading ? (
            <div className="skeleton-chart"></div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.sources || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="users"
                >
                  {(data?.sources || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </AnalyticsCard>

        <AnalyticsCard title="Device Category">
          {loading ? (
            <div className="skeleton-chart"></div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.devices || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#82ca9d"
                  dataKey="users"
                >
                  {(data?.devices || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </AnalyticsCard>
      </div>

      <AnalyticsCard title="Top Countries">
        {loading ? (
          <div className="skeleton-chart"></div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.countries?.slice(0, 10) || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#8884d8" name="Users" />
              <Bar dataKey="sessions" fill="#82ca9d" name="Sessions" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </AnalyticsCard>

      {!loading && data?.campaigns && data.campaigns.length > 0 && (
        <AnalyticsCard title="Campaign Performance">
          <div className="campaign-table">
            <table>
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Users</th>
                  <th>Sessions</th>
                  <th>Conversions</th>
                  <th>Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {data.campaigns.map((campaign, index) => (
                  <tr key={index}>
                    <td>{campaign.name}</td>
                    <td>{campaign.users.toLocaleString()}</td>
                    <td>{campaign.sessions.toLocaleString()}</td>
                    <td>{campaign.conversions}</td>
                    <td>{campaign.conversionRate.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnalyticsCard>
      )}
    </div>
  );
};
