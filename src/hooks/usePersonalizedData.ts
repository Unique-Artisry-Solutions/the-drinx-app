import { useState, useEffect } from 'react';
import { useDevAuthBypass } from '@/hooks/useDevAuthBypass';
import { Activity, QuickAction } from '@/types/explore';
import { Recommendation } from '@/types/explore/recommendations';
import { useNavigate } from 'react-router-dom';

// Updated interfaces to match component expectations
interface QuickActionData extends QuickAction {
  // This now extends the main QuickAction type
}

interface ActivityItem extends Activity {
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  likes: number;
  isLiked: boolean;
  imageUrl?: string;
  metadata?: Record<string, any>;
}

export interface UserStats {
  totalMocktailsTried: number;
  totalPoints: number;
  currentStreak: number;
  establishmentsVisited: number;
  favoriteEstablishments: number;
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
  promoter_username?: string;
  promoter_id?: string;
}

export const usePersonalizedData = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useDevAuthBypass();
  const [loading, setLoading] = useState(true);

  // Mock data with updated structure
  const mockUserStats: UserStats = {
    totalMocktailsTried: 23,
    totalPoints: 1250,
    currentStreak: 7,
    establishmentsVisited: 12,
    favoriteEstablishments: 5
  };

  const mockQuickActions = [
    {
      id: '1',
      title: 'Check In Nearby',
      description: 'Find and check into nearby establishments',
      iconName: 'MapPin',
      color: 'bg-blue-500',
      isEnabled: true,
      onClick: () => console.log('Check in nearby')
    },
    {
      id: '2',
      title: 'Create Recipe',
      description: 'Share your mocktail creation',
      iconName: 'Plus',
      color: 'bg-green-500',
      isEnabled: true,
      onClick: () => navigate('/profile/recipes')
    },
    {
      id: '3',
      title: 'Find Events',
      description: 'Discover sober events near you',
      iconName: 'Search',
      color: 'bg-purple-500',
      isEnabled: true,
      onClick: () => console.log('Find events')
    }
  ];

  const mockRecentActivity: ActivityItem[] = [
    {
      id: '1',
      type: 'check-in',
      title: 'Checked into The Sober Lounge',
      description: 'Great atmosphere and amazing mocktails!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      location: 'Downtown',
      user: {
        id: 'user1',
        name: 'You',
        avatar: '/placeholder.svg'
      },
      likes: 5,
      isLiked: false,
      imageUrl: '/placeholder.svg'
    },
    {
      id: '2',
      type: 'recipe',
      title: 'Created Virgin Mojito Supreme',
      description: 'Fresh mint, lime, and a secret ingredient',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      user: {
        id: 'user1',
        name: 'You',
        avatar: '/placeholder.svg'
      },
      likes: 12,
      isLiked: true,
      imageUrl: '/placeholder.svg'
    }
  ];

  const mockRecommendations: Recommendation[] = [
    {
      id: '1',
      title: 'The Mindful Bar',
      description: 'Award-winning mocktails in a cozy atmosphere',
      type: 'establishment',
      rating: 4.8,
      distance: '0.3 miles',
      reason: 'Based on your recent check-ins'
    },
    {
      id: '2',
      title: 'Lavender Lemonade',
      description: 'Refreshing summer drink with floral notes',
      type: 'cocktail',
      rating: 4.6,
      reason: 'Popular with users like you'
    }
  ];

  const mockNearbyEstablishments: NearbyEstablishment[] = [
    {
      id: '1',
      name: 'Zero Proof',
      description: 'Craft mocktails and alcohol-free wines',
      distance: '0.2 miles',
      rating: 4.7,
      isOpen: true,
      imageUrl: '/placeholder.svg'
    },
    {
      id: '2',
      name: 'Sober Social',
      description: 'Community space for sober socializing',
      distance: '0.5 miles',
      rating: 4.5,
      isOpen: true,
      imageUrl: '/placeholder.svg'
    }
  ];

  const mockUpcomingEvents: UpcomingEvent[] = [
    {
      id: '1',
      title: 'Mocktail Making Workshop',
      description: 'Learn to craft professional-level mocktails',
      date: 'Tomorrow',
      time: '7:00 PM',
      location: 'The Sober Lounge',
      attendees: 24,
      imageUrl: '/placeholder.svg',
      promoter_username: 'mixology_maven',
      promoter_id: 'promoter_1'
    },
    {
      id: '2',
      title: 'Sober Speed Networking',
      description: 'Meet like-minded professionals in recovery',
      date: 'This Weekend',
      time: '6:00 PM',
      location: 'Downtown Community Center',
      attendees: 18,
      imageUrl: '/placeholder.svg',
      promoter_username: 'sober_social_host',
      promoter_id: 'promoter_2'
    }
  ];

  // New user fallback data
  const newUserFallbackStats: UserStats = {
    totalMocktailsTried: 0,
    totalPoints: 0,
    currentStreak: 0,
    establishmentsVisited: 0,
    favoriteEstablishments: 0
  };

  const newUserGettingStartedActions = [
    {
      id: 'getting-started-1',
      title: 'Check In Nearby',
      description: 'Find sober-friendly venues and start earning points',
      iconName: 'MapPin',
      color: 'bg-blue-500',
      isEnabled: true,
      onClick: () => console.log('Check in nearby - getting started')
    },
    {
      id: 'getting-started-2',
      title: 'Create Recipe',
      description: 'Share your first mocktail recipe with the community',
      iconName: 'Plus',
      color: 'bg-green-500',
      isEnabled: true,
      onClick: () => navigate('/profile/recipes')
    },
    {
      id: 'getting-started-3',
      title: 'Follow Promoters',
      description: 'Stay updated on sober events and activities',
      iconName: 'UserPlus',
      color: 'bg-purple-500',
      isEnabled: true,
      onClick: () => console.log('Follow promoters - getting started')
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Check if user appears to be new (no activity)
  const isNewUser = mockUserStats.totalMocktailsTried === 0 && 
                   mockUserStats.totalPoints === 0 && 
                   mockUserStats.currentStreak === 0;

  return {
    loading,
    isAuthenticated,
    userStats: isNewUser ? newUserFallbackStats : mockUserStats,
    recentActivity: isNewUser ? [] : mockRecentActivity,
    recommendations: isNewUser ? [] : mockRecommendations,
    quickActions: isNewUser ? newUserGettingStartedActions : mockQuickActions,
    nearbyEstablishments: mockNearbyEstablishments, // Always show nearby places
    upcomingEvents: mockUpcomingEvents // Always show events
  };
};
