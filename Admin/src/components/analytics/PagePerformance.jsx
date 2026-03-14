/**
 * PagePerformance — Per-page metrics from GA4.
 * Horizontal BarChart of top pages by views, plus a table showing
 * page path, views, unique views, avg. time on page, and bounce rate.
 */
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyticsService } from '../../services/analyticsService';
import { AnalyticsCard } from './AnalyticsCard';

export const PagePerformance = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('views');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPageData();
  }, [startDate, endDate]);

  const loadPageData = async () => {
    setLoading(true);
    try {
      const result = await analyticsService.getPagePerformance(startDate, endDate);
      setData(result.pages || []);
    } catch (error) {
      console.error('Failed to load page performance:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredData = data
    .filter(page => page.path.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'views') return b.views - a.views;
      if (sortBy === 'time') return b.avgTimeOnPage - a.avgTimeOnPage;
      if (sortBy === 'scroll') return b.scrollDepth - a.scrollDepth;
      return 0;
    });

  const topPages = filteredData.slice(0, 10);

  return (
    <AnalyticsCard title="Page Performance">
      <div className="page-performance-controls">
        <input
          type="text"
          placeholder="Search pages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
          <option value="views">Sort by Views</option>
          <option value="time">Sort by Time on Page</option>
          <option value="scroll">Sort by Scroll Depth</option>
        </select>
      </div>

      {loading ? (
        <div className="skeleton-table"></div>
      ) : (
        <>
          <div className="page-table">
            <table>
              <thead>
                <tr>
                  <th>Page Path</th>
                  <th>Views</th>
                  <th>Avg Time</th>
                  <th>Scroll Depth</th>
                  <th>CTA Clicks</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((page, index) => (
                  <tr key={index}>
                    <td className="page-path">{page.path}</td>
                    <td>{page.views.toLocaleString()}</td>
                    <td>{formatTime(page.avgTimeOnPage)}</td>
                    <td>{page.scrollDepth}%</td>
                    <td>{page.ctaClicks || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="page-chart">
            <h4>Top 10 Pages by Views</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPages} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="path" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#8884d8" name="Page Views" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </AnalyticsCard>
  );
};
