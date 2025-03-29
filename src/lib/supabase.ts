
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const { data, error } = await supabase.auth.getSession();
  return !!data.session;
};

// TypeScript types for the database entities
export type Establishment = {
  id: string;
  name: string;
  address: string;
  image_url?: string;
  latitude: number;
  longitude: number;
  cocktail_count: number;
  phone?: string;
  website?: string;
  hours?: string[];
  created_at: string;
};

export type Favorite = {
  id: string;
  user_id: string;
  establishment_id: string;
  created_at: string;
};

export type BarCrawl = {
  id: string;
  user_id: string;
  name: string;
  establishment_ids: string[];
  created_at: string;
};
