'use client';

import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetAdminBlogsQuery, useDeleteBlogMutation } from '@/store/api/adminApi';

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useGetAdminBlogsQuery();
  const [deleteBlog] = useDeleteBlogMutation();

  const raw = data?.data;
  const blogs = Array.isArray(raw) ? raw : ((raw as any)?.data as any[] ?? []);
  const blog = blogs.find((b: any) => b._id === id) as Record<string, any> | undefined;

  if (!blog) return <div className="p-4 bg-status-error-light text-status-error rounded-radius-md text-body-sm">Blog not found.</div>;

  const handleDelete = async () => { if (confirm('Delete this blog?')) { await deleteBlog(id!); navigate('/blogs'); } };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/blogs')} className="text-body-sm text-text-muted hover:text-brand-primary flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg> Back
      </button>
      <div className="bg-surface-card border border-neutral-200 rounded-radius-lg p-6 space-y-4">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div>
            <h2 className="text-heading-2">{blog.title}</h2>
            <p className="text-body-sm text-text-muted">/{blog.slug}</p>
          </div>
          <div className="flex gap-2">
            <Link to={`/blogs/${id}/edit`} className="px-4 py-2 text-body-sm font-medium bg-brand-primary text-white rounded-radius-md hover:bg-brand-accent">Edit</Link>
            <button onClick={handleDelete} className="px-4 py-2 text-body-sm text-status-error hover:bg-status-error-light rounded-radius-md">Delete</button>
          </div>
        </div>
        <div className="flex gap-3 text-body-sm flex-wrap">
          <span className={`px-2 py-0.5 text-caption rounded-radius-full ${blog.status === 'published' ? 'bg-status-success-light text-status-success' : 'bg-neutral-100 text-text-muted'}`}>{blog.status}</span>
          <span className="text-text-muted">{blog.author}</span>
          <span className="text-text-muted">{blog.category}</span>
          {blog.tags?.length > 0 && (
            <span className="text-text-muted">Tags: {Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags}</span>
          )}
        </div>

        {/* Featured Image */}
        {blog.featured_image && (
          <div className="w-full max-w-md rounded-radius-md overflow-hidden border border-neutral-200">
            <img src={blog.featured_image} alt={blog.title} className="w-full h-48 object-cover" />
          </div>
        )}

        {/* Content */}
        {blog.content_html ? (
          <div className="prose max-w-none text-body-sm border-t border-neutral-100 pt-4" dangerouslySetInnerHTML={{ __html: blog.content_html }} />
        ) : (
          <p className="text-body-sm whitespace-pre-wrap border-t border-neutral-100 pt-4">{blog.content_raw || blog.content || 'No content.'}</p>
        )}

        {/* CTA Info */}
        {(blog.cta_button_text || blog.cta_link) && (
          <div className="border border-neutral-200 rounded-radius-md p-4 bg-neutral-50 space-y-1">
            <h4 className="text-body-sm font-semibold">Blog CTA</h4>
            {blog.cta_button_text && <p className="text-body-sm"><span className="text-text-muted">Button:</span> {blog.cta_button_text}</p>}
            {blog.cta_link && <p className="text-body-sm"><span className="text-text-muted">URL:</span> <a href={blog.cta_link} target="_blank" rel="noopener noreferrer" className="text-brand-primary underline">{blog.cta_link}</a></p>}
            {blog.cta_description && <p className="text-body-sm"><span className="text-text-muted">Description:</span> {blog.cta_description}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
