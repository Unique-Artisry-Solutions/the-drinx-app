import { useState, useEffect } from 'react';
import useDevAuthBypass from '@/hooks/useDevAuthBypass';
import { sampleEstablishments, sampleCocktails } from '@/data/sampleData';

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
  timestamp: string;
  details?: string;
}

export interface PersonalizedRecommendation {
  id: string;
  name: string;
  type: 'cocktail' | 'establishment';
  reason: string;
  image?: string;
  rating?: number;
  distance?: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
}

export const usePersonalizedData = () => {
  const { user, isAuthenticated } = useDevAuthBypass();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [nearbyEstablishments, setNearbyEstablishments] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);

  useEffect(() => {
    const loadPersonalizedData = async () => {
      setLoading(true);
      
      if (isAuthenticated && user) {
        // Mock user stats
        setUserStats({
          totalVisits: 12,
          favoriteEstablishments: 5,
          reviewsWritten: 8,
          averageRating: 4.2
        });

        // Mock recent activity
        setRecentActivity([
          {
            id: '1',
            type: 'visit',
            establishment: 'The Gin Garden',
            timestamp: '2 hours ago',
            details: 'Checked in for happy hour'
          },
          {
            id: '2',
            type: 'review',
            establishment: 'Mocktail Lounge',
            timestamp: '1 day ago',
            details: 'Left a 5-star review'
          },
          {
            id: '3',
            type: 'favorite',
            establishment: 'Zero Proof Bar',
            timestamp: '3 days ago'
          }
        ]);

        // Mock personalized recommendations
        setRecommendations([
          {
            id: '1',
            name: 'Virgin Mojito Supreme',
            type: 'cocktail',
            reason: 'Based on your love of mint drinks',
            rating: 4.8
          },
          {
            id: '2',
            name: 'The Botanical Bar',
            type: 'establishment',
            reason: 'Similar to your favorites',
            distance: '0.5 miles'
          }
        ]);
      } else {
        // Guest user - show generic recommendations
        setRecommendations([
          {
            id: '1',
            name: 'Popular Mocktails',
            type: 'cocktail',
            reason: 'Trending in your area'
          },
          {
            id: '2',
            name: 'Nearby Establishments',
            type: 'establishment',
            reason: 'Highly rated venues'
          }
        ]);
      }

      // Quick actions available to all users
      setQuickActions([
        {
          id: '1',
          title: 'Find Nearby',
          description: 'Discover establishments near you',
          icon: 'map-pin',
          action: () => console.log('Navigate to map')
        },
        {
          id: '2',
          title: 'Browse Cocktails',
          description: 'Explore mocktail recipes',
          icon: 'glass-water',
          action: () => console.log('Browse cocktails')
        }
      ]);

      // Nearby establishments using sample data
      const nearby = sampleEstablishments.slice(0, 3).map(est => ({
        ...est,
        image_url: est.image || '/placeholder-establishment.jpg',
        distance: `${(Math.random() * 2 + 0.1).toFixed(1)} miles`
      }));
      setNearbyEstablishments(nearby);

      // Mock upcoming events
      setUpcomingEvents([
        {
          id: '1',
          title: 'Mocktail Monday',
          date: 'Tonight 6-9 PM',
          location: 'The Gin Garden',
          type: 'Happy Hour'
        },
        {
          id: '2',
          title: 'Swig Circuit',
          date: 'This Weekend',
          location: 'Downtown District',
          type: 'Bar Crawl'
        }
      ]);

      setLoading(false);
    };

    loadPersonalizedData();
  }, [user, isAuthenticated]);

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
