import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';

interface UIState {
  sidebarOpen: boolean;
  theme: Theme;
  globalLoading: boolean;
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = localStorage.getItem('ui_theme');
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    // localStorage unavailable
  }
  return 'light';
}

const initialState: UIState = {
  sidebarOpen: true,
  theme: getInitialTheme(),
  globalLoading: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('ui_theme', action.payload);
        } catch {
          // localStorage unavailable
        }
      }
    },
    toggleTheme: (state) => {
      const next: Theme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = next;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('ui_theme', next);
        } catch {
          // localStorage unavailable
        }
      }
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  toggleTheme,
  setGlobalLoading,
} = uiSlice.actions;
export default uiSlice.reducer;
