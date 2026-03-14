/**
 * Header
 *
 * Top bar displaying the page title, dark/light theme toggle,
 * logged-in username, and logout button.
 */
import { useAuth } from '../../context/AuthContext';
import { useThemeStore } from '../../store/themeStore';

export const Header = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <header className="header">
      <div className="header-left">
        <h1>Admin Dashboard</h1>
      </div>
      <div className="header-right">
        <button onClick={toggleTheme} className="theme-toggle">
          {isDark ? '☀️' : '🌙'}
        </button>
        <div className="user-info">
          <span>{user?.username}</span>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
