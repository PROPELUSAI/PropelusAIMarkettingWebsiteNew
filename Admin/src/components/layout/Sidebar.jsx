/**
 * Sidebar Navigation
 *
 * Collapsible sidebar with links to all admin sections.
 * Highlights the currently active route. Can collapse to
 * icon-only mode for more screen space.
 */
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Navigation links — add new sections here
  const links = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/contacts', label: 'Contacts', icon: '📧' },
    { path: '/testimonials', label: 'Testimonials', icon: '⭐' },
    { path: '/affiliates', label: 'Affiliates', icon: '🤝' },
    { path: '/blogs', label: 'Blogs', icon: '📝' },
    { path: '/newsletter', label: 'Newsletter', icon: '📬' },
    { path: '/chats', label: 'Chats', icon: '💬' },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2>{collapsed ? 'AP' : 'Admin Panel'}</h2>
        <button onClick={() => setCollapsed(!collapsed)} className="collapse-btn">
          {collapsed ? '→' : '←'}
        </button>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-link ${location.pathname.startsWith(link.path) ? 'active' : ''}`}
          >
            <span className="icon">{link.icon}</span>
            {!collapsed && <span className="label">{link.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};
