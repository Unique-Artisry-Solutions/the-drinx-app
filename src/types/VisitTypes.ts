
import { Establishment } from './DatabaseTypes';

export interface UserVisit {
  id: string;
  user_id: string;
  establishment_id: string;
  visit_date: string;
  check_in_time?: string;
  check_out_time?: string;
  points_earned?: number;
  establishment?: Establishment;
  created_at: string;
}

export interface VisitStats {
  total_visits: number;
  unique_establishments: number;
  total_points_earned: number;
  favorite_establishment?: Establishment;
  recent_visits: UserVisit[];
}
