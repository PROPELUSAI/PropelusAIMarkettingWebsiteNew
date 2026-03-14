'use client';

import { Link } from 'react-router-dom';
import { useGetChatsQuery } from '@/store/api/adminApi';

export default function ChatList() {
  const { data, isLoading, error } = useGetChatsQuery();

  const raw = data?.data;
  const chats = Array.isArray(raw) ? raw : ((raw as any)?.data as any[] ?? []);

  if (isLoading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (error) return <div className="p-4 bg-status-error-light text-status-error rounded-radius-md text-body-sm">Failed to load chats.</div>;

  if (chats.length === 0) return <div className="text-center py-12 text-text-muted text-body-sm">No chat conversations yet.</div>;

  return (
    <div className="space-y-3">
      {chats.map((c: any) => (
        <Link key={c._id as string} to={`/chats/${c._id}`} className="bg-surface-card border border-neutral-200 rounded-radius-lg p-5 hover:shadow-shadow-md transition-shadow block">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-body-sm font-medium">{(c.userName as string) || 'Anonymous'}</p>
              <p className="text-caption text-text-muted">{(c.userEmail as string) || c.sessionId as string}</p>
            </div>
            <div className="text-right">
              <p className="text-caption text-text-muted">{c.messageCount as number} messages</p>
              {c.leadScore && <span className={`px-2 py-0.5 text-caption rounded-radius-full mt-1 inline-block ${c.leadScore === 'hot' ? 'bg-status-error-light text-status-error' : c.leadScore === 'warm' ? 'bg-status-warning-light text-status-warning' : 'bg-neutral-100 text-text-muted'}`}>{c.leadScore as string}</span>}
            </div>
          </div>
          <p className="text-caption text-text-muted mt-2">{new Date(c.updatedAt as string).toLocaleString()}</p>
        </Link>
      ))}
    </div>
  );
}
