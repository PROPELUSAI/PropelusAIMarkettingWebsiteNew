'use client';

import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import type { AuthUser } from '@/store/slices/authSlice';

import ProtectedRoute from './ProtectedRoute';
import AdminLayout from './AdminLayout';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import ContactList from './ContactList';
import ContactDetail from './ContactDetail';
import BlogList from './BlogList';
import BlogDetail from './BlogDetail';
import BlogForm from './BlogForm';
import TestimonialList from './TestimonialList';
import TestimonialDetail from './TestimonialDetail';
import AffiliateList from './AffiliateList';
import AffiliateDetail from './AffiliateDetail';
import NewsletterList from './NewsletterList';
import NewsletterCompose from './NewsletterCompose';
import ChatList from './ChatList';
import ChatDetail from './ChatDetail';
import AdminAnalytics from './AdminAnalytics';

export default function AdminApp() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    try {
      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('auth_user');
      if (token && userStr) {
        const user: AuthUser = JSON.parse(userStr);
        dispatch(setCredentials({ token, user }));
      }
    } catch {
      // Invalid stored data, ignore
    }
  }, [dispatch]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="contacts" element={<ContactList />} />
          <Route path="contacts/:id" element={<ContactDetail />} />
          <Route path="blogs" element={<BlogList />} />
          <Route path="blogs/new" element={<BlogForm />} />
          <Route path="blogs/:id" element={<BlogDetail />} />
          <Route path="blogs/:id/edit" element={<BlogForm />} />
          <Route path="testimonials" element={<TestimonialList />} />
          <Route path="testimonials/:id" element={<TestimonialDetail />} />
          <Route path="affiliates" element={<AffiliateList />} />
          <Route path="affiliates/:id" element={<AffiliateDetail />} />
          <Route path="newsletter" element={<NewsletterList />} />
          <Route path="newsletter/compose" element={<NewsletterCompose />} />
          <Route path="chats" element={<ChatList />} />
          <Route path="chats/:id" element={<ChatDetail />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
