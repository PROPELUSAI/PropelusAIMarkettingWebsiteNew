'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCreateBlogMutation, useUpdateBlogMutation, useGetAdminBlogsQuery } from '@/store/api/adminApi';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

export default function BlogForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id && !window.location.hash.includes('/new');
  const { data: blogsData } = useGetAdminBlogsQuery(undefined, { skip: !isEdit });
  const [createBlog, { isLoading: creating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: updating }] = useUpdateBlogMutation();

  const [form, setForm] = useState({ title: '', slug: '', category: '', content_raw: '', featured_image: '', status: 'draft', author: 'PropelusAI Team', tags: '' });

  useEffect(() => {
    if (isEdit && blogsData?.data) {
      const raw = blogsData.data;
      const blogs = Array.isArray(raw) ? raw : ((raw as any)?.data as any[] ?? []);
      const blog = blogs.find((b: any) => b._id === id) as Record<string, string> | undefined;
      if (blog) {
        setForm({
          title: blog.title || '', slug: blog.slug || '', category: blog.category || '',
          content_raw: blog.content_raw || blog.content || '', featured_image: blog.featured_image || blog.coverImage || '',
          status: blog.status || 'draft', author: blog.author || 'PropelusAI Team',
          tags: Array.isArray(blog.tags) ? (blog.tags as unknown as string[]).join(', ') : (blog.tags || ''),
        });
      }
    }
  }, [isEdit, blogsData, id]);

  const update = (field: string, value: string) => {
    setForm((p) => {
      const next = { ...p, [field]: value };
      if (field === 'title' && !isEdit) next.slug = slugify(value);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = { ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean), content: form.content_raw, excerpt: form.content_raw.slice(0, 200) };
    if (isEdit) {
      await updateBlog({ id: id!, ...payload });
    } else {
      await createBlog(payload);
    }
    navigate('/blogs');
  };

  const loading = creating || updating;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/blogs')} className="text-body-sm text-text-muted hover:text-brand-primary flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg> Back
      </button>
      <div className="bg-surface-card border border-neutral-200 rounded-radius-lg p-6">
        <h2 className="text-heading-2 mb-6">{isEdit ? 'Edit Blog' : 'Create New Blog'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-body-sm font-medium block mb-1">Title</label><input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} required className="w-full px-4 py-2.5 text-body-sm rounded-radius-md border border-neutral-200 bg-surface-input focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
          <div><label className="text-body-sm font-medium block mb-1">Slug</label><input type="text" value={form.slug} onChange={(e) => update('slug', e.target.value)} required className="w-full px-4 py-2.5 text-body-sm rounded-radius-md border border-neutral-200 bg-surface-input focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="text-body-sm font-medium block mb-1">Category</label><input type="text" value={form.category} onChange={(e) => update('category', e.target.value)} className="w-full px-4 py-2.5 text-body-sm rounded-radius-md border border-neutral-200 bg-surface-input focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
            <div><label className="text-body-sm font-medium block mb-1">Status</label><select value={form.status} onChange={(e) => update('status', e.target.value)} className="w-full px-4 py-2.5 text-body-sm rounded-radius-md border border-neutral-200 bg-surface-input"><option value="draft">Draft</option><option value="published">Published</option></select></div>
          </div>
          <div><label className="text-body-sm font-medium block mb-1">Tags (comma separated)</label><input type="text" value={form.tags} onChange={(e) => update('tags', e.target.value)} placeholder="ai, marketing, growth" className="w-full px-4 py-2.5 text-body-sm rounded-radius-md border border-neutral-200 bg-surface-input focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
          <div><label className="text-body-sm font-medium block mb-1">Featured Image URL</label><input type="text" value={form.featured_image} onChange={(e) => update('featured_image', e.target.value)} className="w-full px-4 py-2.5 text-body-sm rounded-radius-md border border-neutral-200 bg-surface-input focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
          <div><label className="text-body-sm font-medium block mb-1">Content</label><textarea rows={12} value={form.content_raw} onChange={(e) => update('content_raw', e.target.value)} required className="w-full px-4 py-2.5 text-body-sm rounded-radius-md border border-neutral-200 bg-surface-input resize-y focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="px-6 py-2.5 text-body-sm font-medium bg-brand-primary text-white rounded-radius-md hover:bg-brand-accent disabled:opacity-50">{loading ? 'Saving...' : (isEdit ? 'Update Blog' : 'Create Blog')}</button>
            <button type="button" onClick={() => navigate('/blogs')} className="px-6 py-2.5 text-body-sm font-medium border border-neutral-200 rounded-radius-md hover:bg-neutral-50">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
