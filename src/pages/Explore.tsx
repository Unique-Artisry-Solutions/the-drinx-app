import React from 'react';
import Layout from '@/components/Layout';
import QuickActionCards from '@/components/explore/personalized/QuickActionCards';
import AchievementProximityAlerts from '@/components/rewards/AchievementProximityAlerts';
import QuickStatsWidget from '@/components/explore/personalized/QuickStatsWidget';
import RecommendationsWidget from '@/components/explore/personalized/RecommendationsWidget';
import NearbyEstablishmentsWidget from '@/components/explore/personalized/NearbyEstablishmentsWidget';
import UpcomingEventsWidget from '@/components/explore/personalized/UpcomingEventsWidget';
import ActivityFeedWidget from '@/components/explore/personalized/ActivityFeedWidget';
import RewardsHighlightWidget from '@/components/rewards/RewardsHighlightWidget';
import StreakMotivationWidget from '@/components/explore/personalized/StreakMotivationWidget';
import { TierStatusIndicator } from '@/components/rewards/TierStatusIndicator';
import { Achievement, QuickAction, UserStats, PersonalizedRecommendation, RecentActivity, UpcomingEvent } from '@/hooks/usePersonalizedData';

const ExplorePage: React.FC = () => {
  // Mock data for demonstration
  const mockQuickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Find Nearby',
      description: 'Discover establishments',
      icon: 'map-pin',
      action: () => console.log('Find nearby clicked')
    },
    {
      id: '2',
      title: 'Create Recipe',
      description: 'Share your mocktail',
      icon: 'glass-water',
      action: () => console.log('Create recipe clicked')
    },
    {
      id: '3',
      title: 'Browse Events',
      description: 'Join swig circuits',
      icon: 'calendar',
      action: () => console.log('Browse events clicked')
    },
    {
      id: '4',
      title: 'Search',
      description: 'Find anything',
      icon: 'search',
      action: () => console.log('Search clicked')
    }
  ];

  const mockUserStats: UserStats = {
    totalVisits: 12,
    favoriteEstablishments: 5,
    reviewsWritten: 8,
    averageRating: 4.2
  };

  const mockRecommendations: PersonalizedRecommendation[] = [
    {
      id: '1',
      name: 'Citrus Mint Cooler',
      type: 'cocktail',
      reason: 'Based on your preference for citrus flavors',
      rating: 4.8,
      distance: '0.3 miles'
    },
    {
      id: '2',
      name: 'The Garden Lounge',
      type: 'establishment',
      reason: 'Popular with users who like similar drinks',
      rating: 4.6,
      distance: '0.7 miles'
    }
  ];

  const mockNearbyEstablishments = [
    {
      id: '1',
      name: 'The Botanical Bar',
      address: '123 Garden Street',
      image_url: '/placeholder.svg',
      distance: '0.2 miles'
    },
    {
      id: '2',
      name: 'Citrus & Sage',
      address: '456 Fresh Avenue',
      image_url: '/placeholder.svg',
      distance: '0.4 miles'
    }
  ];

  const mockRecentActivity: RecentActivity[] = [
    {
      id: '1',
      type: 'visit',
      establishment: 'The Botanical Bar',
      details: 'Checked in and tried their signature mocktail',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'review',
      establishment: 'Citrus & Sage',
      details: 'Left a 5-star review',
      timestamp: '1 day ago'
    }
  ];

  const mockUpcomingEvents: UpcomingEvent[] = [
    {
      id: '1',
      title: 'Summer Swig Circuit',
      type: 'circuit',
      date: 'June 15, 2024',
      location: 'Downtown District'
    },
    {
      id: '2',
      title: 'Mocktail Masterclass',
      type: 'workshop',
      date: 'June 20, 2024',
      location: 'The Garden Lounge'
    }
  ];

  const mockAchievements: Achievement[] = [
    {
      id: '1',
      name: 'First Timer',
      description: 'Visit your first establishment',
      category: 'visits',
      progress: 1,
      total: 1,
      target: 1,
      pointsReward: 50,
      icon: 'map-pin',
      urgency: 'low',
      suggestion: 'You\'ve completed this achievement!',
      estimatedCompletion: 'Complete'
    },
    {
      id: '2',
      name: 'Social Butterfly',
      description: 'Leave 5 reviews to help others',
      category: 'social',
      progress: 3,
      total: 5,
      target: 5,
      pointsReward: 100,
      icon: 'star',
      urgency: 'medium',
      suggestion: 'Just 2 more reviews to unlock this achievement!',
      estimatedCompletion: '2-3 visits'
    },
    {
      id: '3',
      name: 'Explorer',
      description: 'Visit 10 different establishments',
      category: 'exploration',
      progress: 8,
      total: 10,
      target: 10,
      pointsReward: 200,
      icon: 'map-pin',
      urgency: 'high',
      suggestion: 'Only 2 more establishments to go!',
      estimatedCompletion: '1 week'
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Explore</h1>
          <p className="text-muted-foreground">Discover amazing mocktails, bars, and events in your area</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 lg:mb-8">
          <QuickActionCards actions={mockQuickActions} />
        </div>

        {/* Rewards and Progress Section - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <RewardsHighlightWidget />
          <StreakMotivationWidget />
        </div>

        {/* Tier Progress */}
        <div className="mb-6 lg:mb-8">
          <TierStatusIndicator currentTier={2} points={750} />
        </div>

        {/* Achievement Alerts */}
        <div className="mb-6 lg:mb-8">
          <AchievementProximityAlerts achievements={mockAchievements} />
        </div>

        {/* Main Content Grid - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* User Stats */}
            <QuickStatsWidget stats={mockUserStats} />

            {/* Recommendations */}
            <RecommendationsWidget recommendations={mockRecommendations} />

            {/* Nearby Establishments */}
            <NearbyEstablishmentsWidget establishments={mockNearbyEstablishments} />
          </div>

          {/* Right Column */}
          <div className="space-y-4 lg:space-y-6">
            {/* Recent Activity */}
            <ActivityFeedWidget activities={mockRecentActivity} />

            {/* Upcoming Events */}
            <UpcomingEventsWidget events={mockUpcomingEvents} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExplorePage;
