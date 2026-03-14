/**
 * ChatList — Table of AI chatbot conversations from the customer website.
 * Displays stats (total, qualified, with messages, empty) and a searchable,
 * filterable list. Each row links to ChatDetail for the full transcript.
 * Data comes from the MongoDB `chatconversations` collection.
 * @route /chats
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { chatService } from '../../services/chatService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export const ChatList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, qualified: 0, withMessages: 0, empty: 0 });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState({
    search: '',
    leadQualified: '',
  });

  useEffect(() => {
    loadChats();
    loadStats();
  }, [filters]);

  const loadChats = async () => {
    try {
      setLoading(true);
      const data = await chatService.getAll({ ...filters, page: pagination.page });
      setConversations(data.conversations || []);
      setPagination({
        page: data.page || 1,
        totalPages: data.totalPages || 1,
        total: data.total || 0,
      });
    } catch (error) {
      toast.error('Failed to load chat conversations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await chatService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load chat stats:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this conversation?')) return;
    try {
      await chatService.delete(id);
      toast.success('Conversation deleted');
      loadChats();
      loadStats();
    } catch (error) {
      toast.error('Failed to delete conversation');
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  useEffect(() => {
    loadChats();
  }, [pagination.page]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy HH:mm');
    } catch {
      return '-';
    }
  };

  return (
    <div className="chat-list">
      <div className="page-header">
        <h1>💬 Chat Conversations</h1>
        <span className="chat-total-badge">{stats.total} total conversations</span>
      </div>

      {/* Stats Cards */}
      <div className="chat-stats-row">
        <div className="chat-stat-card">
          <div className="chat-stat-number">{stats.total}</div>
          <div className="chat-stat-label">Total</div>
        </div>
        <div className="chat-stat-card chat-stat-active">
          <div className="chat-stat-number">{stats.withMessages}</div>
          <div className="chat-stat-label">With Messages</div>
        </div>
        <div className="chat-stat-card chat-stat-closed">
          <div className="chat-stat-number">{stats.empty}</div>
          <div className="chat-stat-label">Empty</div>
        </div>
        <div className="chat-stat-card chat-stat-flagged">
          <div className="chat-stat-number">{stats.qualified}</div>
          <div className="chat-stat-label">Lead Qualified</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by session ID or message content..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          value={filters.leadQualified}
          onChange={(e) => setFilters({ ...filters, leadQualified: e.target.value })}
        >
          <option value="">All Leads</option>
          <option value="true">Qualified Only</option>
          <option value="false">Not Qualified</option>
        </select>
      </div>

      {loading ? (
        <p>Loading conversations...</p>
      ) : conversations.length === 0 ? (
        <div className="empty-state">
          <p>No chat conversations found.</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Session ID</th>
                  <th>Messages</th>
                  <th>Last Message Preview</th>
                  <th>Lead Qualified</th>
                  <th>Lead Score</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {conversations.map((conv) => (
                  <tr key={conv.id}>
                    <td className="mono-text">{conv.sessionId || '-'}</td>
                    <td>
                      <span className="chat-msg-count">{conv.messageCount || 0}</span>
                    </td>
                    <td className="chat-title-cell">
                      {conv.lastMessagePreview ? (
                        <>
                          <span className={`chat-role-badge chat-role-badge-${conv.lastMessageRole}`}>
                            {conv.lastMessageRole === 'assistant' ? '🤖' : '👤'}
                          </span>
                          <span className="chat-preview-text">{conv.lastMessagePreview}</span>
                        </>
                      ) : (
                        <span className="text-muted">No messages</span>
                      )}
                    </td>
                    <td>
                      {conv.leadQualified ? (
                        <span className="badge badge-approved">✅ Yes</span>
                      ) : (
                        <span className="badge badge-closed">No</span>
                      )}
                    </td>
                    <td>{conv.leadScore !== null && conv.leadScore !== undefined ? conv.leadScore : '-'}</td>
                    <td>{formatDate(conv.createdAt)}</td>
                    <td>{formatDate(conv.updatedAt)}</td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/chats/${conv.id}`} className="btn-link">
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(conv.id)}
                          className="btn-link btn-danger-link"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="chat-pagination">
              <button
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="btn-secondary"
              >
                ← Previous
              </button>
              <span className="chat-page-info">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} conversations)
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="btn-secondary"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
