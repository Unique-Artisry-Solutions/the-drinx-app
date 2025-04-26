
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session?.user;
};

// Type definition for Establishment
export interface Establishment {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  image_url?: string;
  cocktail_count?: number;
  distance?: string;
  // Add other establishment fields as needed
}
