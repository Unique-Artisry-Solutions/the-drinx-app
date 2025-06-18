
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
  type: 'check-in' | 'achievement' | 'review' | 'recipe' | 'bar-crawl' | 'photo-share';
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
  type: 'establishment' | 'cocktail' | 'event';
  title: string;
  description: string;
  imageUrl?: string;
  rating?: number;
  distance?: string;
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

export const usePersonalizedData = () => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { isDevelopment, isDevModeActive } = useDevelopmentMode();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [nearbyEstablishments, setNearbyEstablishments] = useState<NearbyEstablishment[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);

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
            },
            {
              id: '3',
              type: 'recipe',
              title: 'Created Virgin Mojito Recipe',
              description: 'Shared a refreshing summer mocktail recipe',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
              user: { id: 'user1', name: 'You' },
              likes: 8,
              isLiked: false,
              metadata: { recipe: 'virgin_mojito' }
            }
          ];

          const mockRecommendations: Recommendation[] = [
            {
              id: '1',
              type: 'establishment',
              title: 'The Mocktail Lounge',
              description: 'New craft cocktail bar specializing in virgin drinks',
              rating: 4.8,
              distance: '0.3 miles'
            },
            {
              id: '2',
              type: 'cocktail',
              title: 'Lavender Lemonade',
              description: 'Perfect for your taste preferences',
              rating: 4.6
            },
            {
              id: '3',
              type: 'event',
              title: 'Mocktail Making Workshop',
              description: 'Learn new techniques this weekend',
              rating: 4.9
            }
          ];

          const mockQuickActions: QuickAction[] = [
            {
              id: '1',
              title: 'Check In Nearby',
              description: 'Find and check into establishments',
              iconName: 'MapPin',
              color: 'bg-blue-500',
              isEnabled: true,
              onClick: () => console.log('Check in nearby')
            },
            {
              id: '2',
              title: 'Find Events',
              description: 'Discover upcoming mocktail events',
              iconName: 'Search',
              color: 'bg-green-500',
              isEnabled: true,
              onClick: () => console.log('Find events')
            },
            {
              id: '3',
              title: 'Create Recipe',
              description: 'Share your favorite mocktail',
              iconName: 'Plus',
              color: 'bg-purple-500',
              isEnabled: true,
              onClick: () => console.log('Create recipe')
            }
          ];

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
            },
            {
              id: '3',
              name: 'Zero Proof Kitchen',
              description: 'Farm-to-table mocktails',
              distance: '1.2 miles',
              rating: 4.6,
              isOpen: false
            }
          ];

          const mockUpcomingEvents: UpcomingEvent[] = [
            {
              id: '1',
              title: 'Mocktail Mixology Workshop',
              description: 'Learn to craft the perfect virgin cocktails',
              date: 'Dec 15',
              time: '7:00 PM',
              location: 'The Mocktail Lounge',
              attendees: 12
            },
            {
              id: '2',
              title: 'Sober Social Hour',
              description: 'Weekly community meetup',
              date: 'Dec 17',
              time: '6:00 PM',
              location: 'Sober Social Club',
              attendees: 8
            }
          ];

          setUserStats(mockStats);
          setRecentActivity(mockActivity);
          setRecommendations(mockRecommendations);
          setQuickActions(mockQuickActions);
          setNearbyEstablishments(mockNearbyEstablishments);
          setUpcomingEvents(mockUpcomingEvents);
        } else {
          // For unauthenticated users, set empty data
          setUserStats(null);
          setRecentActivity([]);
          setRecommendations([]);
          setQuickActions([]);
          setNearbyEstablishments([]);
          setUpcomingEvents([]);
        }
      } catch (error) {
        console.error('Error loading personalized data:', error);
        setUserStats(null);
        setRecentActivity([]);
        setRecommendations([]);
        setQuickActions([]);
        setNearbyEstablishments([]);
        setUpcomingEvents([]);
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
    recentActivity,
    recommendations,
    quickActions,
    nearbyEstablishments,
    upcomingEvents
  };
};
