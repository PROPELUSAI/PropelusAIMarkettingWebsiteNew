/**
 * hooks.ts — Typed Redux hooks for use throughout the app.
 * useAppDispatch and useAppSelector replace plain useDispatch/useSelector
 * to provide full TypeScript type safety with RootState and AppDispatch.
 */
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
