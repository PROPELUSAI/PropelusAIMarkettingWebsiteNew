/**
 * store.ts — Redux store configuration.
 * Configures a single store with the RTK Query API reducer and middleware.
 * Exports RootState and AppDispatch types for typed hooks.
 */
import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
