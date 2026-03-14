// Supabase has been replaced with MongoDB backend API.
// This file is kept only for the analytics service which still uses the Supabase edge function for GA4.
// All database operations now go through /api/* endpoints -> Express server -> MongoDB.

console.log('ℹ️  Supabase client is deprecated for database operations. Using MongoDB API.');

// Provide a dummy export so analytics service doesn't break if it imports this
export const supabase = null;
export const supabaseAdmin = null;
