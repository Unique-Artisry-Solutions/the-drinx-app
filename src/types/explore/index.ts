
// Main explore types - unified location for all explore-related types
export interface UserStats {
  totalMocktailsTried: number;
  totalPoints: number;
  currentStreak: number;
  establishmentsVisited: number;
  favoriteEstablishments: number;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
  isEnabled: boolean;
  onClick: () => void;
}

export interface RealtimeActivity {
  id: string;
  type: 'check-in' | 'review' | 'achievement' | 'social';
  title: string;
  description: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
  };
  likes: number;
  isLiked: boolean;
  metadata: Record<string, any>;
}

// ViewMode type definition
export type ViewMode = 'map' | 'list' | 'grid';

// Export ViewMode from ExploreTypes.ts for backward compatibility
export type { ViewMode as ViewModeFromExploreTypes } from '@/types/ExploreTypes';
