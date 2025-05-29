import { useState, useEffect } from 'react';
import { MapPin, Calendar, PlusCircle, Route, Share2, Users } from 'lucide-react';

export interface UserStats {
  totalMocktailsTried: number;
  totalPoints: number;
  currentStreak: number;
  establishmentsVisited: number;
  favoriteEstablishments: number;
}

export interface Activity {
  id: string;
  type: 'check-in' | 'review' | 'recipe' | 'achievement' | 'bar-crawl' | 'photo-share';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  location?: string;
  likes: number;
  isLiked: boolean;
  imageUrl?: string;
}

export interface Recommendation {
  id: string;
  type: 'establishment' | 'cocktail' | 'event';
  title: string;
  description: string;
  reason: string;
  rating?: number;
  distance?: string;
  imageUrl?: string;
  tags: string[];
  isSaved: boolean;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  isEnabled: boolean;
  badge?: string;
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
  const [loading, setLoading] = useState(true);
  const [isAuthenticated] = useState(false); // Mock authentication state
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [nearbyEstablishments, setNearbyEstablishments] = useState<NearbyEstablishment[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user stats for authenticated users
      if (isAuthenticated) {
        setUserStats({
          totalMocktailsTried: 42,
          totalPoints: 1250,
          currentStreak: 7,
          establishmentsVisited: 15,
          favoriteEstablishments: 5
        });
      }

      // Mock recent activity data
      setRecentActivity([
        {
          id: '1',
          type: 'check-in',
          title: 'Checked in at The Mocktail Lounge',
          description: 'Tried the signature Virgin Mojito',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          user: 'You',
          location: 'Downtown',
          likes: 5,
          isLiked: true,
          imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop'
        },
        {
          id: '2',
          type: 'recipe',
          title: 'Created new recipe: Tropical Sunset',
          description: 'A refreshing blend of pineapple, orange, and cranberry',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          user: 'You',
          likes: 12,
          isLiked: false
        },
        {
          id: '3',
          type: 'achievement',
          title: 'Earned "Explorer" badge',
          description: 'Visited 10 different establishments',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          user: 'You',
          likes: 8,
          isLiked: true
        }
      ]);

      // Mock recommendations
      setRecommendations([
        {
          id: '1',
          type: 'establishment',
          title: 'Zero Proof Bar',
          description: 'New mocktail bar with craft non-alcoholic spirits',
          reason: 'Based on your love for craft cocktails',
          rating: 4.8,
          distance: '0.5 miles',
          imageUrl: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?w=400&h=300&fit=crop',
          tags: ['Craft', 'Upscale', 'New'],
          isSaved: false
        },
        {
          id: '2',
          type: 'cocktail',
          title: 'Lavender Lemon Spritz',
          description: 'Refreshing lavender-infused mocktail with a citrus twist',
          reason: 'Perfect for your taste preferences',
          rating: 4.6,
          imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop',
          tags: ['Floral', 'Citrus', 'Light'],
          isSaved: true
        }
      ]);

      // Mock quick actions with proper icon creation
      const createQuickActions = () => [
        {
          id: 'check-in',
          title: 'Check In Nearby',
          description: 'Find and check into establishments around you',
          icon: MapPin,
          color: 'bg-blue-500',
          isEnabled: true,
          onClick: () => console.log('Check in nearby')
        },
        {
          id: 'find-events',
          title: 'Find Events',
          description: 'Discover upcoming mocktail events',
          icon: Calendar,
          color: 'bg-green-500',
          isEnabled: true,
          onClick: () => console.log('Find events')
        },
        {
          id: 'create-recipe',
          title: 'Create Recipe',
          description: 'Share your mocktail creation',
          icon: PlusCircle,
          color: 'bg-purple-500',
          isEnabled: true,
          onClick: () => console.log('Create recipe')
        },
        {
          id: 'start-crawl',
          title: 'Start Bar Crawl',
          description: 'Plan your next adventure',
          icon: Route,
          color: 'bg-orange-500',
          isEnabled: true,
          badge: 'Popular',
          onClick: () => console.log('Start bar crawl')
        },
        {
          id: 'share-achievement',
          title: 'Share Achievement',
          description: 'Show off your latest milestone',
          icon: Share2,
          color: 'bg-pink-500',
          isEnabled: true,
          onClick: () => console.log('Share achievement')
        },
        {
          id: 'find-friends',
          title: 'Find Friends',
          description: 'Connect with other mocktail enthusiasts',
          icon: Users,
          color: 'bg-cyan-500',
          isEnabled: true,
          onClick: () => console.log('Find friends')
        }
      ];

      setQuickActions(createQuickActions());

      // Mock nearby establishments
      setNearbyEstablishments([
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
      ]);

      // Mock upcoming events
      setUpcomingEvents([
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
      ]);

      setLoading(false);
    };

    loadData();
  }, [isAuthenticated]);

  return {
    loading,
    userStats,
    recentActivity,
    recommendations,
    quickActions,
    nearbyEstablishments,
    upcomingEvents,
    isAuthenticated
  };
};
