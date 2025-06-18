
export interface UserStats {
  totalMocktailsTried: number;
  totalPoints: number;
  currentStreak: number;
  establishmentsVisited: number;
  favoriteEstablishments: number;
}

export type ViewMode = 'map' | 'list' | 'grid';

// Recommendation category types for filtering
export type RecommendationCategory = 'all' | 'places' | 'drinks' | 'events' | 'recipes';
