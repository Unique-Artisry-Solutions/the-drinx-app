
import { Database } from "@/integrations/supabase/types";

// Specific table types
export type CocktailReview = Database['public']['Tables']['cocktail_reviews']['Row'];
export type CocktailReviewWithUser = Database['public']['Views']['cocktail_reviews_with_users']['Row'];

// Helper type for comment display
export interface CommentDisplayItem {
  id: string;
  user: string;
  text: string;
  date: string;
  source: 'app' | 'yelp';
  rating?: number;
}
