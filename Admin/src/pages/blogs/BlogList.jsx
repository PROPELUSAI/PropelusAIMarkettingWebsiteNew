/**
 * BlogList — Paginated table of all blog posts.
 * Supports search, status filtering (draft/published/archived),
 * category filtering, and links to BlogDetail / BlogForm for editing.
 * @route /blogs
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  useEffect(() => {
    loadBlogs();
  }, [filters]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      console.log('Loading blogs with filters:', filters);
      const data = await blogService.getAll(filters);
      console.log('Blogs loaded:', data);
      setBlogs(data || []);
    } catch (error) {
      console.error('Failed to load blogs:', error);
      toast.error('Failed to load blogs');
      setBlogs([]);
    } finally {
      setLoading(false);
      console.log('Loading complete');
    }
  };

  const handlePublish = async (id) => {
    try {
      await blogService.updateStatus(id, 'published');
      toast.success('Blog published');
      loadBlogs();
    } catch (error) {
      toast.error('Failed to publish blog');
    }
  };

  const handleUnpublish = async (id) => {
    try {
      await blogService.updateStatus(id, 'draft');
      toast.success('Blog unpublished');
      loadBlogs();
    } catch (error) {
      toast.error('Failed to unpublish blog');
    }
  };

  const handleArchive = async (id) => {
    if (!confirm('Archive this blog?')) return;
    try {
      await blogService.updateStatus(id, 'archived');
      toast.success('Blog archived');
      loadBlogs();
    } catch (error) {
      toast.error('Failed to archive blog');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) return;
    try {
      await blogService.delete(id);
      toast.success('Blog deleted');
      loadBlogs();
    } catch (error) {
      toast.error('Failed to delete blog');
    }
  };

  const handleApprove = async (id) => {
    try {
      await blogService.updateStatus(id, 'approved');
      toast.success('Blog approved');
      loadBlogs();
    } catch (error) {
      toast.error('Failed to approve blog');
    }
  };

  return (
    <div className="blog-list">
      <div className="page-header">
        <h1>Blog Management</h1>
        <Link to="/blogs/new" className="btn-primary">
          + Create Blog
        </Link>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by title or tags..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option value="AI">AI</option>
          <option value="Sales">Sales</option>
          <option value="SaaS">SaaS</option>
          <option value="HRTech">HRTech</option>
          <option value="IT Services">IT Services</option>
          <option value="Automation">Automation</option>
        </select>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
        >
          <option value="publish_date">Publish Date</option>
          <option value="view_count">Views</option>
          <option value="created_at">Created Date</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Blog Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Author</th>
                <th>Publish Date</th>
                <th>Featured</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    No blogs found. Create your first blog post!
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog.id}>
                    <td>
                      <div className="blog-title-cell">
                        {blog.title}
                        {blog.subtitle && <small>{blog.subtitle}</small>}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-category`}>
                        {blog.category}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${blog.status}`}>
                        {blog.status}
                      </span>
                    </td>
                    <td>{blog.author?.full_name || 'Admin'}</td>
                    <td>
                      {blog.publish_date 
                        ? format(new Date(blog.publish_date), 'MMM dd, yyyy')
                        : '-'}
                    </td>
                    <td>
                      <span className={blog.is_featured ? 'featured-yes' : 'featured-no'}>
                        {blog.is_featured ? '⭐ Yes' : 'No'}
                      </span>
                    </td>
                    <td>{blog.view_count || 0}</td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/blogs/${blog.id}`} className="btn-link">
                          View
                        </Link>
                        <Link to={`/blogs/${blog.id}/edit`} className="btn-link">
                          Edit
                        </Link>
                        {blog.status === 'pending' && (
                          <button
                            onClick={() => handleApprove(blog.id)}
                            className="btn-approve"
                          >
                            Approve
                          </button>
                        )}
                        {(blog.status === 'approved' || blog.status === 'draft') && (
                          <button
                            onClick={() => handlePublish(blog.id)}
                            className="btn-primary"
                          >
                            Publish
                          </button>
                        )}
                        {blog.status === 'published' && (
                          <button
                            onClick={() => handleUnpublish(blog.id)}
                            className="btn-secondary"
                          >
                            Unpublish
                          </button>
                        )}
                        <button
                          onClick={() => handleArchive(blog.id)}
                          className="btn-secondary"
                        >
                          Archive
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="btn-deny"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
