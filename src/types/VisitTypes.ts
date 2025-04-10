
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

export interface UserVisitStats {
  total_visits: number;
  unique_establishments: number;
  average_rating: number;
  first_visit_date: string;
  last_visit_date: string;
  total_mocktails_tried: number;
  visited_establishments: string[];
}
