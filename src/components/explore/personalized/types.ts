
export interface Activity {
  id: string;
  type: 'check-in' | 'review' | 'recipe' | 'achievement';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  location?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'establishment' | 'cocktail' | 'event';
  rating?: number;
  distance?: string;
  imageUrl?: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
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
