
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
  owner_id?: string; // Added owner_id field
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

// User profile type
export type UserProfile = {
  id: string;
  username?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
};

// User recipe type
export type UserRecipe = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  ingredients: Ingredient[];
  instructions: string;
  image_url?: string;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
};

// Ingredient type for user recipes
export type Ingredient = {
  name: string;
  amount: string;
  unit?: string; // Added unit property
};

// Mocktail suggestion type
export type MocktailSuggestion = {
  id: string;
  user_id: string;
  establishment_id: string;
  name: string;
  description?: string;
  ingredients: Ingredient[];
  instructions: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  created_at?: string;
  updated_at?: string;
};

// User rewards type
export type UserReward = {
  id: string;
  user_id: string;
  points: number;
  level: number;
  badges: Badge[];
  created_at?: string;
  updated_at?: string;
};

// Badge type for user rewards
export type Badge = {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  unlocked_at: string;
};

// Reward history type
export type RewardHistory = {
  id: string;
  user_id: string;
  action_type: string;
  points: number;
  description?: string;
  created_at: string;
};

// Content flag type
export type ContentFlag = {
  id: string;
  content_type: string;
  content_id: string;
  reporter_id?: string;
  reason: string;
  details?: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  created_at: string;
  updated_at: string;
};

// Moderation action type
export type ModerationAction = {
  id: string;
  content_type: string;
  content_id: string;
  moderator_id?: string;
  action: string;
  reason?: string;
  created_at: string;
};

// Moderation notification type
export type ModerationNotification = {
  id: string;
  recipient_id?: string;
  content_type: string;
  content_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

// Flagged content queue item type
export type FlaggedContentQueueItem = {
  flag_id: string;
  content_type: string;
  content_id: string;
  reason: string;
  details?: string;
  reporter_id?: string;
  reported_at: string;
  reporter_name?: string;
  content_preview?: string;
};
