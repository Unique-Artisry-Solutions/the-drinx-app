
import { useState, useEffect } from 'react';
import { UserStats } from '@/types/ExploreTypes';
import { 
  Activity, 
  Recommendation, 
  QuickAction, 
  NearbyEstablishment, 
  UpcomingEvent 
} from '@/components/explore/personalized/types';
import { 
  MapPin, 
  Calendar, 
  PlusCircle, 
  Route, 
  Share2, 
  Users 
} from 'lucide-react';

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
      const mockRecentActivity: Activity[] = [
        {
          id: '1',
          type: 'check-in',
          title: 'Checked in at The Mocktail Lounge',
          description: 'Enjoyed a refreshing Virgin Mojito',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          user: 'Alex Johnson',
          location: 'Downtown',
          likes: 12,
          isLiked: true,
          imageUrl: '/api/placeholder/300/200'
        },
        {
          id: '2',
          type: 'recipe',
          title: 'Created new recipe: Sunset Sparkler',
          description: 'A vibrant orange and pink layered mocktail perfect for summer evenings',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          user: 'Sarah Chen',
          likes: 8,
          isLiked: false,
          metadata: { ingredients: ['orange juice', 'cranberry juice', 'sparkling water'] }
        },
        {
          id: '3',
          type: 'achievement',
          title: 'Earned "Explorer" badge',
          description: 'Visited 10 different establishments this month',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          user: 'Mike Rodriguez',
          likes: 15,
          isLiked: true
        }
      ];

      const mockRecommendations: Recommendation[] = [
        {
          id: 'rec-1',
          title: 'The Garden Terrace',
          description: 'A rooftop bar specializing in fresh herb-infused mocktails with a stunning city view',
          type: 'establishment',
          rating: 4.8,
          distance: '0.3 miles',
          imageUrl: '/api/placeholder/400/200',
          reason: 'Based on your love for herb-infused drinks',
          tags: ['rooftop', 'herbs', 'city view'],
          isSaved: false
        },
        {
          id: 'rec-2',
          title: 'Lavender Lemon Fizz',
          description: 'A calming blend of lavender syrup, fresh lemon, and sparkling water',
          type: 'cocktail',
          rating: 4.6,
          reason: 'Perfect for your taste in floral mocktails',
          tags: ['floral', 'refreshing', 'summer'],
          isSaved: true
        },
        {
          id: 'rec-3',
          title: 'Mocktail Mixology Workshop',
          description: 'Learn advanced techniques from professional bartenders',
          type: 'event',
          reason: 'Continue your mixology journey',
          tags: ['workshop', 'learning', 'hands-on'],
          isSaved: false
        }
      ];

      const mockQuickActions: QuickAction[] = [
        {
          id: 'check-in',
          title: 'Check In Nearby',
          description: 'Find and check into establishments around you',
          icon: <MapPin className="h-5 w-5" />,
          color: 'bg-blue-500',
          isEnabled: true,
          onClick: () => console.log('Check in nearby')
        },
        {
          id: 'find-events',
          title: 'Find Events',
          description: 'Discover upcoming mocktail events',
          icon: <Calendar className="h-5 w-5" />,
          color: 'bg-green-500',
          isEnabled: true,
          badge: 'New',
          onClick: () => console.log('Find events')
        },
        {
          id: 'create-recipe',
          title: 'Create Recipe',
          description: 'Share your mocktail creation',
          icon: <PlusCircle className="h-5 w-5" />,
          color: 'bg-purple-500',
          isEnabled: true,
          recentlyUsed: true,
          onClick: () => console.log('Create recipe')
        }
      ];

      const mockNearbyEstablishments: NearbyEstablishment[] = [
        {
          id: 'est-1',
          name: 'The Botanical Bar',
          description: 'Fresh botanical mocktails in a garden setting',
          distance: '0.2 miles',
          rating: 4.7,
          isOpen: true,
          imageUrl: '/api/placeholder/300/200'
        },
        {
          id: 'est-2',
          name: 'Citrus & Sage',
          description: 'Mediterranean-inspired alcohol-free cocktails',
          distance: '0.5 miles',
          rating: 4.5,
          isOpen: true,
          imageUrl: '/api/placeholder/300/200'
        }
      ];

      const mockUpcomingEvents: UpcomingEvent[] = [
        {
          id: 'event-1',
          title: 'Summer Mocktail Festival',
          description: 'A celebration of creative non-alcoholic cocktails',
          date: 'June 15, 2024',
          time: '2:00 PM',
          location: 'Central Park',
          attendees: 150,
          imageUrl: '/api/placeholder/400/200'
        },
        {
          id: 'event-2',
          title: 'Mixology Masterclass',
          description: 'Learn from award-winning bartenders',
          date: 'June 20, 2024',
          time: '7:00 PM',
          location: 'The Modern Cocktail Co.',
          attendees: 25
        }
      ];

      setData({
        userStats: isAuthenticated ? {
          totalMocktailsTried: 47,
          totalPoints: 2350,
          currentStreak: 8,
          establishmentsVisited: 15,
          favoriteEstablishments: 5
        } : null,
        recentActivity: mockRecentActivity,
        recommendations: mockRecommendations,
        quickActions: mockQuickActions,
        nearbyEstablishments: mockNearbyEstablishments,
        upcomingEvents: mockUpcomingEvents
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
