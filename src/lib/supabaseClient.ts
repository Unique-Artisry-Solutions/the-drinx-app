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
      mocktail_suggestions: {
        Row: {
          id: string;
          user_id: string;
          establishment_id: string;
          name: string;
          description?: string;
          ingredients: Ingredient[];
          instructions: string;
          status: 'pending' | 'approved' | 'rejected';
          feedback?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          establishment_id: string;
          name: string;
          description?: string;
          ingredients: Ingredient[];
          instructions: string;
          status?: 'pending' | 'approved' | 'rejected';
          feedback?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          establishment_id?: string;
          name?: string;
          description?: string;
          ingredients?: Ingredient[];
          instructions?: string;
          status?: 'pending' | 'approved' | 'rejected';
          feedback?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_visits: {
        Row: {
          id: string;
          user_id: string;
          establishment_id: string;
          visit_date: string;
          duration_minutes?: number;
          rating?: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          establishment_id: string;
          visit_date?: string;
          duration_minutes?: number;
          rating?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          establishment_id?: string;
          visit_date?: string;
          duration_minutes?: number;
          rating?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      visit_notes: {
        Row: {
          id: string;
          visit_id: string;
          note: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          visit_id: string;
          note: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          visit_id?: string;
          note?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      tried_mocktails: {
        Row: {
          id: string;
          visit_id: string;
          cocktail_id: string;
          rating?: number;
          notes?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          visit_id: string;
          cocktail_id: string;
          rating?: number;
          notes?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          visit_id?: string;
          cocktail_id?: string;
          rating?: number;
          notes?: string;
          created_at?: string;
        };
      };
      user_visit_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_type: string;
          achievement_data: {
            establishment_id?: string;
            establishment_name?: string;
            count?: number;
            unique_count?: number;
          };
          earned_at: string;
          is_displayed: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_type: string;
          achievement_data: {
            establishment_id?: string;
            establishment_name?: string;
            count?: number;
            unique_count?: number;
          };
          earned_at?: string;
          is_displayed?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_type?: string;
          achievement_data?: {
            establishment_id?: string;
            establishment_name?: string;
            count?: number;
            unique_count?: number;
          };
          earned_at?: string;
          is_displayed?: boolean;
        };
      };
      user_notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          notification_type: string;
          related_id?: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          notification_type: string;
          related_id?: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          notification_type?: string;
          related_id?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
      user_visit_analytics: {
        Row: {
          user_id: string;
          total_visits: number;
          unique_establishments: number;
          average_rating: number;
          first_visit_date: string;
          last_visit_date: string;
          total_mocktails_tried: number;
          visited_establishments: string[];
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
    storage: localStorage // Always use localStorage for consistency
  }
});

// Helper function to access any table
export function fromTable<T = any>(tableName: string) {
  return supabaseClient.from(tableName);
}
