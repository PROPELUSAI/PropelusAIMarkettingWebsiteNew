/**
 * Analytics Page — Google Analytics 4 dashboard.
 * Displays real-time overview, traffic trends, page performance,
 * acquisition channels, custom events, and conversion data.
 * All sub-reports accept a shared date range controlled by DateRangeFilter.
 * @route /analytics
 */
import { useState } from 'react';
import { format, subDays } from 'date-fns';
import { DateRangeFilter } from '../components/analytics/DateRangeFilter';
import { RealTimeOverview } from '../components/analytics/RealTimeOverview';
import { TrafficAnalytics } from '../components/analytics/TrafficAnalytics';
import { PagePerformance } from '../components/analytics/PagePerformance';
import { AcquisitionReport } from '../components/analytics/AcquisitionReport';
import { EventsReport } from '../components/analytics/EventsReport';
import { ConversionsReport } from '../components/analytics/ConversionsReport';
import '../styles/analytics.css';

export const Analytics = () => {
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [activeTab, setActiveTab] = useState('overview');

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'traffic', label: 'Traffic', icon: '🚦' },
    { id: 'pages', label: 'Pages', icon: '📄' },
    { id: 'acquisition', label: 'Acquisition', icon: '🎯' },
    { id: 'events', label: 'Events', icon: '⚡' },
    { id: 'conversions', label: 'Conversions', icon: '💰' },
  ];

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h1>Google Analytics Dashboard</h1>
        <p className="analytics-subtitle">Propelus AI Website Analytics</p>
      </div>

      <DateRangeFilter onDateChange={handleDateChange} />

      <div className="analytics-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="analytics-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <RealTimeOverview />
            <TrafficAnalytics startDate={startDate} endDate={endDate} />
          </div>
        )}

        {activeTab === 'traffic' && (
          <TrafficAnalytics startDate={startDate} endDate={endDate} />
        )}

        {activeTab === 'pages' && (
          <PagePerformance startDate={startDate} endDate={endDate} />
        )}

        {activeTab === 'acquisition' && (
          <AcquisitionReport startDate={startDate} endDate={endDate} />
        )}

        {activeTab === 'events' && (
          <EventsReport startDate={startDate} endDate={endDate} />
        )}

        {activeTab === 'conversions' && (
          <ConversionsReport startDate={startDate} endDate={endDate} />
        )}
      </div>
    </div>
  );
};
