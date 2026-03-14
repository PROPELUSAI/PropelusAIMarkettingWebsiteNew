'use client';

import { Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout() {
  const theme = useAppSelector((state) => state.ui.theme);
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
      <AdminSidebar />
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <AdminHeader />
        <main className={`flex-1 p-4 lg:p-6 ${isDark ? 'text-neutral-200' : 'text-text-primary'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
