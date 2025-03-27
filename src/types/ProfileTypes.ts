
/**
 * ProfileTypes.ts
 * Centralized type definitions for profile-related components
 */

// Basic establishment type
export interface Establishment {
  id: string;
  name: string;
  address: string;
}

// Cocktail type used in FavoritesTab
export interface Cocktail {
  id: string;
  name: string;
  price: number | string;
  establishment: string | { name: string };
}

// Props for ProfileHeader component
export interface ProfileHeaderProps {
  userName: string;
  handleLogout: () => void;
}

// Props for BarCrawlTab component
export interface BarCrawlTabProps {
  barCrawlList: Establishment[];
  shareBarCrawl: () => void;
}

// Props for VisitedTab component
export interface VisitedTabProps {
  visitedEstablishments: Establishment[];
}

// Props for FavoritesTab component
export interface FavoritesTabProps {
  favoriteCocktails: Cocktail[];
}
