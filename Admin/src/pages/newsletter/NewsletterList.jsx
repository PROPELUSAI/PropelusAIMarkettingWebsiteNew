/**
 * NewsletterList — Subscriber management and campaign history.
 * Top section: subscriber stats (total, active, unsubscribed, new this month).
 * Tables: list of subscribers with status toggles, and past campaigns
 * with open/click metrics. Links to NewsletterCompose for new campaigns.
 * @route /newsletter
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { newsletterService } from '../../services/newsletterService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export const NewsletterList = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, unsubscribed: 0, newThisMonth: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [subs, statsData] = await Promise.all([
        newsletterService.getSubscribers(filters),
        newsletterService.getStats(),
      ]);
      setSubscribers(subs);
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, email) => {
    if (!window.confirm(`Permanently delete subscriber ${email}?`)) return;
    try {
      setDeleting(id);
      await newsletterService.deleteSubscriber(id);
      toast.success('Subscriber deleted');
      loadData();
    } catch (error) {
      toast.error('Failed to delete subscriber');
    } finally {
      setDeleting(null);
    }
  };

  const handleUnsubscribe = async (id, email) => {
    if (!window.confirm(`Mark ${email} as unsubscribed?`)) return;
    try {
      await newsletterService.unsubscribeSubscriber(id);
      toast.success('Subscriber marked as unsubscribed');
      loadData();
    } catch (error) {
      toast.error('Failed to update subscriber');
    }
  };

  const statusBadge = (status) => {
    const colors = { active: '#22c55e', unsubscribed: '#94a3b8' };
    return (
      <span style={{
        padding: '2px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
        background: `${colors[status] || '#94a3b8'}22`,
        color: colors[status] || '#94a3b8',
        border: `1px solid ${colors[status] || '#94a3b8'}44`,
        textTransform: 'capitalize',
      }}>
        {status}
      </span>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>📬 Newsletter Subscribers</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
            Manage your subscriber list and send campaigns
          </p>
        </div>
        <Link
          to="/newsletter/compose"
          style={{
            padding: '10px 20px',
            background: '#6366f1',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          ✉️ Compose & Send
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Subscribers', value: stats.total, icon: '👥', color: '#6366f1' },
          { label: 'Active', value: stats.active, icon: '✅', color: '#22c55e' },
          { label: 'Unsubscribed', value: stats.unsubscribed, icon: '🚫', color: '#94a3b8' },
          { label: 'New This Month', value: stats.newThisMonth, icon: '📈', color: '#f59e0b' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
            <div style={{ fontSize: '28px' }}>{icon}</div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color }}>{value}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          style={{
            flex: 1,
            padding: '10px 14px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '14px',
          }}
        />
        <select
          value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          style={{
            padding: '10px 14px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '14px',
            background: '#fff',
          }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="unsubscribed">Unsubscribed</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Loading subscribers...</div>
        ) : subscribers.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
            <div style={{ fontWeight: 600 }}>No subscribers found</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Name', 'Email', 'Source', 'Status', 'Subscribed', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub, i) => (
                <tr key={sub._id || sub.id} style={{
                  borderBottom: '1px solid #f1f5f9',
                  background: i % 2 === 0 ? '#fff' : '#fafafa',
                }}>
                  <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 500 }}>
                    {sub.name || <span style={{ color: '#94a3b8' }}>—</span>}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: '#334155' }}>
                    {sub.email}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '2px 8px',
                      background: '#f1f5f9',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#64748b',
                    }}>
                      {sub.source || 'website'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>{statusBadge(sub.status)}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>
                    {sub.subscribedAt || sub.createdAt
                      ? format(new Date(sub.subscribedAt || sub.createdAt), 'MMM dd, yyyy')
                      : '—'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {sub.status === 'active' && (
                        <button
                          onClick={() => handleUnsubscribe(sub._id || sub.id, sub.email)}
                          style={{
                            padding: '5px 10px',
                            background: '#fff7ed',
                            color: '#ea580c',
                            border: '1px solid #fed7aa',
                            borderRadius: '6px',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          Unsub
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(sub._id || sub.id, sub.email)}
                        disabled={deleting === (sub._id || sub.id)}
                        style={{
                          padding: '5px 10px',
                          background: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          opacity: deleting === (sub._id || sub.id) ? 0.5 : 1,
                        }}
                      >
                        {deleting === (sub._id || sub.id) ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Campaigns section */}
      <div style={{ marginTop: '32px' }}>
        <Link
          to="/newsletter/campaigns"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#6366f1',
            fontWeight: 500,
            fontSize: '14px',
            textDecoration: 'none',
          }}
        >
          📋 View all past campaigns →
        </Link>
      </div>
    </div>
  );
};
