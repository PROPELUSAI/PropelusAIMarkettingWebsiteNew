'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAffiliatesQuery } from '@/store/api/adminApi';

export default function AffiliateList() {
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading, error } = useGetAffiliatesQuery();

  const raw = data?.data;
  const items = Array.isArray(raw) ? raw : ((raw as any)?.data as any[] ?? []);
  const filtered = items.filter((a: any) => !statusFilter || a.status === statusFilter);

  if (isLoading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (error) return <div className="p-4 bg-status-error-light text-status-error rounded-radius-md text-body-sm">Failed to load affiliates.</div>;

  return (
    <div className="space-y-4">
      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 text-body-sm rounded-radius-md border border-neutral-200 bg-surface-input">
        <option value="">All Status</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
      </select>
      {filtered.length === 0 ? <div className="text-center py-12 text-text-muted text-body-sm">No affiliates found.</div> : (
        <div className="bg-surface-card border border-neutral-200 rounded-radius-lg overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead><tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="text-left px-4 py-3 font-medium text-text-muted">Name</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Email</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted hidden md:table-cell">Code</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Status</th>
            </tr></thead>
            <tbody>{filtered.map((a: any) => (
              <tr key={a._id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3"><Link to={`/affiliates/${a._id}`} className="font-medium hover:text-brand-primary">{a.fullName}</Link></td>
                <td className="px-4 py-3 text-text-muted">{a.email}</td>
                <td className="px-4 py-3 text-text-muted hidden md:table-cell font-mono">{a.affiliateCode || '-'}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 text-caption rounded-radius-full ${a.status === 'approved' ? 'bg-status-success-light text-status-success' : a.status === 'rejected' ? 'bg-status-error-light text-status-error' : 'bg-neutral-100 text-text-muted'}`}>{a.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
