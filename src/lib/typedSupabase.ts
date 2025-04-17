
import { createClient } from '@supabase/supabase-js';
import { Establishment } from '@/types/ProfileTypes';
import { TicketTier } from '@/hooks/swigCircuit/types';

const SUPABASE_URL = "https://dvifibvzwunnpcsihpxq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2aWZpYnZ6d3VubnBjc2locHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNzM4MDcsImV4cCI6MjA1ODg0OTgwN30.8nsPh_YwHjoFDJ2_IMQY9tkM9NHVLmu6oFf5Tnwa2FA";

// Define our database types for better type safety
export type Database = {
  public: {
    Tables: {
      swig_circuits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description?: string;
          start_date: string;
          end_date: string;
          image_url?: string;
          theme: string;
          max_distance: number;
          created_at: string;
          projected_attendance?: number;
          projected_revenue?: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string;
          start_date: string;
          end_date: string;
          image_url?: string;
          theme: string;
          max_distance?: number;
          projected_attendance?: number;
          projected_revenue?: number;
        };
      };
      swig_circuit_venues: {
        Row: {
          id: string;
          swig_circuit_id: string;
          establishment_id: string;
          position: number;
        };
        Insert: {
          id?: string;
          swig_circuit_id: string;
          establishment_id: string;
          position: number;
        };
      };
      swig_circuit_drink_highlights: {
        Row: {
          id: string;
          swig_circuit_id: string;
          name: string;
          description?: string;
        };
        Insert: {
          id?: string;
          swig_circuit_id: string;
          name: string;
          description?: string;
        };
      };
      swig_circuit_pairings: {
        Row: {
          id: string;
          swig_circuit_id: string;
          food: string;
          drink: string;
        };
        Insert: {
          id?: string;
          swig_circuit_id: string;
          food: string;
          drink: string;
        };
      };
      swig_circuit_ticket_tiers: {
        Row: {
          id: string;
          swig_circuit_id: string;
          name: string;
          price: number;
          description: string;
          ticket_limit?: number;
          benefits: string[];
          is_vip: boolean;
          vip_perks?: Record<string, any>;
        };
        Insert: {
          id?: string;
          swig_circuit_id: string;
          name: string;
          price: number;
          description: string;
          ticket_limit?: number;
          benefits: string[];
          is_vip?: boolean;
          vip_perks?: Record<string, any>;
        };
      };
      establishments: {
        Row: Establishment & {
          id: string;
          created_at?: string;
        };
      };
    };
  };
};

// Create a type-safe client to work with our tables
export const supabaseTyped = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'spiritless-auth-storage'
  }
});

// Type-safe function to access swig_circuits table
export const swigCircuits = () => {
  return supabaseTyped.from('swig_circuits');
};

// Type-safe function to access swig_circuit_venues table
export const swigCircuitVenues = () => {
  return supabaseTyped.from('swig_circuit_venues');
};

// Type-safe function to access swig_circuit_drink_highlights table
export const swigCircuitDrinkHighlights = () => {
  return supabaseTyped.from('swig_circuit_drink_highlights');
};

// Type-safe function to access swig_circuit_pairings table
export const swigCircuitPairings = () => {
  return supabaseTyped.from('swig_circuit_pairings');
};

// Type-safe function to access swig_circuit_ticket_tiers table
export const swigCircuitTicketTiers = () => {
  return supabaseTyped.from('swig_circuit_ticket_tiers');
};

// Type-safe function to access establishments table
export const establishments = () => {
  return supabaseTyped.from('establishments');
};

// Type-unsafe function to access tables that aren't in the type definitions
export const fromTable = (tableName: string) => {
  return supabaseTyped.from(tableName as any);
};

// Helper function to get the current user ID
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data } = await supabaseTyped.auth.getSession();
  return data.session?.user?.id || null;
};
