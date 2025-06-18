
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/core/useAuth';
import { UserStats } from '@/types/ExploreTypes';

export interface PersonalizedData {
  userStats: UserStats;
  recentActivity: any[];
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export const usePersonalizedData = (): PersonalizedData => {
  const { state } = useAuth();
  const { isAuthenticated, isLoading: authLoading } = state;
  
  const [userStats, setUserStats] = useState<UserStats>({
    totalMocktailsTried: 0,
    totalPoints: 0,
    currentStreak: 0,
    establishmentsVisited: 0,
    favoriteEstablishments: 0,
  });
  
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersonalizedData = async () => {
      // Don't fetch data until auth state is stable
      if (authLoading) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (isAuthenticated) {
          // Fetch real user data when authenticated
          // For now, using mock data but structure is ready for real API calls
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
          
          setUserStats({
            totalMocktailsTried: 12,
            totalPoints: 1250,
            currentStreak: 5,
            establishmentsVisited: 8,
            favoriteEstablishments: 3,
          });

          setRecentActivity([
            {
              id: '1',
              type: 'check-in',
              title: 'Checked in at The Zen Garden',
              description: 'Tried the Tropical Paradise Punch',
              timestamp: new Date().toISOString(),
              user: { id: 'user1', name: 'You' },
              likes: 0,
              isLiked: false,
              metadata: {}
            },
            {
              id: '2',
              type: 'achievement',
              title: 'Achievement Unlocked!',
              description: 'Visited 5 establishments this month',
              timestamp: new Date(Date.now() - 86400000).toISOString(),
              user: { id: 'user1', name: 'You' },
              likes: 0,
              isLiked: false,
              metadata: {}
            }
          ]);
        } else {
          // Reset data for unauthenticated users
          setUserStats({
            totalMocktailsTried: 0,
            totalPoints: 0,
            currentStreak: 0,
            establishmentsVisited: 0,
            favoriteEstablishments: 0,
          });
          setRecentActivity([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch personalized data');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalizedData();
  }, [isAuthenticated, authLoading]);

  return {
    userStats,
    recentActivity,
    loading: loading || authLoading, // Include auth loading in overall loading state
    isAuthenticated,
    error
  };
};
