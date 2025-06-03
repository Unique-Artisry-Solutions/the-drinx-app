
/**
 * ProfileTypes.ts
 * Profile-specific type definitions that extend core types
 */

import { 
  UserVisit, 
  VisitNote, 
  TriedMocktail, 
  UserVisitAchievement, 
  UserNotification 
} from './VisitTypes';

// Import core types to ensure consistency
import {
  User,
  Establishment,
  Cocktail,
  BarCrawl,
  EstablishmentCard
} from './CoreTypes';

// Re-export core types for backward compatibility
export type { User, Establishment, Cocktail, BarCrawl };

// Profile-specific component props using core types
export interface ProfileHeaderProps {
  userName: string;
  handleLogout: () => void;
}

export interface BarCrawlTabProps {
  barCrawlList: Establishment[];
  shareBarCrawl: () => void;
}

export interface VisitedTabProps {
  visitedEstablishments: Establishment[];
}

export interface FavoritesTabProps {
  favoriteCocktails: Cocktail[];
}

// Export the visit related types for convenience
export type { 
  UserVisit,
  VisitNote,
  TriedMocktail,
  UserVisitAchievement,
  UserNotification
};
