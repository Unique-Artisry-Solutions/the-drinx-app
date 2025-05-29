
import { useState, useEffect } from 'react';
import { UserStats } from '@/types/ExploreTypes';
import { PersonalizedData, QuickAction } from '@/types/explore';
import { Search, MapPin, Plus, Users, Share, UserPlus } from 'lucide-react';

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
      const mockQuickActions: QuickAction[] = [
        {
          id: '1',
          title: 'Check In Nearby',
          description: 'Find and check into nearby establishments',
          icon: <MapPin className="h-5 w-5" />,
          color: 'bg-blue-500',
          isEnabled: true,
          onClick: () => console.log('Check in clicked')
        },
        {
          id: '2',
          title: 'Find Events',
          description: 'Discover upcoming swig events',
          icon: <Search className="h-5 w-5" />,
          color: 'bg-green-500',
          isEnabled: true,
          onClick: () => console.log('Find events clicked')
        },
        {
          id: '3',
          title: 'Create Recipe',
          description: 'Share your mocktail creation',
          icon: <Plus className="h-5 w-5" />,
          color: 'bg-purple-500',
          isEnabled: true,
          onClick: () => console.log('Create recipe clicked')
        },
        {
          id: '4',
          title: 'Start Bar Crawl',
          description: 'Begin a new adventure',
          icon: <Users className="h-5 w-5" />,
          color: 'bg-orange-500',
          isEnabled: true,
          onClick: () => console.log('Start bar crawl clicked')
        },
        {
          id: '5',
          title: 'Share Achievement',
          description: 'Show off your latest milestone',
          icon: <Share className="h-5 w-5" />,
          color: 'bg-pink-500',
          isEnabled: true,
          onClick: () => console.log('Share achievement clicked')
        },
        {
          id: '6',
          title: 'Find Friends',
          description: 'Connect with other swig enthusiasts',
          icon: <UserPlus className="h-5 w-5" />,
          color: 'bg-teal-500',
          isEnabled: true,
          onClick: () => console.log('Find friends clicked')
        }
      ];

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
        quickActions: mockQuickActions,
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
