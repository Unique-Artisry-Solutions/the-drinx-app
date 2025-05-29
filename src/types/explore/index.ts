
import { ReactNode } from 'react';

// Unified Activity interface
export interface Activity {
  id: string;
  type: 'check-in' | 'review' | 'recipe' | 'achievement';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  location?: string;
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

// Unified QuickAction interface
export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  isEnabled: boolean;
  requiresAuth?: boolean;
  badge?: string;
  shortcut?: string;
  recentlyUsed?: boolean;
  onClick: () => void | Promise<void>;
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

// Personalized data interface
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
