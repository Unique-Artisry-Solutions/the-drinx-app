
import { useState, useEffect } from 'react';
import useDevAuthBypass from '@/hooks/useDevAuthBypass';
import { sampleEstablishments, sampleCocktails } from '@/data/sampleData';

export interface UserStats {
  totalVisits: number;
  favoriteEstablishments: number;
  reviewsWritten: number;
  averageRating: number;
  currentPoints: number;
  lifetimePoints: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastVisitDate: string;
  streakMultiplier: number;
  streakTarget: number;
  isStreakActive: boolean;
  daysUntilStreakBreak: number;
}

export interface AchievementProgress {
  id: string;
  name: string;
  description: string;
  category: 'visits' | 'mocktails' | 'social' | 'special';
  current: number;
  total: number;
  progress: number;
  pointsReward: number;
  isCompleted: boolean;
  isNearCompletion: boolean;
}

export interface TierStatus {
  currentTier: {
    id: string;
    name: string;
    color: string;
    icon: string;
    minimumPoints: number;
  };
  nextTier: {
    id: string;
    name: string;
    color: string;
    icon: string;
    minimumPoints: number;
  } | null;
  progress: number;
  pointsToNext: number;
  benefits: string[];
}

export interface PointsOpportunity {
  id: string;
  type: 'visit' | 'review' | 'checkin' | 'social' | 'challenge';
  title: string;
  description: string;
  potentialPoints: number;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  actionRequired: string;
  multiplier?: number;
}

export interface RecentActivity {
  id: string;
  type: 'visit' | 'review' | 'favorite' | 'achievement' | 'streak';
  establishment: string;
  timestamp: string;
  details?: string;
  pointsEarned?: number;
}

export interface PersonalizedRecommendation {
  id: string;
  name: string;
  type: 'cocktail' | 'establishment';
  reason: string;
  image?: string;
  rating?: number;
  distance?: string;
  potentialPoints?: number;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
  pointsAvailable?: number;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
  bonusPoints?: number;
}

export const usePersonalizedData = () => {
  const { user, isAuthenticated } = useDevAuthBypass();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [achievementProgress, setAchievementProgress] = useState<AchievementProgress[]>([]);
  const [tierStatus, setTierStatus] = useState<TierStatus | null>(null);
  const [pointsOpportunities, setPointsOpportunities] = useState<PointsOpportunity[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [nearbyEstablishments, setNearbyEstablishments] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);

  useEffect(() => {
    const loadPersonalizedData = async () => {
      setLoading(true);
      
      if (isAuthenticated && user) {
        // Enhanced user stats with points
        setUserStats({
          totalVisits: 12,
          favoriteEstablishments: 5,
          reviewsWritten: 8,
          averageRating: 4.2,
          currentPoints: 1250,
          lifetimePoints: 2400
        });

        // Streak tracking data
        setStreakData({
          currentStreak: 5,
          longestStreak: 12,
          lastVisitDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          streakMultiplier: 1.5,
          streakTarget: 7,
          isStreakActive: true,
          daysUntilStreakBreak: 2
        });

        // Achievement progress tracking
        setAchievementProgress([
          {
            id: 'social-butterfly',
            name: 'Social Butterfly',
            description: 'Visit 10 different establishments',
            category: 'visits',
            current: 8,
            total: 10,
            progress: 80,
            pointsReward: 100,
            isCompleted: false,
            isNearCompletion: true
          },
          {
            id: 'mocktail-master',
            name: 'Mocktail Master',
            description: 'Try 25 different mocktails',
            category: 'mocktails',
            current: 18,
            total: 25,
            progress: 72,
            pointsReward: 150,
            isCompleted: false,
            isNearCompletion: false
          },
          {
            id: 'reviewer',
            name: 'Helpful Reviewer',
            description: 'Write 15 establishment reviews',
            category: 'social',
            current: 8,
            total: 15,
            progress: 53,
            pointsReward: 75,
            isCompleted: false,
            isNearCompletion: false
          },
          {
            id: 'streak-warrior',
            name: 'Streak Warrior',
            description: 'Maintain a 7-day visit streak',
            category: 'special',
            current: 5,
            total: 7,
            progress: 71,
            pointsReward: 200,
            isCompleted: false,
            isNearCompletion: true
          }
        ]);

        // Tier status and progress
        setTierStatus({
          currentTier: {
            id: 'silver',
            name: 'Silver Explorer',
            color: '#C0C0C0',
            icon: 'award',
            minimumPoints: 1000
          },
          nextTier: {
            id: 'gold',
            name: 'Gold Adventurer',
            color: '#FFD700',
            icon: 'crown',
            minimumPoints: 2000
          },
          progress: 33,
          pointsToNext: 750,
          benefits: [
            '20% bonus points on reviews',
            'Priority event notifications',
            'Exclusive mocktail recipes'
          ]
        });

        // Points earning opportunities
        setPointsOpportunities([
          {
            id: 'visit-new',
            type: 'visit',
            title: 'Visit a New Establishment',
            description: 'Discover and check in to an establishment you haven\'t visited before',
            potentialPoints: 50,
            difficulty: 'easy',
            estimatedTime: '30 minutes',
            actionRequired: 'Check in at a new location',
            multiplier: 1.5
          },
          {
            id: 'write-review',
            type: 'review',
            title: 'Write a Detailed Review',
            description: 'Share your experience with a thorough review',
            potentialPoints: 30,
            difficulty: 'medium',
            estimatedTime: '10 minutes',
            actionRequired: 'Write and submit a review'
          },
          {
            id: 'daily-checkin',
            type: 'checkin',
            title: 'Complete Daily Check-in',
            description: 'Maintain your streak with today\'s check-in',
            potentialPoints: 25,
            difficulty: 'easy',
            estimatedTime: '5 minutes',
            actionRequired: 'Check in at any establishment',
            multiplier: 1.5
          },
          {
            id: 'share-experience',
            type: 'social',
            title: 'Share Your Experience',
            description: 'Share a mocktail or establishment on social media',
            potentialPoints: 20,
            difficulty: 'easy',
            estimatedTime: '2 minutes',
            actionRequired: 'Share content with app link'
          }
        ]);

        // Enhanced recent activity with points
        setRecentActivity([
          {
            id: '1',
            type: 'visit',
            establishment: 'The Gin Garden',
            timestamp: '2 hours ago',
            details: 'Checked in for happy hour',
            pointsEarned: 25
          },
          {
            id: '2',
            type: 'achievement',
            establishment: 'System',
            timestamp: '1 day ago',
            details: 'Unlocked "Flavor Explorer" achievement',
            pointsEarned: 100
          },
          {
            id: '3',
            type: 'review',
            establishment: 'Mocktail Lounge',
            timestamp: '1 day ago',
            details: 'Left a 5-star review',
            pointsEarned: 30
          },
          {
            id: '4',
            type: 'streak',
            establishment: 'System',
            timestamp: '2 days ago',
            details: 'Extended streak to 5 days',
            pointsEarned: 15
          }
        ]);

        // Enhanced recommendations with points
        setRecommendations([
          {
            id: '1',
            name: 'Virgin Mojito Supreme',
            type: 'cocktail',
            reason: 'Based on your love of mint drinks',
            rating: 4.8,
            potentialPoints: 35
          },
          {
            id: '2',
            name: 'The Botanical Bar',
            type: 'establishment',
            reason: 'Similar to your favorites',
            distance: '0.5 miles',
            potentialPoints: 50
          }
        ]);
      } else {
        // Guest user - show generic recommendations
        setRecommendations([
          {
            id: '1',
            name: 'Popular Mocktails',
            type: 'cocktail',
            reason: 'Trending in your area',
            potentialPoints: 25
          },
          {
            id: '2',
            name: 'Nearby Establishments',
            type: 'establishment',
            reason: 'Highly rated venues',
            potentialPoints: 40
          }
        ]);
      }

      // Enhanced quick actions with points
      setQuickActions([
        {
          id: '1',
          title: 'Find Nearby',
          description: 'Discover establishments near you',
          icon: 'map-pin',
          action: () => console.log('Navigate to map'),
          pointsAvailable: 50
        },
        {
          id: '2',
          title: 'Browse Cocktails',
          description: 'Explore mocktail recipes',
          icon: 'glass-water',
          action: () => console.log('Browse cocktails'),
          pointsAvailable: 25
        },
        {
          id: '3',
          title: 'Write Review',
          description: 'Share your latest experience',
          icon: 'star',
          action: () => console.log('Write review'),
          pointsAvailable: 30
        }
      ]);

      // Nearby establishments using sample data
      const nearby = sampleEstablishments.slice(0, 3).map(est => ({
        ...est,
        image_url: est.image || '/placeholder-establishment.jpg',
        distance: `${(Math.random() * 2 + 0.1).toFixed(1)} miles`
      }));
      setNearbyEstablishments(nearby);

      // Enhanced upcoming events with bonus points
      setUpcomingEvents([
        {
          id: '1',
          title: 'Mocktail Monday',
          date: 'Tonight 6-9 PM',
          location: 'The Gin Garden',
          type: 'Happy Hour',
          bonusPoints: 25
        },
        {
          id: '2',
          title: 'Swig Circuit',
          date: 'This Weekend',
          location: 'Downtown District',
          type: 'Bar Crawl',
          bonusPoints: 100
        }
      ]);

      setLoading(false);
    };

    loadPersonalizedData();
  }, [user, isAuthenticated]);

  return {
    loading,
    userStats,
    streakData,
    achievementProgress,
    tierStatus,
    pointsOpportunities,
    recentActivity,
    recommendations,
    quickActions,
    nearbyEstablishments,
    upcomingEvents,
    isAuthenticated
  };
};
