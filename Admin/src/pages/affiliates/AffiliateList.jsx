/**
 * AffiliateList — Paginated table of affiliate partner registrations.
 * Supports search (name/email/code), status filtering, sorting,
 * and links to AffiliateDetail for full management.
 * @route /affiliates
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { affiliateService } from '../../services/affiliateService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export const AffiliateList = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    leadStatus: '',
    priority: '',
  });

  useEffect(() => {
    loadAffiliates();
  }, [filters]);

  const loadAffiliates = async () => {
    console.log('🔄 AffiliateList.loadAffiliates() called with filters:', filters);
    try {
      setLoading(true);
      console.log('⏳ Loading affiliates...');
      
      const data = await affiliateService.getAll(filters);
      
      console.log('📋 AffiliateList received data:', {
        data: data,
        length: data?.length || 0,
        isArray: Array.isArray(data),
        firstItem: data?.[0] || null
      });
      
      setAffiliates(data);
      console.log('✅ AffiliateList state updated with', data?.length || 0, 'affiliates');
    } catch (error) {
      console.error('❌ AffiliateList.loadAffiliates() error:', error);
      toast.error('Failed to load affiliates');
    } finally {
      setLoading(false);
      console.log('🏁 AffiliateList loading finished');
    }
  };

  const handleQuickApprove = async (id) => {
    try {
      await affiliateService.approve(id);
      toast.success('Affiliate approved');
      loadAffiliates();
    } catch (error) {
      toast.error('Failed to approve affiliate');
    }
  };

  const handleQuickReject = async (id) => {
    try {
      await affiliateService.reject(id);
      toast.success('Affiliate rejected');
      loadAffiliates();
    } catch (error) {
      toast.error('Failed to reject affiliate');
    }
  };

  const handleGenerateAffiliateCode = async (id) => {
    try {
      await affiliateService.generateAffiliateCode(id);
      toast.success('Affiliate code generated successfully');
      loadAffiliates();
    } catch (error) {
      toast.error(error.message || 'Failed to generate affiliate code');
    }
  };

  return (
    <div className="affiliate-list">
      <div className="page-header">
        <h1>Affiliate Registrations</h1>
        <Link to="/affiliates/kanban" className="btn-secondary">
          Kanban View
        </Link>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          value={filters.leadStatus}
          onChange={(e) => setFilters({ ...filters, leadStatus: e.target.value })}
        >
          <option value="">All Lead Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="in_review">In Review</option>
          <option value="qualified">Qualified</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <option value="">All Priority</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* <div style={{ marginBottom: '10px', padding: '10px', background: '#f0f0f0', fontSize: '12px' }}>
            <strong>Debug Info:</strong> Found {affiliates?.length || 0} affiliates | 
            Loading: {loading.toString()} | 
            Filters: {JSON.stringify(filters)}
          </div> */}
          <div className="table-container">
            <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Lead Status</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Affiliate Code</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map((affiliate) => (
                <tr key={affiliate.id}>
                  <td>{affiliate.full_name}</td>
                  <td>{affiliate.email}</td>
                  <td>{affiliate.mobile_number}</td>
                  <td>
                    <span className={`badge badge-${affiliate.lead_status}`}>
                      {affiliate.lead_status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${affiliate.priority}`}>
                      {affiliate.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${affiliate.status}`}>
                      {affiliate.status}
                    </span>
                  </td>
                  <td>{affiliate.affiliate_code || '-'}</td>
                  <td>{format(new Date(affiliate.created_at), 'MMM dd, yyyy')}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/affiliates/${affiliate.id}`} className="btn-link">
                        View
                      </Link>
                      {!affiliate.affiliate_code && (
                        <button
                          onClick={() => handleGenerateAffiliateCode(affiliate.id)}
                          className="btn-primary"
                          title="Generate Affiliate Code"
                        >
                          Generate Code
                        </button>
                      )}
                      {affiliate.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleQuickApprove(affiliate.id)}
                            className="btn-approve"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleQuickReject(affiliate.id)}
                            className="btn-deny"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}
    </div>
  );
};
