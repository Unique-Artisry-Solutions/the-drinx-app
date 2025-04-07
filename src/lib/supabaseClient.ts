
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// Extend the Database type to include our new tables
interface CustomDatabase extends Database {
  public: Database['public'] & {
    Tables: Database['public']['Tables'] & {
      user_bar_crawl_participation: {
        Row: {
          id: string;
          user_id: string;
          bar_crawl_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          bar_crawl_id: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          bar_crawl_id?: string;
          joined_at?: string;
        };
      };
      bar_crawl_check_ins: {
        Row: {
          id: string;
          bar_crawl_id: string;
          establishment_id: string;
          user_id: string;
          checked_in_at: string;
          verified_by?: string;
        };
        Insert: {
          id?: string;
          bar_crawl_id: string;
          establishment_id: string;
          user_id: string;
          checked_in_at?: string;
          verified_by?: string;
        };
        Update: {
          id?: string;
          bar_crawl_id?: string;
          establishment_id?: string;
          user_id?: string;
          checked_in_at?: string;
          verified_by?: string;
        };
      };
    }
  }
}

// Define the Ingredient type that's used in the interface above
type Ingredient = {
  name: string;
  amount: string;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dvifibvzwunnpcsihpxq.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2aWZpYnZ6d3VubnBjc2locHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNzM4MDcsImV4cCI6MjA1ODg0OTgwN30.8nsPh_YwHjoFDJ2_IMQY9tkM9NHVLmu6oFf5Tnwa2FA';

export const supabaseClient = createClient<CustomDatabase>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'spiritless-auth-storage',
  }
});
