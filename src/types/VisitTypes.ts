
import { Establishment } from './DatabaseTypes';

export interface UserVisit {
  id: string;
  user_id: string;
  establishment_id: string;
  visit_date: string;
  duration_minutes?: number;
  rating?: number;
  created_at: string;
  updated_at: string;
}

export interface VisitNote {
  id: string;
  visit_id: string;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface TriedMocktail {
  id: string;
  visit_id: string;
  cocktail_id: string;
  rating?: number;
  notes?: string;
  created_at: string;
}

export interface UserVisitAchievement {
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
}

export interface UserNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  related_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface VisitWithEstablishment extends UserVisit {
  establishment: Establishment;
  notes: VisitNote[];
  tried_mocktails: TriedMocktail[];
}

// Updated VisitStats interface to match both database and component usage
export interface UserVisitStats {
  // Database naming (snake_case)
  total_visits: number;
  unique_establishments: number;
  average_rating: number;
  total_mocktails_tried: number;
  first_visit_date: string;
  last_visit_date: string;
  visited_establishments: string[];
  // Component naming (camelCase) - for backward compatibility
  totalVisits: number;
  uniqueEstablishments: number;
  averageRating: number;
  totalMocktailsTried?: number;
}

// Standardized Visit interface that matches component expectations
export interface Visit {
  id: string;
  establishment_id: string;
  rating: number | null;
  notes: string;
  visited_at: string;
  user_id: string;
  visit_date: string;
  created_at: string;
  updated_at: string;
  tried_mocktails: TriedMocktail[];
  establishment?: {
    name: string;
    address: string;
    image_url?: string;
  };
}
