'use client';

import { useParams, useNavigate } from 'react-router-dom';
import { useGetAdminTestimonialsQuery, useUpdateTestimonialStatusMutation, useDeleteTestimonialMutation } from '@/store/api/adminApi';

export default function TestimonialDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useGetAdminTestimonialsQuery();
  const [updateStatus, { isLoading: updating }] = useUpdateTestimonialStatusMutation();
  const [deleteTm] = useDeleteTestimonialMutation();

  const raw = data?.data;
  const items = Array.isArray(raw) ? raw : ((raw as any)?.data as any[] ?? []);
  const t = items.find((x: any) => x._id === id) as Record<string, string> | undefined;

  if (!t) return <div className="p-4 bg-status-error-light text-status-error rounded-radius-md text-body-sm">Testimonial not found.</div>;

  const handleDelete = async () => { if (confirm('Delete this testimonial?')) { await deleteTm(id!); navigate('/testimonials'); } };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/testimonials')} className="text-body-sm text-text-muted hover:text-brand-primary flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg> Back
      </button>
      <div className="bg-surface-card border border-neutral-200 rounded-radius-lg p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div><h2 className="text-heading-2">{t.fullName}</h2><p className="text-body-sm text-text-muted">{t.email}</p></div>
          <span className={`px-2 py-0.5 text-caption rounded-radius-full ${t.status === 'approved' ? 'bg-status-success-light text-status-success' : t.status === 'rejected' ? 'bg-status-error-light text-status-error' : 'bg-status-warning-light text-status-warning'}`}>{t.status}</span>
        </div>
        <blockquote className="text-body-lg italic text-text-secondary border-l-4 border-brand-primary pl-4">{t.testimonial}</blockquote>
        {t.rating && <p className="text-body-sm text-text-muted">Rating: {t.rating}/5</p>}
        <p className="text-caption text-text-muted">Submitted: {new Date(t.createdAt).toLocaleString()}</p>
        <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-100">
          <button onClick={() => updateStatus({ id: id!, status: 'approved' })} disabled={updating || t.status === 'approved'} className="px-4 py-2 text-body-sm font-medium bg-status-success text-white rounded-radius-md hover:opacity-90 disabled:opacity-50">Approve</button>
          <button onClick={() => updateStatus({ id: id!, status: 'rejected' })} disabled={updating || t.status === 'rejected'} className="px-4 py-2 text-body-sm font-medium bg-status-warning text-white rounded-radius-md hover:opacity-90 disabled:opacity-50">Reject</button>
          <button onClick={handleDelete} className="px-4 py-2 text-body-sm text-status-error hover:bg-status-error-light rounded-radius-md">Delete</button>
        </div>
      </div>
    </div>
  );
}
