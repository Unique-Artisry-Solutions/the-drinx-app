
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

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
  user: {
    id: string;
    name: string;
  };
  likes: number;
  isLiked: boolean;
  metadata: Record<string, any>;
}

export interface PersonalizedData {
  loading: boolean;
  isAuthenticated: boolean;
  userStats: UserStats | null;
  recentActivity: RealtimeActivity[];
}

export const usePersonalizedData = (): PersonalizedData => {
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RealtimeActivity[]>([]);

  useEffect(() => {
    const fetchPersonalizedData = async () => {
      try {
        setLoading(true);
        
        if (isAuthenticated && user) {
          // Mock user stats
          const mockStats: UserStats = {
            totalMocktailsTried: Math.floor(Math.random() * 50) + 10,
            totalPoints: Math.floor(Math.random() * 2000) + 500,
            currentStreak: Math.floor(Math.random() * 15) + 1
          };
          
          // Mock recent activity
          const mockActivity: RealtimeActivity[] = [
            {
              id: '1',
              type: 'check-in',
              title: 'Checked in at The Mocktail Lounge',
              description: 'Just arrived for happy hour!',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              user: { id: user.id, name: user.user_metadata?.name || 'You' },
              likes: 3,
              isLiked: false,
              metadata: { establishment: 'The Mocktail Lounge' }
            },
            {
              id: '2',
              type: 'review',
              title: 'Reviewed Virgin Mojito',
              description: 'Amazing blend of mint and lime!',
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              user: { id: user.id, name: user.user_metadata?.name || 'You' },
              likes: 8,
              isLiked: true,
              metadata: { cocktail: 'Virgin Mojito', rating: 5 }
            }
          ];
          
          setUserStats(mockStats);
          setRecentActivity(mockActivity);
        }
      } catch (error) {
        console.error('Error fetching personalized data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalizedData();
  }, [isAuthenticated, user]);

  return {
    loading,
    isAuthenticated,
    userStats,
    recentActivity
  };
};
