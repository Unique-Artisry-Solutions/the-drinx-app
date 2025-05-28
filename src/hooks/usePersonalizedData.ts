import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
}

export interface UserStats {
  totalVisits: number;
  favoriteEstablishments: number;
  reviewsWritten: number;
  averageRating: number;
}

export interface RecentActivity {
  id: string;
  type: 'visit' | 'review' | 'favorite';
  establishment: string;
  details?: string;
  timestamp: string;
}

export interface PersonalizedRecommendation {
  id: string;
  type: 'cocktail' | 'establishment';
  name: string;
  reason: string;
  rating?: number;
  distance?: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  location: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  progress: number;
  total: number;
  target: number; // Added missing target property
  pointsReward: number;
  icon: string;
  urgency: 'low' | 'medium' | 'high';
  suggestion?: string;
  estimatedCompletion?: string;
}

export interface TrendingMocktail {
  id: string;
  name: string;
  description: string;
  popularity: number;
  image?: string;
  establishmentName: string;
}

export const usePersonalizedData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [nearbyEstablishments, setNearbyEstablishments] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [trendingMocktails, setTrendingMocktails] = useState<TrendingMocktail[]>([]);

  useEffect(() => {
    // Simulate API call with a delay
    const timer = setTimeout(() => {
      setUserStats(mockUserStats);
      setRecentActivity(mockRecentActivity);
      setRecommendations(mockRecommendations);
      setQuickActions(mockQuickActions);
      setNearbyEstablishments(mockNearbyEstablishments);
      setUpcomingEvents(mockUpcomingEvents);
      setTrendingMocktails(mockTrendingMocktails);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [user]);

  // Mock data
  const mockUserStats: UserStats = {
    totalVisits: 12,
    favoriteEstablishments: 5,
    reviewsWritten: 8,
    averageRating: 4.2
  };

  const mockRecentActivity: RecentActivity[] = [
    {
      id: '1',
      type: 'visit',
      establishment: 'The Sober Parrot',
      timestamp: '2 days ago'
    },
    {
      id: '2',
      type: 'review',
      establishment: 'Mocktail Lounge',
      details: 'Rated 5 stars',
      timestamp: '1 week ago'
    },
    {
      id: '3',
      type: 'favorite',
      establishment: 'Zero Proof Bar',
      timestamp: '2 weeks ago'
    }
  ];

  const mockRecommendations: PersonalizedRecommendation[] = [
    {
      id: '1',
      type: 'cocktail',
      name: 'Virgin Mojito',
      reason: 'Based on your taste preferences',
      rating: 4.8
    },
    {
      id: '2',
      type: 'establishment',
      name: 'Sober Social Club',
      reason: 'Popular in your area',
      distance: '1.2 miles'
    },
    {
      id: '3',
      type: 'cocktail',
      name: 'Berry Blast',
      reason: 'Trending this week',
      rating: 4.5
    }
  ];

  const mockQuickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Find Nearby',
      description: 'Discover establishments near you',
      icon: 'map-pin',
      action: () => console.log('Navigate to map')
    },
    {
      id: '2',
      title: 'Explore Drinks',
      description: 'Browse popular mocktails',
      icon: 'glass-water',
      action: () => console.log('Navigate to mocktails')
    },
    {
      id: '3',
      title: 'Upcoming Events',
      description: 'See what\'s happening',
      icon: 'calendar',
      action: () => console.log('Navigate to events')
    },
    {
      id: '4',
      title: 'Search',
      description: 'Find specific items',
      icon: 'search',
      action: () => console.log('Open search')
    }
  ];

  const mockNearbyEstablishments = [
    {
      id: '1',
      name: 'The Sober Parrot',
      address: '123 Main St, Anytown',
      distance: '0.5 miles',
      image_url: '/images/establishments/sober-parrot.jpg'
    },
    {
      id: '2',
      name: 'Mocktail Lounge',
      address: '456 Oak Ave, Anytown',
      distance: '1.2 miles',
      image_url: '/images/establishments/mocktail-lounge.jpg'
    },
    {
      id: '3',
      name: 'Zero Proof Bar',
      address: '789 Pine Rd, Anytown',
      distance: '2.0 miles',
      image_url: '/images/establishments/zero-proof.jpg'
    }
  ];

  const mockUpcomingEvents: UpcomingEvent[] = [
    {
      id: '1',
      title: 'Mocktail Masterclass',
      type: 'Workshop',
      date: 'Sat, Jun 15, 2:00 PM',
      location: 'The Sober Parrot'
    },
    {
      id: '2',
      title: 'Sober Social Mixer',
      type: 'Social',
      date: 'Fri, Jun 21, 7:00 PM',
      location: 'Community Center'
    },
    {
      id: '3',
      title: 'Alcohol-Free Festival',
      type: 'Festival',
      date: 'Sat-Sun, Jul 2-3',
      location: 'City Park'
    }
  ];

  const mockAchievements: Achievement[] = [
    {
      id: '1',
      name: 'Establishment Explorer',
      description: 'Visit 5 different establishments',
      category: 'exploration',
      progress: 3,
      total: 5,
      target: 5,
      pointsReward: 100,
      icon: 'map-pin',
      urgency: 'medium',
      suggestion: 'Visit 2 more establishments',
      estimatedCompletion: '3 days'
    },
    {
      id: '2',
      name: 'Review Master',
      description: 'Write 10 reviews',
      category: 'engagement',
      progress: 7,
      total: 10,
      target: 10,
      pointsReward: 150,
      icon: 'star',
      urgency: 'high',
      suggestion: 'Write 3 more reviews',
      estimatedCompletion: '1 week'
    },
    {
      id: '3',
      name: 'Social Butterfly',
      description: 'Share 5 mocktails on social media',
      category: 'social',
      progress: 2,
      total: 5,
      target: 5,
      pointsReward: 75,
      icon: 'share',
      urgency: 'low',
      suggestion: 'Share 3 more mocktails',
      estimatedCompletion: '2 weeks'
    }
  ];

  const mockTrendingMocktails: TrendingMocktail[] = [
    {
      id: '1',
      name: 'Virgin Mojito',
      description: 'Fresh mint, lime, and soda water',
      popularity: 95,
      image: '/images/mocktails/virgin-mojito.jpg',
      establishmentName: 'The Sober Parrot'
    },
    {
      id: '2',
      name: 'Berry Blast',
      description: 'Mixed berries with a hint of basil',
      popularity: 87,
      image: '/images/mocktails/berry-blast.jpg',
      establishmentName: 'Mocktail Lounge'
    },
    {
      id: '3',
      name: 'Cucumber Cooler',
      description: 'Refreshing cucumber and mint',
      popularity: 82,
      image: '/images/mocktails/cucumber-cooler.jpg',
      establishmentName: 'Zero Proof Bar'
    }
  ];

  return {
    loading,
    userStats: mockUserStats,
    recentActivity: mockRecentActivity,
    recommendations: mockRecommendations,
    quickActions: mockQuickActions,
    nearbyEstablishments: mockNearbyEstablishments,
    upcomingEvents: mockUpcomingEvents,
    achievements: mockAchievements,
    trendingMocktails: mockTrendingMocktails,
    isAuthenticated: !!user
  };
};
