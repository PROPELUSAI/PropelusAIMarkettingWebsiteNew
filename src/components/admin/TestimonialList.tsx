'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAdminTestimonialsQuery } from '@/store/api/adminApi';

export default function TestimonialList() {
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading, error } = useGetAdminTestimonialsQuery();

  const raw = data?.data;
  const items = Array.isArray(raw) ? raw : ((raw as any)?.data as any[] ?? []);
  const filtered = items.filter((t: any) => !statusFilter || t.status === statusFilter);

  if (isLoading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (error) return <div className="p-4 bg-status-error-light text-status-error rounded-radius-md text-body-sm">Failed to load testimonials.</div>;

  return (
    <div className="space-y-4">
      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 text-body-sm rounded-radius-md border border-neutral-200 bg-surface-input">
        <option value="">All Status</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
      </select>
      {filtered.length === 0 ? <div className="text-center py-12 text-text-muted text-body-sm">No testimonials found.</div> : (
        <div className="grid gap-4">
          {filtered.map((t: any) => (
            <Link key={t._id} to={`/testimonials/${t._id}`} className="bg-surface-card border border-neutral-200 rounded-radius-lg p-5 hover:shadow-shadow-md transition-shadow block">
              <div className="flex justify-between items-start mb-2">
                <div><p className="text-body-sm font-medium">{t.fullName}</p><p className="text-caption text-text-muted">{t.email}</p></div>
                <span className={`px-2 py-0.5 text-caption rounded-radius-full ${t.status === 'approved' ? 'bg-status-success-light text-status-success' : t.status === 'rejected' ? 'bg-status-error-light text-status-error' : 'bg-status-warning-light text-status-warning'}`}>{t.status}</span>
              </div>
              <p className="text-body-sm text-text-muted line-clamp-2">{t.testimonial}</p>
              {t.rating && <p className="text-caption text-text-muted mt-2">Rating: {t.rating}/5</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
