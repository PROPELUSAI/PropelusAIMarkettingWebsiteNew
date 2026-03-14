/**
 * BlogForm — Create or edit a blog post.
 * Multi-tab form: Content (title, slug, body), Media (featured image),
 * SEO (meta title, description, keywords), and Settings (category, tags, status).
 * Auto-generates slug from title and validates required fields.
 * @route /blogs/new  |  /blogs/:id/edit
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import toast from 'react-hot-toast';

export const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSEO, setShowSEO] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    slug: '',
    category: 'AI',
    tags: '',
    content_raw: '',
    content_html: '',
    featured_image: '',
    seo_title: '',
    meta_description: '',
    schema_markup: '',
    canonical_url: '',
    cta_type: '',
    cta_button_text: '',
    cta_link: '',
    status: 'draft',
    is_featured: false,
    publish_date: ''
  });

  useEffect(() => {
    if (isEdit) {
      loadBlog();
    }
  }, [id]);

  useEffect(() => {
    // Auto-generate slug from title
    if (formData.title && !isEdit) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, isEdit]);

  const loadBlog = async () => {
    try {
      const data = await blogService.getById(id);
      setFormData({
        ...data,
        tags: data.tags ? data.tags.join(', ') : '',
        schema_markup: data.schema_markup ? JSON.stringify(data.schema_markup, null, 2) : '',
        publish_date: data.publish_date ? new Date(data.publish_date).toISOString().slice(0, 16) : ''
      });
    } catch (error) {
      toast.error('Failed to load blog');
      navigate('/blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, featured_image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e, submitStatus = null) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.content_raw.trim()) {
      toast.error('Content is required');
      return;
    }

    try {
      setSaving(true);
      
      // Prepare data
      const blogData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        schema_markup: formData.schema_markup ? JSON.parse(formData.schema_markup) : null,
        publish_date: formData.publish_date || null,
        status: submitStatus || formData.status
      };

      // Simple markdown to HTML conversion (basic)
      blogData.content_html = blogData.content_raw
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/\n/gim, '<br>');

      if (isEdit) {
        await blogService.update(id, blogData);
        toast.success('Blog updated successfully');
      } else {
        const created = await blogService.create(blogData);
        toast.success('Blog created successfully');
        navigate(`/blogs/${created.id}`);
        return;
      }
      
      navigate(`/blogs/${id}`);
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = (e) => handleSubmit(e, 'draft');
  const handleSubmitForApproval = (e) => handleSubmit(e, 'pending');
  const handlePublish = (e) => handleSubmit(e, 'published');

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading blog...</p>
    </div>
  );

  return (
    <div className="blog-form">
      <div className="page-header">
        <h1>{isEdit ? 'Edit Blog' : 'Create New Blog'}</h1>
        <div className="header-actions">
          <button 
            type="button" 
            onClick={() => setShowPreview(!showPreview)}
            className="btn-secondary"
          >
            {showPreview ? '✏️ Edit' : '👁️ Preview'}
          </button>
        </div>
      </div>

      {showPreview ? (
        <div className="blog-preview">
          <div className="preview-header">
            <h1>{formData.title}</h1>
            {formData.subtitle && <h3>{formData.subtitle}</h3>}
            <div className="preview-meta">
              <span className="category">{formData.category}</span>
              {formData.tags && (
                <span className="tags">
                  {formData.tags.split(',').map((tag, i) => (
                    <span key={i} className="tag">{tag.trim()}</span>
                  ))}
                </span>
              )}
            </div>
          </div>
          
          {formData.featured_image && (
            <div className="preview-image">
              <img 
                src={formData.featured_image} 
                alt={formData.title}
                loading="lazy"
              />
            </div>
          )}
          
          <div className="preview-content">
            <div dangerouslySetInnerHTML={{ 
              __html: formData.content_raw
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                .replace(/\*(.*)\*/gim, '<em>$1</em>')
                .replace(/\n/gim, '<br>')
            }} />
          </div>
          
          {formData.cta_button_text && (
            <div className="preview-cta">
              <a href={formData.cta_link} className="cta-button">
                {formData.cta_button_text}
              </a>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSaveDraft} className="blog-form-content">
          {/* Basic Information */}
          <div className="form-section">
            <h2>📋 Basic Information</h2>
            
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter blog title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subtitle">Subtitle / Hook</label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Optional subtitle or hook"
              />
            </div>

            <div className="form-group">
              <label htmlFor="slug">Slug *</label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                placeholder="url-friendly-slug"
              />
              <small>Auto-generated from title, but you can edit it</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="AI">AI</option>
                  <option value="Sales">Sales</option>
                  <option value="SaaS">SaaS</option>
                  <option value="HRTech">HRTech</option>
                  <option value="IT Services">IT Services</option>
                  <option value="Automation">Automation</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tags">Tags</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="tag1, tag2, tag3"
                />
                <small>Comma-separated tags</small>
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div className="form-section">
            <h2>✍️ Content</h2>
            
            <div className="form-group">
              <label htmlFor="content_raw">Blog Content * (Markdown supported)</label>
              <textarea
                id="content_raw"
                name="content_raw"
                value={formData.content_raw}
                onChange={handleChange}
                required
                rows="20"
                placeholder="Write your blog content here... Supports markdown: # Heading, ## Subheading, **bold**, *italic*"
              />
              <small>Supports basic markdown: # H1, ## H2, ### H3, **bold**, *italic*</small>
            </div>
          </div>

          {/* Media */}
          <div className="form-section">
            <h2>🖼️ Featured Image (Optional)</h2>
            
            <div className="form-group">
              <label htmlFor="featured_image">Upload Image</label>
              <input
                type="file"
                id="featured_image_file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <small>Or paste image URL below</small>
            </div>

            <div className="form-group">
              <label htmlFor="featured_image">Image URL or Base64</label>
              <input
                type="text"
                id="featured_image"
                name="featured_image"
                value={formData.featured_image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg or data:image/..."
              />
            </div>

            {formData.featured_image && (
              <div className="image-preview">
                <img src={formData.featured_image} alt="Preview" />
              </div>
            )}
          </div>

          {/* SEO Section */}
          <div className="form-section collapsible">
            <div className="section-header" onClick={() => setShowSEO(!showSEO)}>
              <h2>🔍 SEO Settings</h2>
              <span>{showSEO ? '▼' : '▶'}</span>
            </div>
            
            {showSEO && (
              <>
                <div className="form-group">
                  <label htmlFor="seo_title">SEO Title</label>
                  <input
                    type="text"
                    id="seo_title"
                    name="seo_title"
                    value={formData.seo_title}
                    onChange={handleChange}
                    placeholder="SEO optimized title (defaults to blog title)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="meta_description">Meta Description</label>
                  <textarea
                    id="meta_description"
                    name="meta_description"
                    value={formData.meta_description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Brief description for search engines (150-160 characters)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="canonical_url">Canonical URL</label>
                  <input
                    type="url"
                    id="canonical_url"
                    name="canonical_url"
                    value={formData.canonical_url}
                    onChange={handleChange}
                    placeholder="https://example.com/original-post"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="schema_markup">Schema Markup (JSON)</label>
                  <textarea
                    id="schema_markup"
                    name="schema_markup"
                    value={formData.schema_markup}
                    onChange={handleChange}
                    rows="6"
                    placeholder='{"@type": "BlogPosting", ...}'
                  />
                </div>
              </>
            )}
          </div>

          {/* CTA Configuration */}
          <div className="form-section">
            <h2>📢 Call to Action</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cta_type">CTA Type</label>
                <select
                  id="cta_type"
                  name="cta_type"
                  value={formData.cta_type}
                  onChange={handleChange}
                >
                  <option value="">None</option>
                  <option value="Book Demo">Book Demo</option>
                  <option value="Contact">Contact</option>
                  <option value="Affiliate">Affiliate</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="cta_button_text">Button Text</label>
                <input
                  type="text"
                  id="cta_button_text"
                  name="cta_button_text"
                  value={formData.cta_button_text}
                  onChange={handleChange}
                  placeholder="Get Started"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="cta_link">CTA Link (with UTM support)</label>
              <input
                type="url"
                id="cta_link"
                name="cta_link"
                value={formData.cta_link}
                onChange={handleChange}
                placeholder="https://example.com?utm_source=blog&utm_campaign=..."
              />
            </div>
          </div>

          {/* Publishing Controls */}
          <div className="form-section">
            <h2>🚀 Publishing</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="publish_date">Publish Date (optional)</label>
                <input
                  type="datetime-local"
                  id="publish_date"
                  name="publish_date"
                  value={formData.publish_date}
                  onChange={handleChange}
                />
                <small>Leave empty for immediate publishing</small>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                  />
                  <span>⭐ Featured Blog</span>
                </label>
                <small>Featured blogs appear first on the website</small>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/blogs')}
              className="btn-secondary"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-secondary"
              disabled={saving}
            >
              {saving ? 'Saving...' : '💾 Save Draft'}
            </button>
            <button
              type="button"
              onClick={handleSubmitForApproval}
              className="btn-primary"
              disabled={saving}
            >
              {saving ? 'Submitting...' : '📤 Submit for Approval'}
            </button>
            <button
              type="button"
              onClick={handlePublish}
              className="btn-primary"
              disabled={saving}
            >
              {saving ? 'Publishing...' : '🚀 Publish Now'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
