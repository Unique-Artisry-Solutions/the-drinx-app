
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://dvifibvzwunnpcsihpxq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2aWZpYnZ6d3VubnBjc2locHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNzM4MDcsImV4cCI6MjA1ODg0OTgwN30.8nsPh_YwHjoFDJ2_IMQY9tkM9NHVLmu6oFf5Tnwa2FA";

// Create a type-safe client to work with our new tables
export const supabaseTyped = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'spiritless-auth-storage'
  }
});

// Type-unsafe function to access tables that aren't in the type definitions
export const fromTable = (tableName: string) => {
  return supabaseTyped.from(tableName as any);
};
