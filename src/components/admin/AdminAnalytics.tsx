'use client';

import { useGetDashboardQuery } from '@/store/api/adminApi';

function sum(obj: Record<string, number> | undefined): number {
  return obj ? Object.values(obj).reduce((a, b) => a + b, 0) : 0;
}

function StatBar({ label, items }: { label: string; items: Record<string, number> | undefined }) {
  if (!items || Object.keys(items).length === 0) return null;
  const total = sum(items);
  return (
    <div className="bg-surface-card border border-neutral-200 rounded-radius-lg p-5">
      <h3 className="text-heading-4 mb-3">{label}</h3>
      <div className="space-y-2">
        {Object.entries(items).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-body-sm capitalize">{key.replace(/_/g, ' ')}</span>
            <div className="flex items-center gap-3">
              <div className="w-24 h-2 bg-neutral-100 rounded-radius-full overflow-hidden">
                <div className="h-full bg-brand-primary rounded-radius-full" style={{ width: `${total > 0 ? (value / total) * 100 : 0}%` }} />
              </div>
              <span className="text-body-sm font-medium w-8 text-right">{value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminAnalytics() {
  const { data, isLoading, error } = useGetDashboardQuery();
  const d = data?.data as Record<string, unknown> | undefined;

  if (isLoading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (error) return <div className="p-4 bg-status-error-light text-status-error rounded-radius-md text-body-sm">Failed to load analytics.</div>;

  const totals = [
    { label: 'Total Contacts', value: sum(d?.contacts as Record<string, number>) },
    { label: 'Total Testimonials', value: sum(d?.testimonials as Record<string, number>) },
    { label: 'Total Affiliates', value: sum(d?.affiliates as Record<string, number>) },
    { label: 'Newsletter Subscribers', value: (d?.newsletterSubscribers as number) ?? 0 },
    { label: 'Chat Sessions', value: (d?.totalChats as number) ?? 0 },
    { label: 'Blog Posts', value: (d?.totalBlogs as number) ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {totals.map((t) => (
          <div key={t.label} className="bg-surface-card border border-neutral-200 rounded-radius-lg p-5">
            <p className="text-body-sm text-text-muted">{t.label}</p>
            <p className="text-heading-1 font-bold mt-1">{t.value}</p>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatBar label="Contacts by Status" items={d?.contacts as Record<string, number>} />
        <StatBar label="Testimonials by Status" items={d?.testimonials as Record<string, number>} />
        <StatBar label="Affiliates by Status" items={d?.affiliates as Record<string, number>} />
      </div>
    </div>
  );
}
