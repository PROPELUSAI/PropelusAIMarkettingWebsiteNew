'use client';

import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearCredentials } from '@/store/slices/authSlice';
import { toggleTheme, setSidebarOpen } from '@/store/slices/uiSlice';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/contacts': 'Contacts',
  '/blogs': 'Blogs',
  '/testimonials': 'Testimonials',
  '/affiliates': 'Affiliates',
  '/newsletter': 'Newsletter',
  '/chats': 'Chats',
  '/analytics': 'Analytics',
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  for (const [path, title] of Object.entries(pageTitles)) {
    if (pathname.startsWith(path)) return title;
  }
  return 'Admin';
}

export default function AdminHeader() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);
  const theme = useAppSelector((state) => state.ui.theme);

  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200';

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate('/login');
  };

  return (
    <header className={`h-16 border-b px-4 lg:px-6 flex items-center justify-between shrink-0 ${bgClass}`}>
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={() => dispatch(setSidebarOpen(true))}
          className={`lg:hidden p-2 rounded-radius-md ${isDark ? 'text-neutral-300 hover:bg-neutral-800' : 'text-neutral-600 hover:bg-neutral-50'}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>

        <h1 className={`text-heading-4 ${isDark ? 'text-white' : 'text-text-primary'}`}>
          {getPageTitle(location.pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className={`p-2 rounded-radius-md transition-colors ${isDark ? 'text-neutral-300 hover:bg-neutral-800' : 'text-neutral-600 hover:bg-neutral-50'}`}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* User info */}
        {user && (
          <span className={`text-body-sm hidden sm:inline ${isDark ? 'text-neutral-400' : 'text-text-muted'}`}>
            {user.name}
          </span>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-body-sm font-medium text-status-error hover:bg-status-error-light rounded-radius-md transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
