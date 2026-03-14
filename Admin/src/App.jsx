/**
 * App — Root Component
 *
 * Sets up the React Router, auth context, theme class, and toast notifications.
 * All admin routes are wrapped in <ProtectedRoute> → <Layout> so they require
 * authentication and share the sidebar/header/footer shell.
 *
 * Route structure:
 *   /login                → Login page (public)
 *   /dashboard            → Dashboard with stats overview
 *   /analytics            → GA4 analytics reports
 *   /contacts             → Contact/lead list
 *   /contacts/:id         → Contact detail + lead management form
 *   /contacts/kanban      → Drag-and-drop Kanban board for leads
 *   /testimonials          → Testimonial list
 *   /testimonials/:id      → Testimonial detail + approve/deny
 *   /testimonials/kanban   → Kanban board for testimonials
 *   /affiliates            → Affiliate partner list
 *   /affiliates/:id        → Affiliate detail + approval workflow
 *   /affiliates/kanban     → Kanban board for affiliates
 *   /blogs                 → Blog CMS list
 *   /blogs/new             → Create new blog post
 *   /blogs/:id             → Blog post detail
 *   /blogs/:id/edit        → Edit existing blog post
 *   /newsletter            → Newsletter subscriber list
 *   /newsletter/compose    → Compose & send email campaigns
 *   /chats                 → Chatbot conversation list
 *   /chats/:id             → Full chat conversation view
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { ContactList } from './pages/contacts/ContactList';
import { ContactDetail } from './pages/contacts/ContactDetail';
import { ContactKanban } from './pages/contacts/ContactKanban';
import { TestimonialList } from './pages/testimonials/TestimonialList';
import { TestimonialDetail } from './pages/testimonials/TestimonialDetail';
import { TestimonialKanban } from './pages/testimonials/TestimonialKanban';
import { AffiliateList } from './pages/affiliates/AffiliateList';
import { AffiliateDetail } from './pages/affiliates/AffiliateDetail';
import { AffiliateKanban } from './pages/affiliates/AffiliateKanban';
import { AffiliateDebug } from './pages/affiliates/AffiliateDebug';
import { BlogList } from './pages/blogs/BlogList';
import { BlogDetail } from './pages/blogs/BlogDetail';
import { BlogForm } from './pages/blogs/BlogForm';
import { NewsletterList } from './pages/newsletter/NewsletterList';
import { NewsletterCompose } from './pages/newsletter/NewsletterCompose';
import { ChatList } from './pages/chats/ChatList';
import { ChatDetail } from './pages/chats/ChatDetail';
import { useThemeStore } from './store/themeStore';
import './App.css';

function App() {
  const { isDark } = useThemeStore();

  return (
    <div className={isDark ? 'dark-theme' : 'light-theme'}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="contacts" element={<ContactList />} />
              <Route path="contacts/:id" element={<ContactDetail />} />
              <Route path="contacts/kanban" element={<ContactKanban />} />
              <Route path="testimonials" element={<TestimonialList />} />
              <Route path="testimonials/:id" element={<TestimonialDetail />} />
              <Route path="testimonials/kanban" element={<TestimonialKanban />} />
              <Route path="affiliates" element={<AffiliateList />} />
              <Route path="affiliates/:id" element={<AffiliateDetail />} />
              <Route path="affiliates/kanban" element={<AffiliateKanban />} />
              <Route path="affiliates/debug" element={<AffiliateDebug />} />
              <Route path="blogs" element={<BlogList />} />
              <Route path="blogs/new" element={<BlogForm />} />
              <Route path="blogs/:id" element={<BlogDetail />} />
              <Route path="blogs/:id/edit" element={<BlogForm />} />
              <Route path="newsletter" element={<NewsletterList />} />
              <Route path="newsletter/compose" element={<NewsletterCompose />} />
              <Route path="newsletter/campaigns" element={<NewsletterCompose />} />
              <Route path="chats" element={<ChatList />} />
              <Route path="chats/:id" element={<ChatDetail />} />
            </Route>
          </Routes>
          <Toaster position="top-right" />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
