'use client';

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetContactByIdQuery, useUpdateContactMutation, useDeleteContactMutation } from '@/store/api/adminApi';

const statuses = ['open', 'in_progress', 'contacted', 'qualified', 'converted', 'closed', 'lost', 'spam'];

export default function ContactDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetContactByIdQuery(id!);
  const [updateContact, { isLoading: updating }] = useUpdateContactMutation();
  const [deleteContact] = useDeleteContactMutation();
  const [notes, setNotes] = useState('');
  const c = data?.data as Record<string, string> | undefined;

  if (isLoading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (error || !c) return <div className="p-4 bg-status-error-light text-status-error rounded-radius-md text-body-sm">Contact not found.</div>;

  const handleDelete = async () => { if (confirm('Delete this contact?')) { await deleteContact(id!); navigate('/contacts'); } };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/contacts')} className="text-body-sm text-text-muted hover:text-brand-primary flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg> Back
      </button>
      <div className="bg-surface-card border border-neutral-200 rounded-radius-lg p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div><h2 className="text-heading-2">{c.fullName}</h2><p className="text-body-sm text-text-muted">{c.email}</p></div>
          <button onClick={handleDelete} className="text-body-sm text-status-error hover:bg-status-error-light px-3 py-1.5 rounded-radius-md">Delete</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-body-sm">
          {[['Country', c.country], ['Phone', c.mobileNumber || '-'], ['Company', c.companyName || '-'], ['Interest', c.interest || '-'], ['Scheduled', new Date(c.scheduledTime).toLocaleString()], ['Submitted', new Date(c.createdAt).toLocaleString()]].map(([l, v]) => (
            <div key={l}><span className="text-text-muted">{l}:</span> {v}</div>
          ))}
        </div>
        {c.description && <p className="text-body-sm"><span className="text-text-muted">Description:</span> {c.description}</p>}
        <div className="border-t border-neutral-100 pt-4 space-y-3">
          <div><label className="text-body-sm font-medium block mb-1">Status</label>
            <select value={c.leadStatus || 'open'} onChange={(e) => updateContact({ id: id!, data: { leadStatus: e.target.value } as Partial<Record<string, string>> })} disabled={updating} className="px-4 py-2 text-body-sm rounded-radius-md border border-neutral-200 bg-surface-input">
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div><label className="text-body-sm font-medium block mb-1">Admin Notes</label>
            <textarea rows={3} value={notes || c.adminNotes || ''} onChange={(e) => setNotes(e.target.value)} className="w-full px-4 py-2 text-body-sm rounded-radius-md border border-neutral-200 bg-surface-input resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
            <button onClick={() => updateContact({ id: id!, data: { adminNotes: notes } as Partial<Record<string, string>> })} disabled={updating} className="mt-2 px-4 py-2 text-body-sm font-medium bg-brand-primary text-white rounded-radius-md hover:bg-brand-accent disabled:opacity-50">Save Notes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
