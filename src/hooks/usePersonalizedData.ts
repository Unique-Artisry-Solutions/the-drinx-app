
import { useState, useEffect } from 'react';

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

export interface UserStats {
  totalPoints: number;
  currentStreak: number;
  mocktailsTried: number;
  favoriteEstablishment: string;
  weeklyGoal: {
    current: number;
    target: number;
  };
  achievements: Array<{
    id: string;
    name: string;
    unlockedAt: string;
  }>;
}

export interface Recommendation {
  id: string;
  type: 'cocktail' | 'establishment' | 'event';
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  rating?: number;
  distance?: string;
  price?: string;
  href: string;
}

export interface Activity {
  id: string;
  type: 'check_in' | 'review' | 'achievement' | 'social';
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    establishment?: string;
    rating?: number;
    points?: number;
  };
}

export interface Establishment {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  isOpen: boolean;
  image?: string;
  specialOffer?: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  attendees: number;
  image?: string;
  price?: string;
  category: string;
}

export const usePersonalizedData = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated] = useState(false); // Mock authentication state

  const [data, setData] = useState({
    userStats: null as UserStats | null,
    recentActivity: [] as Activity[],
    recommendations: [] as Recommendation[],
    quickActions: [] as QuickAction[],
    nearbyEstablishments: [] as Establishment[],
    upcomingEvents: [] as Event[]
  });

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setData({
        userStats: isAuthenticated ? {
          totalPoints: 1250,
          currentStreak: 5,
          mocktailsTried: 23,
          favoriteEstablishment: "The Mockery",
          weeklyGoal: {
            current: 3,
            target: 5
          },
          achievements: [
            { id: '1', name: 'First Check-in', unlockedAt: '2024-01-15' },
            { id: '2', name: 'Social Butterfly', unlockedAt: '2024-01-20' }
          ]
        } : null,
        recentActivity: isAuthenticated ? [
          {
            id: '1',
            type: 'check_in',
            title: 'Checked in at The Mockery',
            description: 'Tried their signature Virgin Mojito',
            timestamp: '2024-01-25T10:30:00Z',
            metadata: { establishment: 'The Mockery', points: 50 }
          },
          {
            id: '2',
            type: 'review',
            title: 'Left a review',
            description: 'Rated the Cucumber Mint Cooler 5 stars',
            timestamp: '2024-01-24T15:45:00Z',
            metadata: { rating: 5, points: 25 }
          }
        ] : [],
        recommendations: [
          {
            id: '1',
            type: 'establishment',
            title: 'The Dry Bar',
            subtitle: 'Craft mocktails & live music',
            description: 'Popular spot known for innovative alcohol-free cocktails',
            rating: 4.8,
            distance: '0.8 mi',
            href: '/establishment/1',
            image: '/api/placeholder/80/80'
          },
          {
            id: '2',
            type: 'cocktail',
            title: 'Spiced Pear Fizz',
            subtitle: 'Seasonal favorite',
            description: 'Perfect blend of pear, cinnamon, and sparkling water',
            price: '$8',
            href: '/cocktail/2',
            image: '/api/placeholder/80/80'
          }
        ],
        quickActions: [
          {
            id: '1',
            title: 'Find Nearby',
            description: 'Discover establishments',
            icon: 'map',
            href: '/map',
            color: 'blue'
          },
          {
            id: '2',
            title: 'Browse Events',
            description: 'Upcoming activities',
            icon: 'calendar',
            href: '/events',
            color: 'green'
          },
          {
            id: '3',
            title: 'Create Recipe',
            description: 'Share your mocktail',
            icon: 'camera',
            href: '/profile?tab=recipes',
            color: 'purple'
          },
          {
            id: '4',
            title: 'Join Circuit',
            description: 'Find swig circuits',
            icon: 'users',
            href: '/swig-circuits',
            color: 'pink'
          },
          {
            id: '5',
            title: 'Leaderboard',
            description: 'See top users',
            icon: 'trophy',
            href: '/leaderboard',
            color: 'amber'
          },
          {
            id: '6',
            title: 'Search',
            description: 'Find anything',
            icon: 'search',
            href: '/search',
            color: 'orange'
          }
        ],
        nearbyEstablishments: [
          {
            id: '1',
            name: 'The Dry Bar',
            address: '123 Main St, Downtown',
            distance: '0.8 mi',
            rating: 4.8,
            isOpen: true,
            specialOffer: '20% off first visit',
            image: '/api/placeholder/80/80'
          },
          {
            id: '2',
            name: 'Spiritless Lounge',
            address: '456 Oak Ave, Midtown',
            distance: '1.2 mi',
            rating: 4.6,
            isOpen: false,
            image: '/api/placeholder/80/80'
          }
        ],
        upcomingEvents: [
          {
            id: '1',
            name: 'Mocktail Monday Mixer',
            date: '2024-02-05',
            time: '7:00 PM',
            venue: 'The Dry Bar',
            attendees: 24,
            category: 'social',
            price: 'Free'
          },
          {
            id: '2',
            name: 'Cocktail Crafting Workshop',
            date: '2024-02-08',
            time: '6:30 PM',
            venue: 'Spiritless Academy',
            attendees: 12,
            category: 'workshop',
            price: '$25'
          }
        ]
      });
      setLoading(false);
    }, 500);
  }, [isAuthenticated]);

  return {
    loading,
    isAuthenticated,
    ...data
  };
};
