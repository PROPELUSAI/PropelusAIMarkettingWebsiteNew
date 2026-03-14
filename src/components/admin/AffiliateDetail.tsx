'use client';

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetAffiliatesQuery, useUpdateAffiliateStatusMutation, useDeleteAffiliateMutation } from '@/store/api/adminApi';

export default function AffiliateDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useGetAffiliatesQuery();
  const [updateStatus, { isLoading: updating }] = useUpdateAffiliateStatusMutation();
  const [deleteAff] = useDeleteAffiliateMutation();
  const [notes, setNotes] = useState('');

  const raw = data?.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const all: any[] = Array.isArray(raw) ? raw : ((raw as any)?.data ?? []);
  const a = all.find((x) => x._id === id);

  if (!a) return <div className="p-4 bg-status-error-light text-status-error rounded-radius-md text-body-sm">Affiliate not found.</div>;

  const handleDelete = async () => { if (confirm('Delete this affiliate?')) { await deleteAff(id!); navigate('/affiliates'); } };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/affiliates')} className="text-body-sm text-text-muted hover:text-brand-primary flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg> Back
      </button>
      <div className="bg-surface-card border border-neutral-200 rounded-radius-lg p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div><h2 className="text-heading-2">{a.fullName}</h2><p className="text-body-sm text-text-muted">{a.email}</p></div>
          <button onClick={handleDelete} className="text-body-sm text-status-error hover:bg-status-error-light px-3 py-1.5 rounded-radius-md">Delete</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-body-sm">
          <div><span className="text-text-muted">Phone:</span> {a.mobileNumber}</div>
          <div><span className="text-text-muted">Code:</span> <span className="font-mono">{a.affiliateCode || '-'}</span></div>
          <div><span className="text-text-muted">Status:</span> {a.status}</div>
          <div><span className="text-text-muted">Submitted:</span> {new Date(a.createdAt).toLocaleDateString()}</div>
        </div>
        <p className="text-body-sm"><span className="text-text-muted">Description:</span> {a.description}</p>
        <div className="border-t border-neutral-100 pt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {['pending', 'approved', 'rejected', 'active', 'inactive'].map((s) => (
              <button key={s} onClick={() => updateStatus({ id: id!, status: s })} disabled={updating || a.status === s} className="px-3 py-1.5 text-body-sm border border-neutral-200 rounded-radius-md hover:bg-neutral-50 disabled:opacity-50 capitalize">{s}</button>
            ))}
          </div>
          <div><label className="text-body-sm font-medium block mb-1">Admin Notes</label>
            <textarea rows={3} value={notes || a.adminNotes || ''} onChange={(e) => setNotes(e.target.value)} className="w-full px-4 py-2 text-body-sm rounded-radius-md border border-neutral-200 bg-surface-input resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
            <button onClick={() => updateStatus({ id: id!, status: a.status })} disabled={updating} className="mt-2 px-4 py-2 text-body-sm font-medium bg-brand-primary text-white rounded-radius-md hover:bg-brand-accent disabled:opacity-50">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
