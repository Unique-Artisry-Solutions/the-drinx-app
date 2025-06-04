
// DatabaseTypes.ts - Contains specific database-related types

export interface MocktailSuggestion {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string;
  establishment_id: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface FlaggedContentQueueItem {
  id: string;
  content_type: string;
  content_id: string;
  flag_reason: string;
  flagged_by: string;
  flagged_at: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  content_data?: any;
}

export interface CommentDisplayItem {
  id: string;
  content: string;
  user_id: string;
  cocktail_id: string;
  created_at: string;
  user_name?: string;
  avatar_url?: string;
}

export interface UserRecipe {
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  prep_time?: number;
}

export interface Ingredient {
  id: string;
  name: string;
  amount?: string;
  unit?: string;
  category?: string;
}

export interface Establishment {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  image_url?: string;
  hours?: any;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}
