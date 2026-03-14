/**
 * index.ts — Barrel export for the Redux store module.
 * Re-exports store, types, hooks, and all API slice exports
 * so consumers can import everything from '@/store'.
 */
export { store } from './store';
export type { RootState, AppDispatch } from './store';
export { useAppDispatch, useAppSelector } from './hooks';
export { api } from './api';
export * from './api';
