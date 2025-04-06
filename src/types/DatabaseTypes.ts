
import { Database } from "@/integrations/supabase/types";

// Specific table types
export type CocktailReview = Database['public']['Tables']['cocktail_reviews']['Row'];
export type CocktailReviewWithUser = Database['public']['Views']['cocktail_reviews_with_users']['Row'];
export type BarCrawlCheckIn = {
  id: string;
  bar_crawl_id: string;
  establishment_id: string;
  user_id: string;
  checked_in_at: string;
  verified_by?: string;
};

// Add BarCrawl and Cocktail types
export type BarCrawl = {
  id: string;
  name: string;
  description?: string;
  organizer_id: string;
  start_date?: string;
  end_date?: string;
  theme_id?: string;
  status?: string;
  created_at?: string;
};

export type BarCrawlTheme = {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
};

export type Cocktail = {
  id: string;
  name: string;
  description: string;
  price: string;
  ingredients?: string[];
  image_url?: string;
  establishment_id: string;
  created_at?: string;
};

// Establishment type with created_at field
export type Establishment = {
  id: string;
  name: string;
  address: string;
  image_url?: string;
  image?: string; // For compatibility with existing code
  latitude: number;
  longitude: number;
  cocktail_count?: number;
  cocktailCount?: number; // For compatibility with existing code
  phone?: string;
  website?: string;
  distance?: string;
  created_at?: string; // Added this field
};

// Helper type for comment display
export interface CommentDisplayItem {
  id: string;
  user: string;
  text: string;
  date: string;
  source: 'app' | 'yelp';
  rating?: number;
}
