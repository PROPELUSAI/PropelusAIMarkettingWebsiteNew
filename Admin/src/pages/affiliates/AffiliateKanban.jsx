/**
 * AffiliateKanban — Kanban board for affiliate lead pipeline.
 * Columns: New → Contacted → In Review → Qualified → Approved / Rejected.
 * Drag-and-drop updates lead_status via the affiliates API.
 * @route /affiliates/kanban
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { affiliateService } from '../../services/affiliateService';
import toast from 'react-hot-toast';

const LEAD_STATUSES = [
  { value: 'new', label: 'New', color: '#635BFF' },
  { value: 'contacted', label: 'Contacted', color: '#00D4FF' },
  { value: 'in_review', label: 'In Review', color: '#FFA500' },
  { value: 'qualified', label: 'Qualified', color: '#32CD32' },
  { value: 'approved', label: 'Approved', color: '#228B22' },
  { value: 'active', label: 'Active', color: '#00C853' },
  { value: 'rejected', label: 'Rejected', color: '#DC143C' },
  { value: 'inactive', label: 'Inactive', color: '#808080' },
];

export const AffiliateKanban = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAffiliates();
  }, []);

  const loadAffiliates = async () => {
    console.log('🔄 AffiliateKanban.loadAffiliates() called');
    try {
      console.log('⏳ Kanban loading affiliates...');
      const data = await affiliateService.getAll();
      
      console.log('📋 AffiliateKanban received data:', {
        data: data,
        length: data?.length || 0,
        isArray: Array.isArray(data),
        sample: data?.slice(0, 2) || []
      });
      
      setAffiliates(data);
      console.log('✅ AffiliateKanban state updated with', data?.length || 0, 'affiliates');
    } catch (error) {
      console.error('❌ AffiliateKanban.loadAffiliates() error:', error);
      toast.error('Failed to load affiliates');
    } finally {
      setLoading(false);
      console.log('🏁 AffiliateKanban loading finished');
    }
  };

  const handleStatusChange = async (affiliateId, newStatus) => {
    try {
      await affiliateService.updateLeadStatus(affiliateId, newStatus);
      toast.success('Status updated');
      loadAffiliates();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handlePriorityChange = async (affiliateId, newPriority) => {
    try {
      await affiliateService.updatePriority(affiliateId, newPriority);
      toast.success('Priority updated');
      loadAffiliates();
    } catch (error) {
      toast.error('Failed to update priority');
    }
  };

  const getAffiliatesByStatus = (status) => {
    return affiliates.filter((a) => a.lead_status === status);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="kanban-view">
      <div className="page-header">
        <h1>Affiliates Kanban</h1>
        <Link to="/affiliates" className="btn-secondary">
          List View
        </Link>
      </div>

      <div className="kanban-board">
        {LEAD_STATUSES.map((status) => (
          <div key={status.value} className="kanban-column">
            <div className="column-header" style={{ borderTopColor: status.color }}>
              <h3>{status.label}</h3>
              <span className="count">{getAffiliatesByStatus(status.value).length}</span>
            </div>
            <div className="column-content">
              {getAffiliatesByStatus(status.value).map((affiliate) => (
                <div key={affiliate.id} className="kanban-card">
                  <div className="card-header">
                    <h4>{affiliate.full_name}</h4>
                    <select
                      value={affiliate.priority}
                      onChange={(e) => handlePriorityChange(affiliate.id, e.target.value)}
                      className="priority-select"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <p className="email">{affiliate.email}</p>
                  <p className="mobile">{affiliate.mobile_number}</p>
                  {affiliate.affiliate_code && (
                    <p className="affiliate-code">
                      <strong>Code:</strong> {affiliate.affiliate_code}
                    </p>
                  )}
                  <span className={`badge badge-${affiliate.status}`}>
                    {affiliate.status}
                  </span>
                  <div className="card-actions">
                    <Link to={`/affiliates/${affiliate.id}`}>View Details</Link>
                    <select
                      value={affiliate.lead_status}
                      onChange={(e) => handleStatusChange(affiliate.id, e.target.value)}
                      className="status-select"
                    >
                      {LEAD_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
