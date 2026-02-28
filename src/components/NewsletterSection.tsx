'use client';

import { useState, useEffect } from 'react';
import { useSubscribeNewsletterMutation } from '@/store';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribeNewsletter, { isLoading, isSuccess, isError, error, reset: resetMutation }] = useSubscribeNewsletterMutation();

  // Auto-reset form after 5 seconds on success
  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(() => {
      resetMutation();
    }, 5000);
    return () => clearTimeout(timer);
  }, [isSuccess, resetMutation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      await subscribeNewsletter({
        email: email.trim(),
        source: 'footer',
      }).unwrap();
      setEmail('');
    } catch (err) {
      console.error('Newsletter subscription error:', err);
    }
  };

  return (
    <div className="bg-brand-600/10 border border-brand-500/20 rounded-xl p-6 mb-8">
      <h3 className="text-lg font-semibold text-white mb-2">Stay Updated</h3>
      <p className="text-sm text-surface-400 mb-4">
        Get AI insights, tips, and exclusive offers delivered to your inbox.
      </p>

      {isSuccess ? (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
          <p className="text-green-400 text-sm font-medium">
            ✅ Thank you for subscribing!
          </p>
          <p className="text-green-400/70 text-xs mt-1">
            Check your inbox for a welcome email.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-2.5 text-sm rounded-lg bg-surface-800 border border-surface-700 text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            disabled={isLoading}
            required
          />
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="px-6 py-2.5 text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Subscribing...
              </span>
            ) : (
              'Subscribe'
            )}
          </button>
        </form>
      )}

      {isError && (
        <p className="mt-3 text-xs text-red-400">
          {(error as { data?: { message?: string } })?.data?.message || 'Failed to subscribe. Please try again.'}
        </p>
      )}
    </div>
  );
}
