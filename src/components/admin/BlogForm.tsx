'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCreateBlogMutation, useUpdateBlogMutation, useGetAdminBlogsQuery } from '@/store/api/adminApi';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false, loading: () => <div className="h-[300px] border border-neutral-200 rounded-radius-md animate-pulse bg-neutral-50" /> });

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

const inputClass = 'w-full px-4 py-2.5 text-body-sm rounded-radius-md border border-neutral-200 bg-surface-input focus:outline-none focus:ring-2 focus:ring-brand-primary/20';

export default function BlogForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id && !window.location.hash.includes('/new');
  const { data: blogsData } = useGetAdminBlogsQuery(undefined, { skip: !isEdit });
  const [createBlog, { isLoading: creating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: updating }] = useUpdateBlogMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '', slug: '', category: '', content_html: '', content_raw: '',
    featured_image: '', status: 'draft', author: 'PropelusAI Team', tags: '',
    cta_button_text: '', cta_link: '', cta_description: '',
  });
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [editorReady, setEditorReady] = useState(false);

  useEffect(() => { setEditorReady(true); }, []);

  useEffect(() => {
    if (isEdit && blogsData?.data) {
      const raw = blogsData.data;
      const blogs = Array.isArray(raw) ? raw : ((raw as any)?.data as any[] ?? []);
      const blog = blogs.find((b: any) => b._id === id) as Record<string, any> | undefined;
      if (blog) {
        setForm({
          title: blog.title || '', slug: blog.slug || '', category: blog.category || '',
          content_html: blog.content_html || '', content_raw: blog.content_raw || blog.content || '',
          featured_image: blog.featured_image || blog.coverImage || '',
          status: blog.status || 'draft', author: blog.author || 'PropelusAI Team',
          tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''),
          cta_button_text: blog.cta_button_text || '', cta_link: blog.cta_link || '',
          cta_description: blog.cta_description || '',
        });
        if (blog.featured_image) setImagePreview(blog.featured_image);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) { alert('Image must be under 5MB'); return; }
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Only JPG, PNG, and WebP files are allowed'); return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('folder', 'propelusai/blogs');
      const res = await fetch('/api/v1/upload/image', { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success) {
        setForm((p) => ({ ...p, featured_image: json.data.url }));
        setImagePreview(json.data.url);
      } else {
        alert(json.error || 'Upload failed');
      }
    } catch { alert('Upload failed'); }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tempDiv = typeof document !== 'undefined' ? document.createElement('div') : null;
    if (tempDiv) { tempDiv.innerHTML = form.content_html; }
    const plainText = tempDiv?.textContent || tempDiv?.innerText || form.content_raw || '';

    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      content: plainText,
      content_raw: plainText,
      excerpt: plainText.slice(0, 200),
      read_time: Math.max(1, Math.ceil(plainText.split(/\s+/).length / 200)),
    };
    if (isEdit) {
      await updateBlog({ id: id!, ...payload } as any);
    } else {
      await createBlog(payload as any);
    }
    navigate('/blogs');
  };

  const loading = creating || updating;

  const quillModules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      [{ align: [] }],
      ['clean'],
    ],
  }), []);

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/blogs')} className="text-body-sm text-text-muted hover:text-brand-primary flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg> Back
      </button>
      <div className="bg-surface-card border border-neutral-200 rounded-radius-lg p-6">
        <h2 className="text-heading-2 mb-6">{isEdit ? 'Edit Blog' : 'Create New Blog'}</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="text-body-sm font-medium block mb-1">Title</label>
            <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} required className={inputClass} />
          </div>

          {/* Slug */}
          <div>
            <label className="text-body-sm font-medium block mb-1">Slug</label>
            <input type="text" value={form.slug} onChange={(e) => update('slug', e.target.value)} required className={inputClass} />
          </div>

          {/* Category + Status */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-body-sm font-medium block mb-1">Category</label>
              <input type="text" value={form.category} onChange={(e) => update('category', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-body-sm font-medium block mb-1">Status</label>
              <select value={form.status} onChange={(e) => update('status', e.target.value)} className={inputClass}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-body-sm font-medium block mb-1">Tags (comma separated) - hidden from display, used for SEO only</label>
            <input type="text" value={form.tags} onChange={(e) => update('tags', e.target.value)} placeholder="ai, marketing, growth" className={inputClass} />
          </div>

          {/* Featured Image: URL or Upload */}
          <div>
            <label className="text-body-sm font-medium block mb-2">Featured Image</label>
            <div className="flex gap-3 mb-3">
              <button type="button" onClick={() => setImageMode('url')}
                className={`px-4 py-1.5 text-body-sm rounded-radius-md border ${imageMode === 'url' ? 'bg-brand-primary text-white border-brand-primary' : 'border-neutral-200 text-text-muted hover:bg-neutral-50'}`}>
                Image URL
              </button>
              <span className="self-center text-body-sm text-text-muted font-medium">OR</span>
              <button type="button" onClick={() => setImageMode('upload')}
                className={`px-4 py-1.5 text-body-sm rounded-radius-md border ${imageMode === 'upload' ? 'bg-brand-primary text-white border-brand-primary' : 'border-neutral-200 text-text-muted hover:bg-neutral-50'}`}>
                Upload Image
              </button>
            </div>

            {imageMode === 'url' ? (
              <input type="text" value={form.featured_image} onChange={(e) => { update('featured_image', e.target.value); setImagePreview(e.target.value); }}
                placeholder="https://example.com/image.jpg" className={inputClass} />
            ) : (
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                  className="px-4 py-2.5 text-body-sm font-medium border border-neutral-200 rounded-radius-md hover:bg-neutral-50 disabled:opacity-50">
                  {uploading ? 'Uploading...' : 'Choose File'}
                </button>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} className="hidden" />
                <span className="text-caption text-text-muted">JPG, PNG, or WebP. Max 5MB.</span>
              </div>
            )}

            {imagePreview && (
              <div className="mt-3 relative w-48 h-28 rounded-radius-md overflow-hidden border border-neutral-200">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => { setForm((p) => ({ ...p, featured_image: '' })); setImagePreview(''); }}
                  className="absolute top-1 right-1 w-6 h-6 bg-neutral-900/60 text-white rounded-full flex items-center justify-center text-xs hover:bg-neutral-900/80">
                  x
                </button>
              </div>
            )}
          </div>

          {/* Rich Text Content */}
          <div>
            <label className="text-body-sm font-medium block mb-1">Content</label>
            {editorReady ? (
              <div className="blog-editor">
                <ReactQuill
                  theme="snow"
                  value={form.content_html}
                  onChange={(value: string) => setForm((p) => ({ ...p, content_html: value }))}
                  modules={quillModules}
                  placeholder="Write your blog content here..."
                  style={{ minHeight: 300 }}
                />
              </div>
            ) : (
              <textarea rows={12} value={form.content_raw} onChange={(e) => update('content_raw', e.target.value)}
                placeholder="Write your blog content here..." className={inputClass + ' resize-y'} />
            )}
          </div>

          {/* CTA Section */}
          <div className="border border-neutral-200 rounded-radius-lg p-4 space-y-3 bg-neutral-50">
            <h3 className="text-body-sm font-semibold">Blog CTA (optional)</h3>
            <p className="text-caption text-text-muted">Add a call-to-action button that appears inside the blog. The button opens the link in a new tab.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-caption font-medium block mb-1">Button Text</label>
                <input type="text" value={form.cta_button_text} onChange={(e) => update('cta_button_text', e.target.value)}
                  placeholder="Get Started" className={inputClass} />
              </div>
              <div>
                <label className="text-caption font-medium block mb-1">Redirect URL</label>
                <input type="text" value={form.cta_link} onChange={(e) => update('cta_link', e.target.value)}
                  placeholder="https://www.propelusai.com/contact" className={inputClass} />
              </div>
            </div>
            <div>
              <label className="text-caption font-medium block mb-1">Text below button (max 3 lines)</label>
              <textarea rows={2} value={form.cta_description} onChange={(e) => {
                const val = e.target.value;
                if (val.length <= 200) update('cta_description', val);
              }}
                placeholder="Take the first step toward scaling your business with AI." className={inputClass + ' resize-none'} maxLength={200} />
              <span className="text-caption text-text-muted">{form.cta_description.length}/200</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button type="submit" disabled={loading}
              className="px-6 py-2.5 text-body-sm font-medium bg-brand-primary text-white rounded-radius-md hover:bg-brand-accent disabled:opacity-50">
              {loading ? 'Saving...' : (isEdit ? 'Update Blog' : 'Create Blog')}
            </button>
            <button type="button" onClick={() => navigate('/blogs')}
              className="px-6 py-2.5 text-body-sm font-medium border border-neutral-200 rounded-radius-md hover:bg-neutral-50">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        .blog-editor .ql-container { min-height: 300px; font-size: 0.9375rem; }
        .blog-editor .ql-editor { min-height: 280px; }
        .blog-editor .ql-toolbar { background: white; border-radius: 0.5rem 0.5rem 0 0; border-color: #e5e7eb; }
        .blog-editor .ql-container { border-radius: 0 0 0.5rem 0.5rem; border-color: #e5e7eb; background: white; }
      `}</style>
    </div>
  );
}
