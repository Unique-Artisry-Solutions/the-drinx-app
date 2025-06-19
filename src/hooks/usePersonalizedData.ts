import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { Recommendation } from '@/types/explore/recommendations';

export interface ActivityItem {
  id: string;
  type: 'check_in' | 'mocktail_tried' | 'achievement';
  title: string;
  description: string;
  timestamp: string;
  points: number;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
}

export interface NearbyEstablishment {
  id: string;
  name: string;
  description: string;
  distance: string;
  rating: number;
  isOpen: boolean;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  attendees: number;
  location: string;
}

export interface PersonalizedDataState {
  loading: boolean;
  isAuthenticated: boolean;
  userStats: {
    totalMocktailsTried: number;
    totalPoints: number;
    currentStreak: number;
  };
  recentActivity: ActivityItem[];
  recommendations: Recommendation[];
  quickActions: QuickAction[];
  nearbyEstablishments: NearbyEstablishment[];
  upcomingEvents: UpcomingEvent[];
}

export const usePersonalizedData = (): PersonalizedDataState => {
  const { isAuthenticated, isLoading } = useAuth();
  const [personalizedData, setPersonalizedData] = useState<Omit<PersonalizedDataState, 'loading' | 'isAuthenticated'>>({
    userStats: {
      totalMocktailsTried: 0,
      totalPoints: 0,
      currentStreak: 0
    },
    recentActivity: [],
    recommendations: [],
    quickActions: [],
    nearbyEstablishments: [],
    upcomingEvents: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Simulate loading personalized data
      setTimeout(() => {
        setPersonalizedData({
          userStats: {
            totalMocktailsTried: 42,
            totalPoints: 1250,
            currentStreak: 7
          },
          recentActivity: [
            {
              id: '1',
              type: 'check_in',
              title: 'Checked in at The Sober Lounge',
              description: 'Enjoyed a Virgin Mojito',
              timestamp: '2 hours ago',
              points: 25
            },
            {
              id: '2',
              type: 'mocktail_tried',
              title: 'Tried new mocktail',
              description: 'Passion Fruit Fizz at Zero Proof Bar',
              timestamp: '1 day ago',
              points: 15
            },
            {
              id: '3',
              type: 'achievement',
              title: 'Week Streak Achieved!',
              description: 'Maintained your sober journey for 7 days',
              timestamp: '3 days ago',
              points: 50
            }
          ],
          recommendations: [
            {
              id: '1',
              type: 'establishment',
              title: 'The Mocktail Lounge',
              description: 'Popular sober bar with creative non-alcoholic cocktails',
              reason: 'Based on your love for Virgin Mojitos',
              rating: 4.8,
              distance: '0.3 miles'
            },
            {
              id: '2',
              type: 'cocktail',
              title: 'Elderflower Sparkler',
              description: 'Refreshing elderflower and lime mocktail',
              reason: 'Perfect for your citrus preferences',
              rating: 4.6
            },
            {
              id: '3',
              type: 'event',
              title: 'Sober Social Mixer',
              description: 'Meet fellow sober enthusiasts',
              reason: 'Great for expanding your social circle',
              date: 'Tomorrow',
              time: '7:00 PM',
              attendees: 23,
              location: 'Downtown Community Center'
            }
          ],
          quickActions: [
            {
              id: '1',
              title: 'Find Nearby Bars',
              description: 'Discover sober-friendly establishments',
              icon: 'map-pin',
              action: '/map'
            },
            {
              id: '2',
              title: 'Browse Mocktails',
              description: 'Explore new drink recipes',
              icon: 'glass',
              action: '/cocktails'
            },
            {
              id: '3',
              title: 'Join Events',
              description: 'Find sober social events',
              icon: 'calendar',
              action: '/events'
            },
            {
              id: '4',
              title: 'Create Recipe',
              description: 'Share your mocktail creation',
              icon: 'plus',
              action: '/profile/recipes'
            }
          ],
          nearbyEstablishments: [
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
          ],
          upcomingEvents: [
            {
              id: '1',
              title: 'Sober Social Mixer',
              description: 'Meet fellow sober enthusiasts and enjoy mocktails',
              date: 'Tomorrow',
              time: '7:00 PM',
              attendees: 23,
              location: 'Downtown Community Center'
            },
            {
              id: '2',
              title: 'Mocktail Making Class',
              description: 'Learn to craft professional-level non-alcoholic drinks',
              date: 'This Saturday',
              time: '2:00 PM',
              attendees: 15,
              location: 'The Sober Lounge'
            },
            {
              id: '3',
              title: 'Sober Brunch',
              description: 'Weekend brunch with virgin mimosas and bloody marys',
              date: 'Sunday',
              time: '11:00 AM',
              attendees: 32,
              location: 'Sunrise Cafe'
            }
          ]
        });
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [isLoading, isAuthenticated]);

  return {
    loading,
    isAuthenticated,
    userStats: personalizedData.userStats,
    recentActivity: personalizedData.recentActivity,
    recommendations: personalizedData.recommendations,
    quickActions: personalizedData.quickActions,
    nearbyEstablishments: personalizedData.nearbyEstablishments,
    upcomingEvents: personalizedData.upcomingEvents
  };
};
