
// Centralized type definitions for explore functionality

export interface ActivityItem {
  id: string;
  type: 'check-in' | 'review' | 'recipe' | 'achievement' | 'bar-crawl' | 'photo-share' | 'favorite';
  title: string;
  description: string;
  timestamp: string;
  location?: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  likes: number;
  isLiked: boolean;
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
  promoter_username?: string;
  promoter_id?: string;
}

export interface NearbyEstablishment {
  id: string;
  name: string;
  description: string;
  distance: string;
  rating: number;
  isOpen: boolean;
  imageUrl?: string;
}

export interface QuickStats {
  totalMocktailsTried: number;
  totalPoints: number;
  currentStreak: number;
}

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

export interface UserStats {
  totalMocktailsTried: number;
  totalPoints: number;
  currentStreak: number;
  establishmentsVisited: number;
  favoriteEstablishments: number;
}

export interface Recommendation {
  id: string;
  type: 'establishment' | 'cocktail' | 'event' | 'recipe';
  title: string;
  description: string;
  reason: string;
  imageUrl?: string;
  rating?: number;
  distance?: string;
  date?: string;
  time?: string;
  attendees?: number;
  location?: string;
}

export interface PersonalizedDataReturn {
  quickStats: QuickStats;
  activities: ActivityItem[];
  nearbyEstablishments: NearbyEstablishment[];
  upcomingEvents: UpcomingEvent[];
  quickActions: QuickAction[];
  loading: boolean;
  userStats: UserStats;
  isAuthenticated: boolean;
  recentActivity: ActivityItem[];
  recommendations: Recommendation[];
}
