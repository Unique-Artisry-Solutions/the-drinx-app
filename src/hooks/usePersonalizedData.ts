import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNearbyCheckIns } from '@/hooks/useNearbyCheckIns';

export interface QuickStats {
  totalMocktailsTried: number;
  totalPoints: number;
  currentStreak: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  location?: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  likes: number;
  isLiked: boolean;
  imageUrl?: string;
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
  date: string;
  location: string;
  imageUrl?: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  iconName: string; // Changed from icon: React.ReactNode to iconName: string
  color: string;
  isEnabled: boolean;
  requiresAuth?: boolean;
  badge?: string;
  shortcut?: string;
  recentlyUsed?: boolean;
  onClick: () => void | Promise<void>;
}

export const usePersonalizedData = () => {
  const navigate = useNavigate();
  const { openModal: openNearbyCheckInModal } = useNearbyCheckIns();
  
  const [quickStats, setQuickStats] = useState<QuickStats>({
    totalMocktailsTried: 15,
    totalPoints: 450,
    currentStreak: 7
  });

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
      date: '2024-06-15',
      location: 'Central Park, NY',
      imageUrl: '/summer-fest.jpg'
    },
    {
      id: '2',
      title: 'Mocktail Mixology Workshop',
      date: '2024-05-20',
      location: 'Online',
      imageUrl: '/mixology-workshop.jpg'
    }
  ]);

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
    quickActions
  };
};
