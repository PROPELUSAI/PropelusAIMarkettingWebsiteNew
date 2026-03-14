'use client';

import dynamic from 'next/dynamic';

const AdminApp = dynamic(() => import('@/components/admin/AdminApp'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-body-sm text-text-muted">Loading admin panel...</p>
      </div>
    </div>
  ),
});

export default function AdminPage() {
  return <AdminApp />;
}
