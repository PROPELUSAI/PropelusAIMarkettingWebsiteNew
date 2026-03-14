/**
 * Auth Context
 *
 * Wraps the app with authentication state and provides:
 *   - user        : Current user object (or null)
 *   - login()     : Authenticate with username + password
 *   - logout()    : Clear session and redirect to /login
 *   - isAuthenticated : Boolean shortcut
 *
 * Under the hood it calls authService for the API request and
 * persists the result in authStore (Zustand → localStorage).
 */
import { createContext, useContext } from 'react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, setAuth, clearAuth } = useAuthStore();

  /** Call the login API → store tokens → show toast */
  const login = async (username, password) => {
    try {
      const { user, accessToken, refreshToken } = await authService.login(username, password);
      setAuth(user, accessToken, refreshToken);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    clearAuth();
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

/** Hook to access auth context — must be used inside <AuthProvider> */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
