/**
 * AffiliateDetail — Full detail view for a single affiliate partner.
 * Admins can update status, commission rate, payout info,
 * internal notes, and view referral/conversion history.
 * @route /affiliates/:id
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { affiliateService } from '../../services/affiliateService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export const AffiliateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [affiliate, setAffiliate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [commissionRate, setCommissionRate] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showGenerateCodeModal, setShowGenerateCodeModal] = useState(false);
  
  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCommissionRate, setEditCommissionRate] = useState('');
  const [editAssignedTo, setEditAssignedTo] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAffiliate();
  }, [id]);

  const loadAffiliate = async () => {
    try {
      const data = await affiliateService.getById(id);
      setAffiliate(data);
      setCommissionRate(data.commission_rate || '');
      // Initialize edit form values
      setEditCommissionRate(data.commission_rate || '');
      setEditAssignedTo(data.assigned_to || '');
    } catch (error) {
      toast.error('Failed to load affiliate');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      await affiliateService.addNote(id, newNote);
      toast.success('Note added');
      setNewNote('');
      loadAffiliate();
    } catch (error) {
      toast.error('Failed to add note');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await affiliateService.updateStatus(id, newStatus);
      toast.success('Status updated');
      loadAffiliate();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleLeadStatusChange = async (newStatus) => {
    try {
      await affiliateService.updateLeadStatus(id, newStatus);
      toast.success('Lead status updated');
      loadAffiliate();
    } catch (error) {
      toast.error('Failed to update lead status');
    }
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      await affiliateService.updatePriority(id, newPriority);
      toast.success('Priority updated');
      loadAffiliate();
    } catch (error) {
      toast.error('Failed to update priority');
    }
  };

  const handleMarkContacted = async () => {
    try {
      await affiliateService.markContacted(id);
      toast.success('Marked as contacted');
      loadAffiliate();
    } catch (error) {
      toast.error('Failed to mark as contacted');
    }
  };

  const handleGenerateAffiliateCode = async () => {
    try {
      await affiliateService.generateAffiliateCode(id);
      toast.success('Affiliate code generated successfully');
      setShowGenerateCodeModal(false);
      loadAffiliate();
    } catch (error) {
      toast.error(error.message || 'Failed to generate affiliate code');
    }
  };

  const handleApprove = async () => {
    try {
      await affiliateService.approve(id, commissionRate || null);
      toast.success('Affiliate approved');
      setShowApproveModal(false);
      loadAffiliate();
    } catch (error) {
      toast.error('Failed to approve affiliate');
    }
  };

  const handleReject = async () => {
    const reason = prompt('Enter rejection reason (optional):');
    try {
      await affiliateService.reject(id, reason);
      toast.success('Affiliate rejected');
      loadAffiliate();
    } catch (error) {
      toast.error('Failed to reject affiliate');
    }
  };

  const handleActivate = async () => {
    try {
      await affiliateService.activate(id);
      toast.success('Affiliate activated');
      loadAffiliate();
    } catch (error) {
      toast.error('Failed to activate affiliate');
    }
  };

  const handleDeactivate = async () => {
    try {
      await affiliateService.deactivate(id);
      toast.success('Affiliate deactivated');
      loadAffiliate();
    } catch (error) {
      toast.error('Failed to deactivate affiliate');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this affiliate?')) return;
    try {
      await affiliateService.delete(id);
      toast.success('Affiliate deleted');
      navigate('/affiliates');
    } catch (error) {
      toast.error('Failed to delete affiliate');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleEditToggle = () => {
    if (isEditMode) {
      // Cancel edit - reset values
      setEditCommissionRate(affiliate.commission_rate || '');
      setEditAssignedTo(affiliate.assigned_to || '');
    }
    setIsEditMode(!isEditMode);
  };

  const handleCommissionRateChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setEditCommissionRate(value);
    }
  };

  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      
      // Validate commission rate
      const commissionValue = parseFloat(editCommissionRate);
      if (editCommissionRate && (isNaN(commissionValue) || commissionValue < 0 || commissionValue > 100)) {
        toast.error('Commission rate must be a number between 0 and 100');
        return;
      }

      // Prepare updates
      const updates = {
        commission_rate: editCommissionRate ? commissionValue : null,
        assigned_to: editAssignedTo.trim() || null
      };

      await affiliateService.update(id, updates);
      toast.success('Affiliate information updated successfully');
      setIsEditMode(false);
      loadAffiliate();
    } catch (error) {
      toast.error('Failed to update affiliate information');
      console.error('Update error:', error);
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      approved: 'green',
      rejected: 'red',
      active: 'blue',
      inactive: 'gray',
      suspended: 'purple'
    };
    return colors[status] || 'gray';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'green',
      medium: 'orange',
      high: 'red',
      urgent: 'purple'
    };
    return colors[priority] || 'gray';
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading affiliate details...</p>
    </div>
  );
  
  if (!affiliate) return (
    <div className="error-container">
      <h2>Affiliate Not Found</h2>
      <p>The affiliate you're looking for doesn't exist or has been removed.</p>
      <Link to="/affiliates" className="btn-primary">Back to Affiliates</Link>
    </div>
  );

  return (
    <div className="affiliate-detail">
      <div className="page-header">
        <div className="header-left">
          <h1>Affiliate Details</h1>
          <div className="header-badges">
            <span className={`status-badge status-${affiliate.status}`}>
              {affiliate.status}
            </span>
            <span className={`priority-badge priority-${affiliate.priority}`}>
              {affiliate.priority} Priority
            </span>
            <span className={`lead-status-badge lead-${affiliate.lead_status}`}>
              {affiliate.lead_status}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <Link to="/affiliates" className="btn-secondary">
            ← Back to List
          </Link>
        </div>
      </div>

      <div className="detail-layout">
        {/* Main Content */}
        <div className="detail-main">
          {/* Basic Information Card */}
          <div className="detail-card">
            <div className="card-header">
              <h2>📋 Basic Information</h2>
              <div className="card-actions">
                {!isEditMode ? (
                  <button onClick={handleEditToggle} className="btn-edit">
                    ✏️ Edit
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button 
                      onClick={handleSaveEdit} 
                      className="btn-save"
                      disabled={saving}
                    >
                      {saving ? '💾 Saving...' : '💾 Save'}
                    </button>
                    <button 
                      onClick={handleEditToggle} 
                      className="btn-cancel"
                      disabled={saving}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>👤 Full Name</label>
                <div className="info-value">
                  <span>{affiliate.full_name}</span>
                </div>
              </div>
              <div className="info-item">
                <label>📧 Email Address</label>
                <div className="info-value">
                  <span>{affiliate.email}</span>
                  <button 
                    onClick={() => copyToClipboard(affiliate.email)}
                    className="copy-btn"
                    title="Copy email"
                  >
                    📋
                  </button>
                </div>
              </div>
              <div className="info-item">
                <label>📱 Mobile Number</label>
                <div className="info-value">
                  <span>{affiliate.mobile_number || 'Not provided'}</span>
                  {affiliate.mobile_number && (
                    <button 
                      onClick={() => copyToClipboard(affiliate.mobile_number)}
                      className="copy-btn"
                      title="Copy phone"
                    >
                      📋
                    </button>
                  )}
                </div>
              </div>
              <div className="info-item">
                <label>🏷️ Affiliate Code</label>
                <div className="info-value">
                  {affiliate.affiliate_code ? (
                    <>
                      <span className="affiliate-code-display">{affiliate.affiliate_code}</span>
                      <button 
                        onClick={() => copyToClipboard(affiliate.affiliate_code)}
                        className="copy-btn"
                        title="Copy affiliate code"
                      >
                        📋
                      </button>
                    </>
                  ) : (
                    <div className="no-code">
                      <span>Not generated yet</span>
                      <button 
                        onClick={() => setShowGenerateCodeModal(true)}
                        className="btn-generate-code"
                      >
                        Generate Code
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="info-item">
                <label>💰 Commission Rate</label>
                <div className="info-value">
                  {isEditMode ? (
                    <div className="edit-field">
                      <input
                        type="text"
                        value={editCommissionRate}
                        onChange={handleCommissionRateChange}
                        placeholder="e.g., 10.5"
                        className="commission-rate-input"
                        maxLength="6"
                      />
                      <span className="field-suffix">%</span>
                    </div>
                  ) : (
                    <span>{affiliate.commission_rate ? `${affiliate.commission_rate}%` : 'Not set'}</span>
                  )}
                </div>
              </div>
              <div className="info-item">
                <label>👨‍💼 Assigned To</label>
                <div className="info-value">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editAssignedTo}
                      onChange={(e) => setEditAssignedTo(e.target.value)}
                      placeholder="Enter admin name or email"
                      className="assigned-to-input"
                      maxLength="100"
                    />
                  ) : (
                    <span>{affiliate.assigned_to || 'Unassigned'}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="detail-card">
            <div className="card-header">
              <h2>📝 Description</h2>
            </div>
            <div className="description-content">
              <p>{affiliate.description}</p>
            </div>
          </div>

          {/* Admin Notes Card */}
          <div className="detail-card">
            <div className="card-header">
              <h2>📋 Admin Notes</h2>
            </div>
            <div className="notes-section">
              {affiliate.admin_notes ? (
                <div className="notes-display">
                  <pre className="notes-content">{affiliate.admin_notes}</pre>
                </div>
              ) : (
                <div className="no-notes">
                  <p>No notes added yet</p>
                </div>
              )}
              <div className="add-note-section">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note about this affiliate..."
                  rows="3"
                  className="note-input"
                />
                <button 
                  onClick={handleAddNote} 
                  className="btn-primary"
                  disabled={!newNote.trim()}
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="detail-sidebar">
          {/* Status Management Card */}
          <div className="detail-card">
            <div className="card-header">
              <h3>⚙️ Status Management</h3>
            </div>
            <div className="status-controls">
              <div className="control-group">
                <label>Lead Status</label>
                <select
                  value={affiliate.lead_status}
                  onChange={(e) => handleLeadStatusChange(e.target.value)}
                  className="status-select"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="closed">Closed</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              <div className="control-group">
                <label>Priority</label>
                <select
                  value={affiliate.priority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  className="priority-select"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="control-group">
                <label>Affiliate Status</label>
                <select
                  value={affiliate.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="affiliate-status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="denied">Denied</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="detail-card">
            <div className="card-header">
              <h3>⚡ Quick Actions</h3>
            </div>
            <div className="action-buttons-grid">
              <button onClick={handleMarkContacted} className="action-btn contacted">
                📞 Mark Contacted
              </button>
              
              {affiliate.status === 'pending' && (
                <>
                  <button onClick={() => setShowApproveModal(true)} className="action-btn approve">
                    ✅ Approve
                  </button>
                  <button onClick={handleReject} className="action-btn reject">
                    ❌ Reject
                  </button>
                </>
              )}
              
              {affiliate.status === 'approved' && (
                <button onClick={handleActivate} className="action-btn activate">
                  🚀 Activate
                </button>
              )}
              
              {affiliate.status === 'active' && (
                <button onClick={handleDeactivate} className="action-btn deactivate">
                  ⏸️ Deactivate
                </button>
              )}
              
              <button onClick={handleDelete} className="action-btn delete">
                🗑️ Delete
              </button>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="detail-card">
            <div className="card-header">
              <h3>📅 Timeline</h3>
            </div>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-icon">📝</div>
                <div className="timeline-content">
                  <label>Submitted</label>
                  <p>{format(new Date(affiliate.created_at), 'MMM dd, yyyy')}</p>
                  <span className="timeline-time">{format(new Date(affiliate.created_at), 'HH:mm')}</span>
                </div>
              </div>
              
              {affiliate.last_contacted_at && (
                <div className="timeline-item">
                  <div className="timeline-icon">📞</div>
                  <div className="timeline-content">
                    <label>Last Contacted</label>
                    <p>{format(new Date(affiliate.last_contacted_at), 'MMM dd, yyyy')}</p>
                    <span className="timeline-time">{format(new Date(affiliate.last_contacted_at), 'HH:mm')}</span>
                  </div>
                </div>
              )}
              
              {affiliate.reviewed_at && (
                <div className="timeline-item">
                  <div className="timeline-icon">👀</div>
                  <div className="timeline-content">
                    <label>Reviewed</label>
                    <p>{format(new Date(affiliate.reviewed_at), 'MMM dd, yyyy')}</p>
                    <span className="timeline-time">{format(new Date(affiliate.reviewed_at), 'HH:mm')}</span>
                  </div>
                </div>
              )}
              
              <div className="timeline-item">
                <div className="timeline-icon">🔄</div>
                <div className="timeline-content">
                  <label>Last Updated</label>
                  <p>{format(new Date(affiliate.updated_at), 'MMM dd, yyyy')}</p>
                  <span className="timeline-time">{format(new Date(affiliate.updated_at), 'HH:mm')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Card */}
          <div className="detail-card">
            <div className="card-header">
              <h3>📊 Statistics</h3>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">0</div>
                <div className="stat-label">Referrals</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">$0</div>
                <div className="stat-label">Earnings</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">0%</div>
                <div className="stat-label">Conversion</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Code Modal */}
      {showGenerateCodeModal && (
        <div className="modal-overlay" onClick={() => setShowGenerateCodeModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🏷️ Generate Affiliate Code</h2>
            </div>
            <div className="modal-content">
              <p>Generate a unique affiliate code for <strong>{affiliate.full_name}</strong>?</p>
              <p className="modal-note">This code will be used to track referrals and cannot be changed once generated.</p>
            </div>
            <div className="modal-actions">
              <button onClick={handleGenerateAffiliateCode} className="btn-primary">
                Generate Code
              </button>
              <button onClick={() => setShowGenerateCodeModal(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="modal-overlay" onClick={() => setShowApproveModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✅ Approve Affiliate</h2>
            </div>
            <div className="modal-content">
              <p>Approve <strong>{affiliate.full_name}</strong> as an affiliate?</p>
              <div className="form-group">
                <label>Commission Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  placeholder="e.g., 10.00"
                  className="commission-input"
                />
                <small>Optional: Set a commission rate for this affiliate</small>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={handleApprove} className="btn-primary">
                Approve Affiliate
              </button>
              <button onClick={() => setShowApproveModal(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
