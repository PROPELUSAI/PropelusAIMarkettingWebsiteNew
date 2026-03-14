/**
 * ChatDetail — Full transcript view of a single chatbot conversation.
 * Shows visitor metadata (IP, user-agent, page URL), lead qualification
 * status, collected user info (name/email/phone), and the complete
 * message history rendered as chat bubbles.
 * @route /chats/:id
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chatService } from '../../services/chatService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export const ChatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversation();
  }, [id]);

  const loadConversation = async () => {
    try {
      setLoading(true);
      const data = await chatService.getById(id);
      setConversation(data);
    } catch (error) {
      toast.error('Failed to load conversation');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), 'PPpp');
    } catch {
      return '-';
    }
  };

  const formatMessageTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr), 'MMM dd, HH:mm:ss');
    } catch {
      return '';
    }
  };

  if (loading) return <p>Loading conversation...</p>;
  if (!conversation) return <p>Conversation not found</p>;

  const messages = conversation.messages || [];
  const metadata = conversation.metadata || {};

  return (
    <div className="chat-detail">
      <div className="page-header">
        <h1>💬 Conversation Details</h1>
        <div className="page-header-actions">
          <button onClick={() => navigate('/chats')} className="btn-secondary">
            Back to List
          </button>
        </div>
      </div>

      <div className="detail-grid">
        {/* Session Info */}
        <div className="detail-section">
          <h2>Session Information</h2>
          <div className="info-row">
            <label>Session ID:</label>
            <span className="mono-text">{conversation.sessionId || 'N/A'}</span>
          </div>
          <div className="info-row">
            <label>Messages:</label>
            <span className="chat-msg-count">{conversation.messageCount || messages.length}</span>
          </div>
          <div className="info-row">
            <label>Lead Qualified:</label>
            <span>
              {conversation.leadQualified ? (
                <span className="badge badge-approved">✅ Yes</span>
              ) : (
                <span className="badge badge-closed">No</span>
              )}
            </span>
          </div>
          <div className="info-row">
            <label>Lead Score:</label>
            <span>{conversation.leadScore !== null && conversation.leadScore !== undefined ? conversation.leadScore : 'N/A'}</span>
          </div>
          <div className="info-row">
            <label>Created:</label>
            <span>{formatDate(conversation.createdAt)}</span>
          </div>
          <div className="info-row">
            <label>Updated:</label>
            <span>{formatDate(conversation.updatedAt)}</span>
          </div>
        </div>

        {/* Metadata */}
        <div className="detail-section">
          <h2>Metadata</h2>
          {Object.keys(metadata).length > 0 ? (
            Object.entries(metadata).map(([key, value]) => (
              <div className="info-row" key={key}>
                <label>{key}:</label>
                <span className="mono-text">
                  {typeof value === 'object' ? JSON.stringify(value) : String(value ?? 'N/A')}
                </span>
              </div>
            ))
          ) : (
            <p className="text-muted">No metadata available</p>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="chat-messages-section">
        <h2>Chat Messages ({messages.length})</h2>
        <div className="chat-messages-container">
          {messages.length === 0 ? (
            <p className="empty-state">No messages in this conversation.</p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message chat-message-${msg.role || 'user'}`}
              >
                <div className="chat-message-header">
                  <span className={`chat-role chat-role-${msg.role || 'user'}`}>
                    {msg.role === 'assistant' ? '🤖 Assistant' : msg.role === 'system' ? '⚙️ System' : '👤 User'}
                  </span>
                  <span className="chat-message-time">
                    {formatMessageTime(msg.timestamp || msg.createdAt)}
                  </span>
                </div>
                <div className="chat-message-content">
                  {msg.content || msg.text || ''}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
