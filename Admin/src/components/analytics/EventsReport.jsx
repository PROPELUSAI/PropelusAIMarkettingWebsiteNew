/**
 * EventsReport — Custom event tracking from GA4.
 * Tracks events: cta_click, section_view, chatbot_open, form_start,
 * form_complete, blog_read. Renders a stacked BarChart of event counts
 * over time and a summary table with event-level totals.
 */
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyticsService } from '../../services/analyticsService';
import { AnalyticsCard } from './AnalyticsCard';

const EVENT_NAMES = [
  'cta_click',
  'section_view',
  'service_card_click',
  'pricing_card_click',
  'testimonial_slide_view',
  'faq_toggle',
  'contact_form_submit'
];

export const EventsReport = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    loadEventsData();
  }, [startDate, endDate]);

  const loadEventsData = async () => {
    setLoading(true);
    try {
      const result = await analyticsService.getEventsData(startDate, endDate, EVENT_NAMES);
      setData(result.events || []);
    } catch (error) {
      console.error('Failed to load events data:', error);
    } finally {
      setLoading(false);
    }
  };

  const eventDetails = selectedEvent ? data.find(e => e.name === selectedEvent) : null;

  return (
    <div className="events-report">
      <AnalyticsCard title="Custom Events Overview">
        {loading ? (
          <div className="skeleton-chart"></div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Total Count" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </AnalyticsCard>

      <AnalyticsCard title="Event Details">
        {loading ? (
          <div className="skeleton-table"></div>
        ) : (
          <>
            <div className="event-selector">
              <label>Select Event:</label>
              <select 
                value={selectedEvent || ''} 
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="event-select"
              >
                <option value="">-- Select an event --</option>
                {data.map((event) => (
                  <option key={event.name} value={event.name}>
                    {event.name} ({event.count} times)
                  </option>
                ))}
              </select>
            </div>

            <div className="events-table">
              <table>
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Total Count</th>
                    <th>Unique Users</th>
                    <th>Avg per User</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((event, index) => (
                    <tr 
                      key={index}
                      className={selectedEvent === event.name ? 'selected' : ''}
                      onClick={() => setSelectedEvent(event.name)}
                    >
                      <td>{event.name}</td>
                      <td>{event.count.toLocaleString()}</td>
                      <td>{event.uniqueUsers?.toLocaleString() || 0}</td>
                      <td>{event.avgPerUser?.toFixed(2) || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {eventDetails && (
              <div className="event-breakdown">
                <h4>Breakdown for: {eventDetails.name}</h4>
                
                {eventDetails.byPage && (
                  <div className="breakdown-section">
                    <h5>By Page</h5>
                    <ul>
                      {eventDetails.byPage.map((item, index) => (
                        <li key={index}>
                          <span>{item.page}</span>
                          <span>{item.count} events</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {eventDetails.byDevice && (
                  <div className="breakdown-section">
                    <h5>By Device</h5>
                    <ul>
                      {eventDetails.byDevice.map((item, index) => (
                        <li key={index}>
                          <span>{item.device}</span>
                          <span>{item.count} events</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </AnalyticsCard>
    </div>
  );
};
