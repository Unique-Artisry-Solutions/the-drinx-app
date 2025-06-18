import { useState, useEffect } from 'react';
import { useQuickActions } from '@/hooks/useQuickActions';
import { RecommendationCategory } from '@/types/ExploreTypes';

export interface UserStats {
  totalMocktailsTried: number;
  totalPoints: number;
  currentStreak: number;
}

export interface RealtimeActivity {
  id: string;
  type: 'check-in' | 'review' | 'achievement' | 'social';
  title: string;
  description: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

export interface Recommendation {
  id: string;
  type: 'establishment' | 'cocktail' | 'event' | 'recipe';
  title: string;
  subtitle: string;
  imageUrl?: string;
  rating?: number;
  reason: string;
  category: RecommendationCategory;
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

export interface PersonalizedData {
  loading: boolean;
  isAuthenticated: boolean;
  userStats: UserStats | null;
  recentActivity: RealtimeActivity[];
  recommendations: Recommendation[];
  quickActions: QuickAction[];
  nearbyEstablishments: NearbyEstablishment[];
  upcomingEvents: UpcomingEvent[];
}

export const usePersonalizedData = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userStats, setUserStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<RealtimeActivity[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [nearbyEstablishments, setNearbyEstablishments] = useState<NearbyEstablishment[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  
  const { createQuickActions } = useQuickActions();
  const quickActions = createQuickActions();

  useEffect(() => {
    const loadData = async () => {
      // Simulate API loading
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock user stats
      setUserStats({
        totalMocktailsTried: 12,
        totalPoints: 1250,
        currentStreak: 5,
        establishmentsVisited: 8,
        favoriteEstablishments: 3
      });

      // Mock activity feed
      setRecentActivity([
        {
          id: '1',
          type: 'check-in',
          title: 'Checked in at The Garden Lounge',
          description: 'Tried their signature "Garden Paradise" mocktail',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          likes: 5,
          isLiked: false
        },
        {
          id: '2',
          type: 'achievement',
          title: 'Streak Master!',
          description: 'Achieved 5-day check-in streak',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          likes: 12,
          isLiked: true
        }
      ]);

      // Mock recommendations with categories
      setRecommendations([
        {
          id: '1',
          type: 'cocktail',
          title: 'Tropical Paradise',
          subtitle: 'Pineapple, Coconut & Lime',
          rating: 4.8,
          reason: 'Based on your love for fruity drinks',
          category: 'drinks'
        },
        {
          id: '2',
          type: 'establishment',
          title: 'The Garden Lounge',
          subtitle: '2.1 miles away',
          rating: 4.6,
          reason: 'New establishment in your area',
          category: 'places'
        },
        {
          id: '3',
          type: 'event',
          title: 'Mocktail Masterclass',
          subtitle: 'Tomorrow at 7 PM',
          reason: 'Perfect for your skill level',
          category: 'events'
        },
        {
          id: '4',
          type: 'recipe',
          title: 'Sunset Spritz Recipe',
          subtitle: 'Easy 5-minute recipe',
          rating: 4.7,
          reason: 'Matches your preferred difficulty',
          category: 'recipes'
        }
      ]);

      // Mock nearby establishments
      setNearbyEstablishments([
        {
          id: '1',
          name: 'The Zen Garden',
          description: 'Peaceful atmosphere with meditation-inspired mocktails',
          distance: '0.3 miles',
          rating: 4.8,
          isOpen: true
        },
        {
          id: '2',
          name: 'Rooftop Sunset Bar',
          description: 'Amazing city views and creative drinks',
          distance: '0.7 miles',
          rating: 4.9,
          isOpen: true
        }
      ]);

      // Mock upcoming events
      setUpcomingEvents([
        {
          id: '1',
          title: 'Mindful Mixology Workshop',
          description: 'Learn to create mocktails with intention',
          date: '2024-01-15',
          time: '7:00 PM',
          location: 'The Zen Garden',
          attendees: 24
        }
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  return {
    loading,
    isAuthenticated,
    userStats,
    recentActivity,
    recommendations,
    quickActions,
    nearbyEstablishments,
    upcomingEvents
  };
};
