
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNearbyCheckIns } from '@/hooks/useNearbyCheckIns';
import type { 
  PersonalizedDataReturn, 
  QuickStats, 
  ActivityItem, 
  NearbyEstablishment, 
  UpcomingEvent, 
  QuickAction,
  UserStats,
  Recommendation
} from '@/types/explore';

export const usePersonalizedData = (): PersonalizedDataReturn => {
  const navigate = useNavigate();
  const { openModal: openNearbyCheckInModal } = useNearbyCheckIns();
  
  const [loading, setLoading] = useState(false);
  const [isAuthenticated] = useState(true); // This would come from auth context in real app
  
  const [quickStats, setQuickStats] = useState<QuickStats>({
    totalMocktailsTried: 15,
    totalPoints: 450,
    currentStreak: 7
  });

  const userStats: UserStats = {
    totalMocktailsTried: quickStats.totalMocktailsTried,
    totalPoints: quickStats.totalPoints,
    currentStreak: quickStats.currentStreak,
    establishmentsVisited: 8,
    favoriteEstablishments: 3
  };

  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'check-in',
      title: 'Checked in at The Tipsy Alchemist',
      description: 'Enjoying a fantastic evening with friends.',
      timestamp: '2024-04-28T19:20:30Z',
      location: 'New York, NY',
      user: { id: '101', name: 'Alice', avatar: '/alice-avatar.jpg' },
      likes: 22,
      isLiked: true,
      imageUrl: '/alchemist-mocktail.jpg'
    },
    {
      id: '2',
      type: 'review',
      title: 'Reviewed Sober Social Club',
      description: 'Gave a 5-star rating for their amazing atmosphere.',
      timestamp: '2024-04-27T14:35:00Z',
      user: { id: '102', name: 'Bob', avatar: '/bob-avatar.jpg' },
      likes: 15,
      isLiked: false
    },
    {
      id: '3',
      type: 'recipe',
      title: 'Shared a new recipe: Berry Bliss',
      description: 'A refreshing mix of berries and sparkling water.',
      timestamp: '2024-04-26T11:10:45Z',
      user: { id: '103', name: 'Charlie', avatar: '/charlie-avatar.jpg' },
      likes: 35,
      isLiked: true,
      imageUrl: '/berry-bliss-mocktail.jpg'
    }
  ]);

  const [nearbyEstablishments, setNearbyEstablishments] = useState<NearbyEstablishment[]>([
    {
      id: '1',
      name: 'The Mocktail Lounge',
      description: 'Creative non-alcoholic cocktails',
      distance: '0.3 miles',
      rating: 4.8,
      isOpen: true,
      imageUrl: '/mocktail-lounge.jpg'
    },
    {
      id: '2',
      name: 'Sober Social Club',
      description: 'Community-focused sober bar',
      distance: '0.7 miles',
      rating: 4.5,
      isOpen: true,
      imageUrl: '/sober-social-club.jpg'
    },
    {
      id: '3',
      name: 'Zero Proof Kitchen',
      description: 'Farm-to-table mocktails',
      distance: '1.2 miles',
      rating: 4.6,
      isOpen: false,
      imageUrl: '/zero-proof-kitchen.jpg'
    }
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([
    {
      id: '1',
      title: 'Sober Summer Fest',
      description: 'A celebration of alcohol-free living with music, food, and community',
      date: '2024-06-15',
      time: '2:00 PM',
      location: 'Central Park, NY',
      attendees: 150,
      imageUrl: '/summer-fest.jpg'
    },
    {
      id: '2',
      title: 'Mocktail Mixology Workshop',
      description: 'Learn the art of crafting perfect non-alcoholic cocktails',
      date: '2024-05-20',
      time: '7:00 PM',
      location: 'Online',
      attendees: 45,
      imageUrl: '/mixology-workshop.jpg'
    }
  ]);

  const recommendations: Recommendation[] = [
    {
      id: '1',
      type: 'establishment',
      title: 'The Dry Bar',
      description: 'Highly rated establishment near you',
      reason: 'Based on your recent check-ins',
      rating: 4.7,
      distance: '0.5 miles'
    },
    {
      id: '2',
      type: 'event',
      title: 'Sober Trivia Night',
      description: 'Weekly community event',
      reason: 'You enjoy social activities',
      date: '2024-05-18',
      time: '8:00 PM',
      attendees: 25
    }
  ];

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Check In Nearby',
      description: 'Find venues and earn points',
      iconName: 'MapPin',
      color: 'bg-blue-500',
      isEnabled: true,
      onClick: openNearbyCheckInModal
    },
    {
      id: '2',
      title: 'Create Recipe',
      description: 'Share your mocktail creation',
      iconName: 'Plus',
      color: 'bg-green-500',
      isEnabled: true,
      onClick: () => navigate('/create-recipe')
    },
    {
      id: '3',
      title: 'Find Events',
      description: 'Discover sober events near you',
      iconName: 'Search',
      color: 'bg-purple-500',
      isEnabled: true,
      onClick: () => navigate('/events')
    }
  ];

  return {
    quickStats,
    activities,
    nearbyEstablishments,
    upcomingEvents,
    quickActions,
    loading,
    userStats,
    isAuthenticated,
    recentActivity: activities,
    recommendations
  };
};

// Export types for backward compatibility
export type { 
  QuickStats, 
  ActivityItem, 
  NearbyEstablishment, 
  UpcomingEvent, 
  QuickAction,
  UserStats,
  Recommendation
} from '@/types/explore';
