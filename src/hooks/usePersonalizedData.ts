
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useUserLocation } from '@/hooks/useUserLocation';
import { sampleEstablishments, sampleCocktails } from '@/data/sampleData';

interface UserStats {
  establishmentsVisited: number;
  cocktailsTried: number;
  currentStreak: number;
  totalPoints: number;
}

interface RecentActivity {
  id: string;
  type: 'visit' | 'cocktail' | 'achievement' | 'review';
  title: string;
  description: string;
  timestamp: Date;
  icon?: string;
}

interface Recommendation {
  id: string;
  type: 'establishment' | 'cocktail' | 'event';
  title: string;
  description: string;
  image?: string;
  rating?: number;
  distance?: string;
  reason: string;
}

export function usePersonalizedData() {
  const { user } = useAuth();
  const { userLocation } = useUserLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats>({
    establishmentsVisited: 0,
    cocktailsTried: 0,
    currentStreak: 0,
    totalPoints: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [nearbyEstablishments, setNearbyEstablishments] = useState(sampleEstablishments.slice(0, 3));
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadPersonalizedData();
    } else {
      setIsLoading(false);
    }
  }, [user, userLocation]);

  const loadPersonalizedData = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API calls - in real app, these would be actual API calls
      await Promise.all([
        loadUserStats(),
        loadRecentActivity(),
        loadRecommendations(),
        loadUpcomingEvents()
      ]);
    } catch (error) {
      console.error('Error loading personalized data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserStats = async () => {
    // Mock data - would come from API
    const stats = {
      establishmentsVisited: Math.floor(Math.random() * 25) + 5,
      cocktailsTried: Math.floor(Math.random() * 50) + 10,
      currentStreak: Math.floor(Math.random() * 7) + 1,
      totalPoints: Math.floor(Math.random() * 1000) + 250
    };
    setUserStats(stats);
  };

  const loadRecentActivity = async () => {
    const activities: RecentActivity[] = [
      {
        id: '1',
        type: 'visit',
        title: 'Visited The Mocktail Lab',
        description: 'Tried their signature elderflower fizz',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        icon: '📍'
      },
      {
        id: '2',
        type: 'achievement',
        title: 'Explorer Badge Earned',
        description: 'Visited 10 different establishments',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        icon: '🏆'
      },
      {
        id: '3',
        type: 'cocktail',
        title: 'Favorited Cucumber Mint Cooler',
        description: 'From Green Garden Drinks',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        icon: '❤️'
      }
    ];
    setRecentActivity(activities);
  };

  const loadRecommendations = async () => {
    const recs: Recommendation[] = [
      {
        id: '1',
        type: 'establishment',
        title: 'The Botanical Bar',
        description: 'Known for their craft mocktails with fresh herbs',
        image: sampleEstablishments[0].image_url,
        rating: 4.8,
        distance: '0.8 mi',
        reason: 'Based on your recent herb-infused drink preferences'
      },
      {
        id: '2',
        type: 'cocktail',
        title: 'Lavender Lemon Spritz',
        description: 'A refreshing floral mocktail perfect for evening',
        image: sampleCocktails[0].image,
        rating: 4.6,
        reason: 'Popular among users with similar taste profiles'
      },
      {
        id: '3',
        type: 'event',
        title: 'Weekend Mocktail Workshop',
        description: 'Learn to craft professional mocktails at home',
        reason: 'Based on your interest in cocktail recipes'
      }
    ];
    setRecommendations(recs);
  };

  const loadUpcomingEvents = async () => {
    const events = [
      {
        id: '1',
        name: 'Happy Hour Specials',
        venue: 'The Mocktail Lab',
        date: 'Today, 5-7 PM',
        description: '50% off all signature mocktails'
      },
      {
        id: '2',
        name: 'Swig Circuit: Downtown Tour',
        venue: 'Multiple Venues',
        date: 'This Saturday',
        description: 'Guided tour of 4 top mocktail spots'
      }
    ];
    setUpcomingEvents(events);
  };

  return {
    userStats,
    recentActivity,
    recommendations,
    nearbyEstablishments,
    upcomingEvents,
    isLoading,
    refreshData: loadPersonalizedData
  };
}
