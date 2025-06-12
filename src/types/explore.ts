
export interface UserStats {
  totalMocktailsTried: number;
  totalPoints: number;
  currentStreak: number;
  establishmentsVisited: number;
  favoriteEstablishments: number;
}

export type ViewMode = 'map' | 'list' | 'grid';

export type RecommendationCategoryType = 'all' | 'establishments' | 'cocktails' | 'events' | 'swig-circuits';

export interface Promoter {
  id: string;
  name: string;
  description: string;
  avatar_url?: string;
  banner_url?: string;
  follower_count: number;
  event_count: number;
  category: string;
  location?: string;
  rating?: number;
  tags: string[];
  is_verified?: boolean;
  upcoming_events?: PromoterEvent[];
  past_events?: PromoterEvent[];
}

export interface PromoterEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image_url?: string;
  ticket_price?: number;
  status: 'upcoming' | 'live' | 'past';
  attendee_count?: number;
}
