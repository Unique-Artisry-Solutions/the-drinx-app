
import { ReactNode } from 'react';

// Unified Activity interface - base interface for all activity types
export interface Activity {
  id: string;
  type: 'check-in' | 'review' | 'recipe' | 'achievement' | 'bar-crawl' | 'photo-share';
  title: string;
  description: string;
  timestamp: string;
  user?: string | {
    id: string;
    name: string;
    avatar?: string;
  };
  location?: string;
}

// Extended RealtimeActivity interface - includes social features
export interface RealtimeActivity extends Activity {
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  imageUrl?: string;
  likes: number;
  isLiked: boolean;
  metadata?: Record<string, any>;
}

// Unified Recommendation interface
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'establishment' | 'cocktail' | 'event' | 'recipe';
  rating?: number;
  distance?: string;
  price?: string;
  imageUrl?: string;
  reason?: string;
  tags?: string[];
  isSaved?: boolean;
  availability?: 'open' | 'closing-soon' | 'closed';
  trending?: boolean;
  metadata?: Record<string, any>;
}

// Strict filter type definitions
export type ActivityFilterType = 'all' | 'friends' | 'nearby';
export type RecommendationCategoryType = 'all' | 'establishments' | 'cocktails' | 'events' | 'recipes' | 'swig-circuits';

// Updated QuickAction interface with strict types
export interface QuickAction {
  id: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
  isEnabled: boolean;
  requiresAuth?: boolean;
  badge?: string;
  shortcut?: string;
  recentlyUsed?: boolean;
  onClick: () => void | Promise<void>;
}

// Type-safe filter handler interfaces
export interface ActivityFilterHandler {
  (value: ActivityFilterType): void;
}

export interface RecommendationCategoryHandler {
  (category: RecommendationCategoryType): void;
}

// User stats and other interfaces
export interface UserStats {
  totalMocktailsTried: number;
  totalPoints: number;
  currentStreak: number;
  establishmentsVisited: number;
  favoriteEstablishments: number;
}

export type ViewMode = 'map' | 'list' | 'grid';

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

// Establishment and Event interfaces
export interface NearbyEstablishment {
  id: string;
  name: string;
  description: string;
  distance: string;
  rating: number;
  isOpen: boolean;
  imageUrl?: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  imageUrl?: string;
}

// Personalized data interface with strict typing
export interface PersonalizedData {
  loading: boolean;
  userStats: any | null;
  recentActivity: Activity[];
  recommendations: Recommendation[];
  quickActions: QuickAction[];
  nearbyEstablishments: NearbyEstablishment[];
  upcomingEvents: UpcomingEvent[];
  isAuthenticated: boolean;
}
