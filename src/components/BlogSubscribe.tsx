'use client';

import { useState } from 'react';
import { useSubscribeNewsletterMutation } from '@/store';

export default function BlogSubscribe({ compact }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [subscribe, { isLoading, isSuccess }] = useSubscribeNewsletterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await subscribe({ email, source: 'footer' }).unwrap();
      setEmail('');
    } catch {
      /* handled by RTK Query error state */
    }
  };

  if (isSuccess) {
    return (
      <div className={compact ? 'text-center py-4' : 'text-center py-8'}>
        <p className="text-sm font-medium text-brand-500">You are subscribed. Check your inbox for a welcome email.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? 'flex gap-2' : 'flex flex-col sm:flex-row gap-3'}>
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="form-input flex-1 text-sm"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="btn-primary text-sm py-2.5 px-5 shrink-0"
        disabled={isLoading}
      >
        {isLoading ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
}
