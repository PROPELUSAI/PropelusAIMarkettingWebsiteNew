'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetContactsQuery } from '@/store/api/adminApi';

const statuses = ['', 'open', 'in_progress', 'contacted', 'qualified', 'converted', 'closed', 'lost'];

export default function ContactList() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading, error } = useGetContactsQuery();

  const raw = data?.data;
  const contacts = Array.isArray(raw) ? raw : ((raw as any)?.data as any[] ?? []);

  const filtered = contacts.filter((c: any) => {
    const ms = !search || c.fullName?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase());
    const mst = !statusFilter || c.leadStatus === statusFilter || c.status === statusFilter;
    return ms && mst;
  });

  if (isLoading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (error) return <div className="p-4 bg-status-error-light text-status-error rounded-radius-md text-body-sm">Failed to load contacts.</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input type="text" placeholder="Search name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 px-4 py-2.5 text-body-sm rounded-radius-md border border-neutral-200 bg-surface-input focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 text-body-sm rounded-radius-md border border-neutral-200 bg-surface-input">
          {statuses.map((s) => <option key={s} value={s}>{s || 'All Status'}</option>)}
        </select>
      </div>
      {filtered.length === 0 ? <div className="text-center py-12 text-text-muted text-body-sm">No contacts found.</div> : (
        <div className="bg-surface-card border border-neutral-200 rounded-radius-lg overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead><tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="text-left px-4 py-3 font-medium text-text-muted">Name</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Email</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted hidden md:table-cell">Interest</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Status</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted hidden lg:table-cell">Date</th>
            </tr></thead>
            <tbody>{filtered.map((c: any) => (
              <tr key={c._id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3"><Link to={`/contacts/${c._id}`} className="font-medium hover:text-brand-primary">{c.fullName}</Link></td>
                <td className="px-4 py-3 text-text-muted">{c.email}</td>
                <td className="px-4 py-3 text-text-muted hidden md:table-cell">{c.interest || '-'}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 text-caption rounded-radius-full bg-neutral-100">{c.leadStatus || c.status}</span></td>
                <td className="px-4 py-3 text-text-muted hidden lg:table-cell">{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
