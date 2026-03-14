/**
 * provider.tsx — Redux StoreProvider wrapper (client component).
 * Wraps the app in a React-Redux Provider so all child components
 * can access the Redux store and RTK Query hooks.
 */
'use client';

import { Provider } from 'react-redux';
import { store } from './store';

/** Client-side Redux Provider that wraps the entire application */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
