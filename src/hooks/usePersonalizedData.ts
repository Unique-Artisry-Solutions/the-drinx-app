
import { useState, useEffect } from 'react';
import { UserStats } from '@/types/ExploreTypes';
import { 
  Activity, 
  Recommendation, 
  QuickAction, 
  NearbyEstablishment, 
  UpcomingEvent 
} from '@/components/explore/personalized/types';

export interface PersonalizedData {
  loading: boolean;
  userStats: UserStats | null;
  recentActivity: Activity[];
  recommendations: Recommendation[];
  quickActions: QuickAction[];
  nearbyEstablishments: NearbyEstablishment[];
  upcomingEvents: UpcomingEvent[];
  isAuthenticated: boolean;
}

export const usePersonalizedData = (): PersonalizedData => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated] = useState(false); // Mock for now

  const [data, setData] = useState<Omit<PersonalizedData, 'loading' | 'isAuthenticated'>>({
    userStats: null,
    recentActivity: [],
    recommendations: [],
    quickActions: [],
    nearbyEstablishments: [],
    upcomingEvents: []
  });

  useEffect(() => {
    // Simulate loading and set mock data
    const timer = setTimeout(() => {
      setData({
        userStats: isAuthenticated ? {
          totalMocktailsTried: 12,
          totalPoints: 1250,
          currentStreak: 5,
          establishmentsVisited: 8,
          favoriteEstablishments: 3
        } : null,
        recentActivity: [],
        recommendations: [],
        quickActions: [],
        nearbyEstablishments: [],
        upcomingEvents: []
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return {
    loading,
    isAuthenticated,
    ...data
  };
};
