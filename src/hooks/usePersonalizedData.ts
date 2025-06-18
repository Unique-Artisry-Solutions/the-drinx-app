
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export interface PersonalizedData {
  totalMocktailsTried: number;
  totalPoints: number;
  currentStreak: number;
  favoriteEstablishments: any[];
  recentActivity: any[];
  recommendations: any[];
}

export const usePersonalizedData = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<PersonalizedData>({
    totalMocktailsTried: 0,
    totalPoints: 0,
    currentStreak: 0,
    favoriteEstablishments: [],
    recentActivity: [],
    recommendations: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPersonalizedData = async () => {
      if (authLoading) {
        return; // Wait for auth to stabilize
      }

      setIsLoading(true);
      setError(null);

      try {
        if (isAuthenticated && user) {
          // Load authenticated user's personalized data
          const personalizedData = {
            totalMocktailsTried: 15,
            totalPoints: 320,
            currentStreak: 5,
            favoriteEstablishments: [
              { id: '1', name: 'The Mocktail Lounge', rating: 4.8 },
              { id: '2', name: 'Sober Spirits', rating: 4.6 }
            ],
            recentActivity: [
              { id: '1', action: 'Tried new mocktail', timestamp: new Date() },
              { id: '2', action: 'Visited establishment', timestamp: new Date() }
            ],
            recommendations: [
              { id: '1', type: 'mocktail', name: 'Virgin Mojito Supreme' },
              { id: '2', type: 'establishment', name: 'Zero Proof Bar' }
            ]
          };
          setData(personalizedData);
        } else {
          // Load public/sample data for unauthenticated users
          const publicData = {
            totalMocktailsTried: 0,
            totalPoints: 0,
            currentStreak: 0,
            favoriteEstablishments: [],
            recentActivity: [],
            recommendations: [
              { id: '1', type: 'mocktail', name: 'Classic Virgin Mojito' },
              { id: '2', type: 'establishment', name: 'Popular Spots Near You' }
            ]
          };
          setData(publicData);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load personalized data');
      } finally {
        setIsLoading(false);
      }
    };

    loadPersonalizedData();
  }, [user, isAuthenticated, authLoading]);

  return {
    data,
    isLoading: isLoading || authLoading,
    error,
    isAuthenticated
  };
};
