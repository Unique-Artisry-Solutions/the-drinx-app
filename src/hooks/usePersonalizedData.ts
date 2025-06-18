
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';

export interface UserStats {
  totalMocktailsTried: number;
  totalPoints: number;
  currentStreak: number;
  totalVisits: number;
  favoriteEstablishments: number;
  rewardsEarned: number;
  currentTier?: string;
  nextTier?: string;
  progressToNextTier?: number;
}

export interface ActivityItem {
  id: string;
  type: 'check-in' | 'mocktail' | 'achievement' | 'social';
  title: string;
  description: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
  };
  likes: number;
  isLiked: boolean;
  metadata: Record<string, any>;
}

export const usePersonalizedData = () => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { isDevelopment, isDevModeActive } = useDevelopmentMode();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const loadPersonalizedData = async () => {
      setLoading(true);
      
      try {
        // Development mode bypass or authenticated user
        if ((isDevelopment && isDevModeActive) || isAuthenticated) {
          // Mock data for authenticated users
          const mockStats: UserStats = {
            totalMocktailsTried: 12,
            totalPoints: 1250,
            currentStreak: 5,
            totalVisits: 23,
            favoriteEstablishments: 4,
            rewardsEarned: 3,
            currentTier: 'Silver',
            nextTier: 'Gold',
            progressToNextTier: 83
          };

          const mockActivity: ActivityItem[] = [
            {
              id: '1',
              type: 'check-in',
              title: 'Checked in at The Zen Garden',
              description: 'Tried their signature meditation mocktail',
              timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
              user: { id: 'user1', name: 'You' },
              likes: 0,
              isLiked: false,
              metadata: { establishment: 'The Zen Garden' }
            },
            {
              id: '2',
              type: 'achievement',
              title: 'Streak Master',
              description: 'Maintained a 5-day check-in streak!',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
              user: { id: 'user1', name: 'You' },
              likes: 3,
              isLiked: false,
              metadata: { achievement: 'streak_5_days' }
            }
          ];

          setUserStats(mockStats);
          setRecentActivity(mockActivity);
        } else {
          // For unauthenticated users, set null data
          setUserStats(null);
          setRecentActivity([]);
        }
      } catch (error) {
        console.error('Error loading personalized data:', error);
        setUserStats(null);
        setRecentActivity([]);
      } finally {
        setLoading(false);
      }
    };

    // Only load data when auth state is stable
    if (!authLoading) {
      loadPersonalizedData();
    }
  }, [isAuthenticated, isDevelopment, isDevModeActive, authLoading, user]);

  return {
    loading: loading || authLoading,
    isAuthenticated: (isDevelopment && isDevModeActive) || isAuthenticated,
    userStats,
    recentActivity
  };
};
