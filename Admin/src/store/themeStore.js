/**
 * Theme Store (Zustand + localStorage persistence)
 *
 * Toggles between light and dark mode. The isDark flag is applied
 * in App.jsx as a CSS class ('dark-theme' / 'light-theme') on the
 * root div, which controls CSS custom property values.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      isDark: false, // Default to light theme
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
    }),
    {
      name: 'theme-storage', // localStorage key
    }
  )
);
