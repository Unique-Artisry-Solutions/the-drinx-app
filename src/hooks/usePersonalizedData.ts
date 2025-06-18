
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

export interface Recommendation {
  id: string;
  type: 'cocktail' | 'establishment' | 'event';
  title: string;
  subtitle: string;
  imageUrl?: string;
  rating?: number;
  reason: string;
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

export const usePersonalizedData = (): PersonalizedData => {
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RealtimeActivity[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [nearbyEstablishments, setNearbyEstablishments] = useState<NearbyEstablishment[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);

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

          // Mock recommendations
          const mockRecommendations: Recommendation[] = [
            {
              id: '1',
              type: 'cocktail',
              title: 'Tropical Paradise',
              subtitle: 'Pineapple, Coconut & Lime',
              rating: 4.8,
              reason: 'Based on your love for fruity drinks'
            },
            {
              id: '2',
              type: 'establishment',
              title: 'The Garden Lounge',
              subtitle: '2.1 miles away',
              rating: 4.6,
              reason: 'New establishment in your area'
            }
          ];

          // Mock quick actions
          const mockQuickActions: QuickAction[] = [
            {
              id: 'check-in',
              title: 'Check In',
              description: 'Find nearby establishments',
              iconName: 'MapPin',
              color: 'bg-blue-500',
              isEnabled: true,
              onClick: () => console.log('Check in')
            },
            {
              id: 'discover',
              title: 'Discover',
              description: 'Explore new mocktails',
              iconName: 'Search',
              color: 'bg-green-500',
              isEnabled: true,
              onClick: () => console.log('Discover')
            }
          ];

          // Mock nearby establishments
          const mockNearbyEstablishments: NearbyEstablishment[] = [
            {
              id: '1',
              name: 'The Mocktail Lounge',
              description: 'Creative non-alcoholic cocktails',
              distance: '0.3 miles',
              rating: 4.8,
              isOpen: true
            },
            {
              id: '2',
              name: 'Sober Social Club',
              description: 'Community-focused sober bar',
              distance: '0.7 miles',
              rating: 4.5,
              isOpen: true
            }
          ];

          // Mock upcoming events
          const mockUpcomingEvents: UpcomingEvent[] = [
            {
              id: '1',
              title: 'Mocktail Mixology Workshop',
              description: 'Learn to craft the perfect virgin cocktails',
              date: 'Dec 15',
              time: '7:00 PM',
              location: 'The Mocktail Lounge',
              attendees: 12
            }
          ];
          
          setUserStats(mockStats);
          setRecentActivity(mockActivity);
          setRecommendations(mockRecommendations);
          setQuickActions(mockQuickActions);
          setNearbyEstablishments(mockNearbyEstablishments);
          setUpcomingEvents(mockUpcomingEvents);
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
    recentActivity,
    recommendations,
    quickActions,
    nearbyEstablishments,
    upcomingEvents
  };
};
