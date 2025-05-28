
// User statistics interface
export interface UserStats {
  totalMocktailsTried: number;
  totalPoints: number;
  currentStreak: number;
  establishmentsVisited: number;
  favoriteEstablishments: number;
}

// Search and filter interfaces
export interface SearchInputProps {
  onSearch: (term: string) => void;
  className?: string;
}

export interface FilterPanelProps {
  filters?: any;
  onFilterChange?: (filters: any) => void;
}

// Section component interfaces
export interface FeaturedEstablishmentsSectionProps {
  establishments: any[];
}

export interface CocktailsSectionProps {
  cocktails: any[];
  resetFilters: () => void;
}

export interface BarCrawlSectionProps {
  barCrawls: any[];
  isAuthenticated: boolean;
}

// List component interfaces
export interface EstablishmentListProps {
  establishments?: any[];
  searchTerm?: string;
}

export interface AllCocktailsProps {
  cocktails?: any[];
  searchTerm?: string;
}
