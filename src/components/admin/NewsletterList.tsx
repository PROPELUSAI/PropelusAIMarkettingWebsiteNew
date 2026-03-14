'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetSubscribersQuery, useGetCampaignsQuery } from '@/store/api/adminApi';

export default function NewsletterList() {
  const [tab, setTab] = useState<'subscribers' | 'campaigns'>('subscribers');
  const { data: subData, isLoading: subLoading } = useGetSubscribersQuery();
  const { data: campData, isLoading: campLoading } = useGetCampaignsQuery();

  const subRaw = subData?.data;
  const subscribers = Array.isArray(subRaw) ? subRaw : ((subRaw as any)?.data as any[] ?? []);
  const campRaw = campData?.data;
  const campaigns = Array.isArray(campRaw) ? campRaw : ((campRaw as any)?.data as any[] ?? []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="flex gap-1 bg-neutral-100 rounded-radius-md p-1">
          {(['subscribers', 'campaigns'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 text-body-sm font-medium rounded-radius-sm capitalize transition-colors ${tab === t ? 'bg-surface-card shadow-shadow-sm text-text-primary' : 'text-text-muted hover:text-text-primary'}`}>{t}</button>
          ))}
        </div>
        <Link to="/newsletter/compose" className="px-4 py-2.5 text-body-sm font-medium bg-brand-primary text-white rounded-radius-md hover:bg-brand-accent">Compose Campaign</Link>
      </div>

      {tab === 'subscribers' && (
        subLoading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" /></div> :
        subscribers.length === 0 ? <div className="text-center py-12 text-text-muted text-body-sm">No subscribers yet.</div> : (
          <div className="bg-surface-card border border-neutral-200 rounded-radius-lg overflow-x-auto">
            <table className="w-full text-body-sm">
              <thead><tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="text-left px-4 py-3 font-medium text-text-muted">Email</th>
                <th className="text-left px-4 py-3 font-medium text-text-muted hidden md:table-cell">Name</th>
                <th className="text-left px-4 py-3 font-medium text-text-muted hidden md:table-cell">Source</th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">Status</th>
              </tr></thead>
              <tbody>{subscribers.map((s: any) => (
                <tr key={s._id} className="border-b border-neutral-100">
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3 text-text-muted hidden md:table-cell">{s.name || '-'}</td>
                  <td className="px-4 py-3 text-text-muted hidden md:table-cell">{s.source}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 text-caption rounded-radius-full ${s.status === 'active' ? 'bg-status-success-light text-status-success' : 'bg-neutral-100 text-text-muted'}`}>{s.status}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )
      )}

      {tab === 'campaigns' && (
        campLoading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" /></div> :
        campaigns.length === 0 ? <div className="text-center py-12 text-text-muted text-body-sm">No campaigns yet.</div> : (
          <div className="bg-surface-card border border-neutral-200 rounded-radius-lg overflow-x-auto">
            <table className="w-full text-body-sm">
              <thead><tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="text-left px-4 py-3 font-medium text-text-muted">Subject</th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">Status</th>
                <th className="text-left px-4 py-3 font-medium text-text-muted hidden md:table-cell">Recipients</th>
                <th className="text-left px-4 py-3 font-medium text-text-muted hidden md:table-cell">Sent</th>
              </tr></thead>
              <tbody>{campaigns.map((c: Record<string, string>) => (
                <tr key={c._id} className="border-b border-neutral-100">
                  <td className="px-4 py-3 font-medium">{c.subject}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 text-caption rounded-radius-full ${c.status === 'sent' ? 'bg-status-success-light text-status-success' : 'bg-neutral-100 text-text-muted'}`}>{c.status}</span></td>
                  <td className="px-4 py-3 text-text-muted hidden md:table-cell">{c.recipientCount}</td>
                  <td className="px-4 py-3 text-text-muted hidden md:table-cell">{c.sentAt ? new Date(c.sentAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
