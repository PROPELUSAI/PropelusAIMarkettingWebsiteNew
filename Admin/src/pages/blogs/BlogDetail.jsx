/**
 * BlogDetail — Read-only view of a single blog post.
 * Displays title, author, category, tags, SEO metadata,
 * the full rendered body, and version history.
 * Links to BlogForm for editing and supports delete.
 * @route /blogs/:id
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadBlog();
    loadAnalytics();
  }, [id]);

  const loadBlog = async () => {
    try {
      const data = await blogService.getById(id);
      setBlog(data);
    } catch (error) {
      toast.error('Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const data = await blogService.getAnalytics(id);
      const summary = {
        totalViews: data.filter(e => e.event_type === 'view').length,
        ctaClicks: data.filter(e => e.event_type === 'cta_click').length,
        conversionRate: 0
      };
      if (summary.totalViews > 0) {
        summary.conversionRate = ((summary.ctaClicks / summary.totalViews) * 100).toFixed(2);
      }
      setAnalytics(summary);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const handleApprove = async () => {
    try {
      await blogService.updateStatus(id, 'approved');
      toast.success('Blog approved');
      loadBlog();
    } catch (error) {
      toast.error('Failed to approve blog');
    }
  };

  const handleReject = async () => {
    try {
      await blogService.updateStatus(id, 'pending', rejectionReason);
      toast.success('Blog rejected');
      setShowRejectModal(false);
      setRejectionReason('');
      loadBlog();
    } catch (error) {
      toast.error('Failed to reject blog');
    }
  };

  const handlePublish = async () => {
    try {
      await blogService.updateStatus(id, 'published');
      toast.success('Blog published');
      loadBlog();
    } catch (error) {
      toast.error('Failed to publish blog');
    }
  };

  const handleUnpublish = async () => {
    try {
      await blogService.updateStatus(id, 'draft');
      toast.success('Blog unpublished');
      loadBlog();
    } catch (error) {
      toast.error('Failed to unpublish blog');
    }
  };

  const handleToggleFeatured = async () => {
    try {
      await blogService.toggleFeatured(id);
      toast.success(blog.is_featured ? 'Removed from featured' : 'Marked as featured');
      loadBlog();
    } catch (error) {
      toast.error('Failed to update featured status');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) return;
    try {
      await blogService.delete(id);
      toast.success('Blog deleted');
      navigate('/blogs');
    } catch (error) {
      toast.error('Failed to delete blog');
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading blog...</p>
    </div>
  );

  if (!blog) return (
    <div className="error-container">
      <h2>Blog Not Found</h2>
      <p>The blog you're looking for doesn't exist or has been removed.</p>
      <Link to="/blogs" className="btn-primary">Back to Blogs</Link>
    </div>
  );

  return (
    <div className="blog-detail">
      <div className="page-header">
        <div className="header-left">
          <h1>{blog.title}</h1>
          <div className="header-badges">
            <span className={`status-badge status-${blog.status}`}>
              {blog.status}
            </span>
            {blog.is_featured && (
              <span className="featured-badge">⭐ Featured</span>
            )}
            <span className="category-badge">{blog.category}</span>
          </div>
        </div>
        <div className="header-actions">
          <Link to="/blogs" className="btn-secondary">
            ← Back to List
          </Link>
          <Link to={`/blogs/${id}/edit`} className="btn-primary">
            ✏️ Edit
          </Link>
        </div>
      </div>

      <div className="detail-layout">
        {/* Main Content */}
        <div className="detail-main">
          {/* Blog Content Card */}
          <div className="detail-card">
            <div className="card-header">
              <h2>📝 Content</h2>
            </div>
            
            {blog.subtitle && (
              <div className="blog-subtitle">
                <h3>{blog.subtitle}</h3>
              </div>
            )}

            {blog.featured_image && (
              <div className="blog-featured-image" style={{ width: '100%', maxWidth: '311px', height: '312px' }}>
                <img 
                  src={blog.featured_image} 
                  alt={blog.title}
                  loading="lazy"
                  style={{ width: '311px', height: '312px', objectFit: 'contain' }}
                />
              </div>
            )}

            <div className="blog-content">
              {blog.content_html ? (
                <div dangerouslySetInnerHTML={{ __html: blog.content_html }} />
              ) : (
                <pre>{blog.content_raw}</pre>
              )}
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className="blog-tags">
                <strong>Tags:</strong>
                {blog.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* SEO Information */}
          {(blog.seo_title || blog.meta_description) && (
            <div className="detail-card">
              <div className="card-header">
                <h2>🔍 SEO Information</h2>
              </div>
              <div className="info-grid">
                {blog.seo_title && (
                  <div className="info-item">
                    <label>SEO Title</label>
                    <p>{blog.seo_title}</p>
                  </div>
                )}
                {blog.meta_description && (
                  <div className="info-item">
                    <label>Meta Description</label>
                    <p>{blog.meta_description}</p>
                  </div>
                )}
                {blog.canonical_url && (
                  <div className="info-item">
                    <label>Canonical URL</label>
                    <p>{blog.canonical_url}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CTA Configuration */}
          {blog.cta_type && (
            <div className="detail-card">
              <div className="card-header">
                <h2>📢 Call to Action</h2>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <label>CTA Type</label>
                  <p>{blog.cta_type}</p>
                </div>
                <div className="info-item">
                  <label>Button Text</label>
                  <p>{blog.cta_button_text}</p>
                </div>
                <div className="info-item">
                  <label>Link</label>
                  <p>{blog.cta_link}</p>
                </div>
              </div>
            </div>
          )}

          {/* Rejection Reason */}
          {blog.rejection_reason && (
            <div className="detail-card rejection-card">
              <div className="card-header">
                <h2>❌ Rejection Reason</h2>
              </div>
              <p>{blog.rejection_reason}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="detail-sidebar">
          {/* Quick Actions */}
          <div className="detail-card">
            <div className="card-header">
              <h3>⚡ Quick Actions</h3>
            </div>
            <div className="action-buttons-grid">
              {blog.status === 'pending' && (
                <>
                  <button onClick={handleApprove} className="action-btn approve">
                    ✅ Approve
                  </button>
                  <button onClick={() => setShowRejectModal(true)} className="action-btn reject">
                    ❌ Reject
                  </button>
                </>
              )}
              
              {(blog.status === 'approved' || blog.status === 'draft') && (
                <button onClick={handlePublish} className="action-btn publish">
                  🚀 Publish
                </button>
              )}
              
              {blog.status === 'published' && (
                <button onClick={handleUnpublish} className="action-btn unpublish">
                  ⏸️ Unpublish
                </button>
              )}
              
              <button onClick={handleToggleFeatured} className="action-btn featured">
                {blog.is_featured ? '⭐ Unfeature' : '⭐ Feature'}
              </button>
              
              <button onClick={handleDelete} className="action-btn delete">
                🗑️ Delete
              </button>
            </div>
          </div>

          {/* Blog Info */}
          <div className="detail-card">
            <div className="card-header">
              <h3>ℹ️ Blog Information</h3>
            </div>
            <div className="info-list">
              <div className="info-item">
                <label>Author</label>
                <p>{blog.author?.full_name || blog.author_id || 'Admin'}</p>
              </div>
              <div className="info-item">
                <label>Slug</label>
                <p className="slug-text">{blog.slug}</p>
              </div>
              <div className="info-item">
                <label>Created</label>
                <p>{format(new Date(blog.created_at), 'MMM dd, yyyy HH:mm')}</p>
              </div>
              <div className="info-item">
                <label>Last Updated</label>
                <p>{format(new Date(blog.updated_at), 'MMM dd, yyyy HH:mm')}</p>
              </div>
              {blog.publish_date && (
                <div className="info-item">
                  <label>Published</label>
                  <p>{format(new Date(blog.publish_date), 'MMM dd, yyyy HH:mm')}</p>
                </div>
              )}
              {blog.approved_at && (
                <div className="info-item">
                  <label>Approved</label>
                  <p>{format(new Date(blog.approved_at), 'MMM dd, yyyy HH:mm')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Analytics */}
          {analytics && (
            <div className="detail-card">
              <div className="card-header">
                <h3>📊 Analytics</h3>
              </div>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{blog.view_count || 0}</div>
                  <div className="stat-label">Page Views</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{blog.cta_clicks || 0}</div>
                  <div className="stat-label">CTA Clicks</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{analytics.conversionRate}%</div>
                  <div className="stat-label">Conversion</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>❌ Reject Blog</h2>
            </div>
            <div className="modal-content">
              <p>Provide a reason for rejecting this blog:</p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                rows="4"
                className="rejection-textarea"
              />
            </div>
            <div className="modal-actions">
              <button 
                onClick={handleReject} 
                className="btn-primary"
                disabled={!rejectionReason.trim()}
              >
                Reject Blog
              </button>
              <button onClick={() => setShowRejectModal(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
