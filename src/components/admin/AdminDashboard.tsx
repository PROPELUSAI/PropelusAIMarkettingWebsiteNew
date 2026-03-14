'use client';

import { Link } from 'react-router-dom';
import { useGetDashboardQuery } from '@/store/api/adminApi';

function sum(obj: Record<string, number> | undefined): number {
  return obj ? Object.values(obj).reduce((a, b) => a + b, 0) : 0;
}

export default function AdminDashboard() {
  const { data, isLoading, error } = useGetDashboardQuery();
  const d = data?.data as Record<string, unknown> | undefined;

  if (isLoading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (error) return <div className="p-4 bg-status-error-light text-status-error rounded-radius-md text-body-sm">Failed to load dashboard.</div>;

  const cards = [
    { label: 'Contacts', value: sum(d?.contacts as Record<string, number>), href: '/contacts' },
    { label: 'Blogs', value: (d?.totalBlogs as number) ?? 0, href: '/blogs' },
    { label: 'Testimonials', value: sum(d?.testimonials as Record<string, number>), href: '/testimonials' },
    { label: 'Affiliates', value: sum(d?.affiliates as Record<string, number>), href: '/affiliates' },
    { label: 'Subscribers', value: (d?.newsletterSubscribers as number) ?? 0, href: '/newsletter' },
    { label: 'Chats', value: (d?.totalChats as number) ?? 0, href: '/chats' },
  ];

  const recent = (d?.recentContacts as Array<{ _id: string; fullName: string; email: string; createdAt: string }>) ?? [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.href} className="bg-surface-card border border-neutral-200 rounded-radius-lg p-5 hover:shadow-shadow-md transition-shadow">
            <p className="text-body-sm text-text-muted mb-1">{c.label}</p>
            <p className="text-heading-1 font-bold text-text-primary">{c.value}</p>
          </Link>
        ))}
      </div>
      {recent.length > 0 && (
        <div className="bg-surface-card border border-neutral-200 rounded-radius-lg p-5">
          <h3 className="text-heading-4 mb-4">Recent Contacts</h3>
          {recent.slice(0, 5).map((c) => (
            <Link key={c._id} to={`/contacts/${c._id}`} className="flex items-center justify-between py-2 px-2 rounded-radius-sm hover:bg-neutral-50">
              <div><p className="text-body-sm font-medium">{c.fullName}</p><p className="text-caption text-text-muted">{c.email}</p></div>
              <span className="text-caption text-text-muted">{new Date(c.createdAt).toLocaleDateString()}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
