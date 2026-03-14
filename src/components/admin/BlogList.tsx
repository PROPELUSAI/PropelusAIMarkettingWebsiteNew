'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAdminBlogsQuery } from '@/store/api/adminApi';

export default function BlogList() {
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading, error } = useGetAdminBlogsQuery();

  const raw = data?.data;
  const blogs = Array.isArray(raw) ? raw : ((raw as any)?.data as any[] ?? []);

  const filtered = blogs.filter((b: any) => !statusFilter || b.status === statusFilter);

  if (isLoading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (error) return <div className="p-4 bg-status-error-light text-status-error rounded-radius-md text-body-sm">Failed to load blogs.</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 text-body-sm rounded-radius-md border border-neutral-200 bg-surface-input">
          <option value="">All Status</option><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
        </select>
        <Link to="/blogs/new" className="px-4 py-2.5 text-body-sm font-medium bg-brand-primary text-white rounded-radius-md hover:bg-brand-accent text-center">New Blog</Link>
      </div>
      {filtered.length === 0 ? <div className="text-center py-12 text-text-muted text-body-sm">No blogs found.</div> : (
        <div className="bg-surface-card border border-neutral-200 rounded-radius-lg overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead><tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="text-left px-4 py-3 font-medium text-text-muted">Title</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Status</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted hidden md:table-cell">Author</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted hidden lg:table-cell">Date</th>
            </tr></thead>
            <tbody>{filtered.map((b: any) => (
              <tr key={b._id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3"><Link to={`/blogs/${b._id}`} className="font-medium hover:text-brand-primary">{b.title}</Link></td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 text-caption rounded-radius-full ${b.status === 'published' ? 'bg-status-success-light text-status-success' : 'bg-neutral-100 text-text-muted'}`}>{b.status}</span></td>
                <td className="px-4 py-3 text-text-muted hidden md:table-cell">{b.author || '-'}</td>
                <td className="px-4 py-3 text-text-muted hidden lg:table-cell">{new Date(b.created_at || b.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
