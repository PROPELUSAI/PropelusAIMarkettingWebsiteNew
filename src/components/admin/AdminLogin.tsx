'use client';

import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { useAdminLoginMutation } from '@/store/api/adminApi';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [adminLogin, { isLoading }] = useAdminLoginMutation();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const result = await adminLogin({ email, password }).unwrap();
      if (result.success && result.data) {
        dispatch(
          setCredentials({
            token: result.data.token,
            user: {
              id: result.data.user.id as string,
              email: result.data.user.email,
              name: result.data.user.name,
              role: result.data.user.role,
            },
          })
        );
        navigate('/dashboard');
      }
    } catch (err) {
      const apiError = err as { data?: { message?: string } };
      setError(apiError.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-heading-2 text-text-primary mb-2">PropelusAI Admin</h1>
          <p className="text-body-sm text-text-muted">Sign in to manage your dashboard</p>
        </div>

        <div className="bg-surface-card rounded-radius-xl border border-neutral-200 p-8 shadow-shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-status-error-light border border-status-error/20 rounded-radius-md text-status-error text-body-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-body-sm font-medium text-text-primary mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@propelusai.com"
                required
                disabled={isLoading}
                className="w-full px-4 py-2.5 text-body-sm rounded-radius-md border border-neutral-200 bg-surface-input text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-body-sm font-medium text-text-primary mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                disabled={isLoading}
                className="w-full px-4 py-2.5 text-body-sm rounded-radius-md border border-neutral-200 bg-surface-input text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 text-body-sm font-medium bg-brand-primary text-white rounded-radius-md hover:bg-brand-accent transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
