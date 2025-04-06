
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

// Helper type for comment display
export interface CommentDisplayItem {
  id: string;
  user: string;
  text: string;
  date: string;
  source: 'app' | 'yelp';
  rating?: number;
}
