/**
 * Auth Store (Zustand + localStorage persistence)
 *
 * Holds the currently logged-in user, JWT access token, and refresh token.
 * Persisted to localStorage under key "auth-storage" so sessions survive
 * page reloads. Consumed by AuthContext and ProtectedRoute.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,           // { id, username, email } or null when logged out
      accessToken: null,    // Short-lived JWT (1 hr)
      refreshToken: null,   // Long-lived JWT (24 hr)
      /** Save user + tokens after successful login */
      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken }),
      /** Clear everything on logout */
      clearAuth: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);
