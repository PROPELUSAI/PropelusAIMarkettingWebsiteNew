'use client';

import { useParams, useNavigate } from 'react-router-dom';
import { useGetChatByIdQuery } from '@/store/api/adminApi';

export default function ChatDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetChatByIdQuery(id!);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chat = data?.data as any;

  if (isLoading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (error || !chat) return <div className="p-4 bg-status-error-light text-status-error rounded-radius-md text-body-sm">Chat not found.</div>;

  const messages = (chat.messages as Array<{ role: string; content: string; timestamp: string }>) ?? [];
  const meta = chat.metadata as Record<string, string> | undefined;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/chats')} className="text-body-sm text-text-muted hover:text-brand-primary flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg> Back
      </button>

      <div className="bg-surface-card border border-neutral-200 rounded-radius-lg p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-heading-3">{meta?.userName || 'Anonymous'}</h2>
            <p className="text-caption text-text-muted">{meta?.userEmail || (chat.sessionId as string)}</p>
          </div>
          {chat.leadScore && <span className={`px-2 py-0.5 text-caption rounded-radius-full ${chat.leadScore === 'hot' ? 'bg-status-error-light text-status-error' : chat.leadScore === 'warm' ? 'bg-status-warning-light text-status-warning' : 'bg-neutral-100 text-text-muted'}`}>{chat.leadScore as string} lead</span>}
        </div>
        <p className="text-caption text-text-muted mb-4">{messages.length} messages - Session: {(chat.sessionId as string).slice(0, 20)}...</p>
      </div>

      <div className="space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-radius-lg text-body-sm ${
              m.role === 'user'
                ? 'bg-brand-primary text-white rounded-br-none'
                : 'bg-surface-card border border-neutral-200 text-text-primary rounded-bl-none'
            }`}>
              <p className="whitespace-pre-wrap">{m.content}</p>
              <p className={`text-caption mt-1 ${m.role === 'user' ? 'text-white/60' : 'text-text-muted'}`}>
                {new Date(m.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
