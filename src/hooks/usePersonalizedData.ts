import { useState, useEffect } from 'react';
import { UserStats } from '@/types/ExploreTypes';
import { PersonalizedData, QuickAction, Activity, Recommendation } from '@/types/explore';

export const usePersonalizedData = (): PersonalizedData => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated] = useState(true); // Fixed: Set to true to show all widgets

  const [data, setData] = useState<Omit<PersonalizedData, 'loading' | 'isAuthenticated'>>({
    userStats: null,
    recentActivity: [],
    recommendations: [],
    quickActions: [],
    nearbyEstablishments: [],
    upcomingEvents: []
  });

  useEffect(() => {
    // Simulate loading and set mock data
    const timer = setTimeout(() => {
      // Mock quick actions
      const mockQuickActions: QuickAction[] = [
        {
          id: '1',
          title: 'Check In Nearby',
          description: 'Find and check into nearby establishments',
          iconName: 'MapPin',
          color: 'bg-blue-500',
          isEnabled: true,
          onClick: () => console.log('Check in clicked')
        },
        {
          id: '2',
          title: 'Find Events',
          description: 'Discover upcoming swig events',
          iconName: 'Search',
          color: 'bg-green-500',
          isEnabled: true,
          onClick: () => console.log('Find events clicked')
        },
        {
          id: '3',
          title: 'Create Recipe',
          description: 'Share your mocktail creation',
          iconName: 'Plus',
          color: 'bg-purple-500',
          isEnabled: true,
          onClick: () => console.log('Create recipe clicked')
        },
        {
          id: '4',
          title: 'Start Bar Crawl',
          description: 'Begin a new adventure',
          iconName: 'Users',
          color: 'bg-orange-500',
          isEnabled: true,
          onClick: () => console.log('Start bar crawl clicked')
        },
        {
          id: '5',
          title: 'Share Achievement',
          description: 'Show off your latest milestone',
          iconName: 'Share',
          color: 'bg-pink-500',
          isEnabled: true,
          onClick: () => console.log('Share achievement clicked')
        },
        {
          id: '6',
          title: 'Find Friends',
          description: 'Connect with other swig enthusiasts',
          iconName: 'UserPlus',
          color: 'bg-teal-500',
          isEnabled: true,
          onClick: () => console.log('Find friends clicked')
        }
      ];

      // Mock recommendations with diverse types and personalization
      const mockRecommendations: Recommendation[] = [
        {
          id: '1',
          title: 'The Zen Garden',
          description: 'Peaceful atmosphere with meditation-inspired mocktails',
          type: 'establishment',
          rating: 4.8,
          distance: '0.3 miles',
          price: '$$',
          imageUrl: '/api/placeholder/300/200',
          reason: 'Based on your love for quiet spaces and wellness activities',
          tags: ['peaceful', 'meditation', 'organic'],
          isSaved: false,
          availability: 'open',
          trending: true
        },
        {
          id: '2',
          title: 'Spiced Pear Fizz',
          description: 'Warming autumn flavors with ginger and cinnamon',
          type: 'cocktail',
          rating: 4.6,
          imageUrl: '/api/placeholder/300/200',
          reason: 'Perfect for your fall flavor preferences',
          tags: ['seasonal', 'spiced', 'refreshing'],
          isSaved: true
        },
        {
          id: '3',
          title: 'Mindful Mixology Workshop',
          description: 'Learn to create mocktails with intention and mindfulness',
          type: 'event',
          rating: 4.9,
          distance: '1.2 miles',
          imageUrl: '/api/placeholder/300/200',
          reason: 'Matches your interest in wellness and learning',
          tags: ['workshop', 'mindfulness', 'learning'],
          isSaved: false,
          trending: false
        },
        {
          id: '4',
          title: 'Tropical Paradise Punch',
          description: 'Community-shared recipe with coconut and pineapple',
          type: 'recipe',
          rating: 4.4,
          imageUrl: '/api/placeholder/300/200',
          reason: 'Similar to recipes you\'ve saved before',
          tags: ['tropical', 'coconut', 'community'],
          isSaved: false
        },
        {
          id: '5',
          title: 'Rooftop Sober Social',
          description: 'Monthly rooftop gathering with city views',
          type: 'event',
          rating: 4.7,
          distance: '2.1 miles',
          imageUrl: '/api/placeholder/300/200',
          reason: 'Popular among people with similar interests',
          tags: ['social', 'rooftop', 'monthly'],
          isSaved: false,
          availability: 'closing-soon'
        },
        {
          id: '6',
          title: 'Lavender Dreams',
          description: 'Calming lavender and chamomile blend',
          type: 'cocktail',
          rating: 4.5,
          imageUrl: '/api/placeholder/300/200',
          reason: 'Recommended for your evening preferences',
          tags: ['calming', 'lavender', 'herbal'],
          isSaved: false
        },
        {
          id: '7',
          title: 'The Modern Apothecary',
          description: 'Botanical-focused establishment with house-made syrups',
          type: 'establishment',
          rating: 4.9,
          distance: '0.8 miles',
          price: '$$$',
          imageUrl: '/api/placeholder/300/200',
          reason: 'Known for innovative mocktails you might enjoy',
          tags: ['botanical', 'innovative', 'premium'],
          isSaved: false,
          availability: 'open',
          trending: true
        },
        {
          id: '8',
          title: 'Citrus Herb Garden Recipe',
          description: 'Fresh basil and lime creation by local mixologist',
          type: 'recipe',
          rating: 4.3,
          imageUrl: '/api/placeholder/300/200',
          reason: 'Trending in your area this week',
          tags: ['citrus', 'herbs', 'fresh'],
          isSaved: false,
          trending: true
        }
      ];

      // Mock recent activity data
      const mockRecentActivity: Activity[] = [
        {
          id: '1',
          type: 'check-in',
          title: 'Checked in at The Mocktail Bar',
          description: 'Had an amazing virgin mojito!',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          user: 'You',
          location: 'The Mocktail Bar'
        },
        {
          id: '2',
          type: 'achievement',
          title: 'Unlocked Achievement',
          description: 'First Check-in of the month!',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          user: 'You'
        },
        {
          id: '3',
          type: 'recipe',
          title: 'Created New Recipe',
          description: 'Tropical Paradise Punch',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          user: 'You'
        }
      ];

      // Mock nearby establishments data
      const mockNearbyEstablishments = [
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
      ];

      // Mock upcoming events data
      const mockUpcomingEvents = [
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
      ];

      setData({
        userStats: {
          totalMocktailsTried: 12,
          totalPoints: 1250,
          currentStreak: 5,
          establishmentsVisited: 8,
          favoriteEstablishments: 3
        },
        recentActivity: mockRecentActivity,
        recommendations: mockRecommendations,
        quickActions: mockQuickActions,
        nearbyEstablishments: mockNearbyEstablishments,
        upcomingEvents: mockUpcomingEvents
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return {
    loading,
    isAuthenticated,
    ...data
  };
};
