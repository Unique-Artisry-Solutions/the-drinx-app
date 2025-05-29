
export interface Activity {
  id: string;
  type: 'check-in' | 'review' | 'recipe' | 'achievement' | 'bar-crawl' | 'photo-share';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  location?: string;
  likes: number;
  isLiked: boolean;
  metadata?: Record<string, any>;
  imageUrl?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'establishment' | 'cocktail' | 'event';
  rating?: number;
  distance?: string;
  imageUrl?: string;
  reason: string;
  tags: string[];
  isSaved: boolean;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: string;
  isEnabled?: boolean;
  recentlyUsed?: boolean;
  badge?: string;
  shortcut?: string;
  requiresAuth?: boolean;
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
