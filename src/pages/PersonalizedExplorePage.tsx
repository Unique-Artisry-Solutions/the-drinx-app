
import React from 'react';
import Layout from '@/components/Layout';
import { QuickActionCards } from '@/components/explore/personalized/QuickActionCards';
import { RecommendationsWidget } from '@/components/explore/personalized/RecommendationsWidget';
import { ActivityFeedWidget } from '@/components/explore/personalized/ActivityFeedWidget';
import { NearbyEstablishmentsWidget } from '@/components/explore/personalized/NearbyEstablishmentsWidget';
import { UpcomingEventsWidget } from '@/components/explore/personalized/UpcomingEventsWidget';
import { Skeleton } from '@/components/ui/skeleton';
import { useEnhancedQuickActions } from '@/hooks/useEnhancedQuickActions';
import { usePersonalizedRecommendations } from '@/hooks/usePersonalizedRecommendations';
import { useRealtimeActivity } from '@/hooks/useRealtimeActivity';
import { useAuth } from '@/hooks/useAuth';
import { CheckIn, Calendar, Plus, MapPin, Users, Share } from 'lucide-react';

const PersonalizedExplorePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { actions, isLoading: actionsLoading, handleActionClick } = useEnhancedQuickActions();
  const { 
    recommendations, 
    isLoading: recommendationsLoading,
    activeCategory,
    setActiveCategory 
  } = usePersonalizedRecommendations();
  const { activities, isLoading: activitiesLoading } = useRealtimeActivity();

  // Mock user stats for authenticated users
  const userStats = isAuthenticated ? {
    totalMocktailsTried: 47,
    totalPoints: 1250,
    currentStreak: 5
  } : null;

  // Mock nearby establishments
  const nearbyEstablishments = [
    {
      id: '1',
      name: 'The Zen Garden',
      description: 'Peaceful mocktail sanctuary',
      distance: '0.3 miles',
      rating: 4.8,
      isOpen: true,
      imageUrl: '/api/placeholder/150/100'
    },
    {
      id: '2',
      name: 'Clarity Bar',
      description: 'Premium non-alcoholic experiences',
      distance: '0.7 miles',
      rating: 4.6,
      isOpen: true,
      imageUrl: '/api/placeholder/150/100'
    }
  ];

  // Mock upcoming events
  const upcomingEvents = [
    {
      id: '1',
      title: 'Mindful Mixology Workshop',
      description: 'Learn to create intention-based mocktails',
      date: '2024-01-15',
      time: '7:00 PM',
      location: 'The Zen Garden',
      attendees: 24,
      imageUrl: '/api/placeholder/150/100'
    },
    {
      id: '2',
      title: 'Sober Social Mixer',
      description: 'Connect with like-minded individuals',
      date: '2024-01-18',
      time: '6:30 PM',
      location: 'Clarity Bar',
      attendees: 18,
      imageUrl: '/api/placeholder/150/100'
    }
  ];

  // Enhanced quick actions with proper EnhancedQuickAction properties
  const enhancedQuickActions = [
    {
      id: 'check-in',
      title: 'Check In Nearby',
      description: 'Find and check into nearby establishments',
      icon: <CheckIn className="h-6 w-6" />,
      color: 'from-blue-500 to-cyan-500',
      isEnabled: true,
      requiresAuth: false,
      shortcut: 'Ctrl+C',
      onClick: actions.checkInNearby
    },
    {
      id: 'find-events',
      title: 'Find Events',
      description: 'Discover upcoming mocktail events',
      icon: <Calendar className="h-6 w-6" />,
      color: 'from-purple-500 to-pink-500',
      isEnabled: true,
      requiresAuth: false,
      onClick: actions.findEvents
    },
    {
      id: 'create-recipe',
      title: 'Create Recipe',
      description: 'Share your mocktail creation',
      icon: <Plus className="h-6 w-6" />,
      color: 'from-green-500 to-emerald-500',
      isEnabled: true,
      requiresAuth: true,
      badge: 'New',
      onClick: actions.createRecipe
    },
    {
      id: 'start-bar-crawl',
      title: 'Start Bar Crawl',
      description: 'Begin a mocktail adventure',
      icon: <MapPin className="h-6 w-6" />,
      color: 'from-orange-500 to-red-500',
      isEnabled: true,
      requiresAuth: false,
      onClick: actions.startBarCrawl
    },
    {
      id: 'find-friends',
      title: 'Find Friends',
      description: 'Connect with fellow enthusiasts',
      icon: <Users className="h-6 w-6" />,
      color: 'from-indigo-500 to-purple-500',
      isEnabled: true,
      requiresAuth: true,
      onClick: actions.findFriends
    },
    {
      id: 'share-achievement',
      title: 'Share Achievement',
      description: 'Celebrate your progress',
      icon: <Share className="h-6 w-6" />,
      color: 'from-yellow-500 to-orange-500',
      isEnabled: isAuthenticated && userStats?.currentStreak > 0,
      requiresAuth: true,
      onClick: actions.shareAchievement
    }
  ];

  const isLoading = actionsLoading || recommendationsLoading || activitiesLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isAuthenticated ? 'Your Dashboard' : 'Discover Amazing Mocktails'}
          </h1>
          <p className="text-muted-foreground">
            {isAuthenticated 
              ? 'Welcome back! Here\'s what\'s happening in your mocktail world.'
              : 'Explore the best non-alcoholic experiences in your area.'
            }
          </p>
        </div>

        {/* Quick Actions - Always visible */}
        <div className="mb-8">
          <QuickActionCards 
            actions={enhancedQuickActions} 
            onActionClick={handleActionClick}
            isLoading={actionsLoading}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recommendations */}
            <RecommendationsWidget 
              recommendations={recommendations}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              isLoading={recommendationsLoading}
            />

            {/* Nearby Establishments */}
            <NearbyEstablishmentsWidget establishments={nearbyEstablishments} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Activity - Only for authenticated users */}
            {isAuthenticated && (
              <ActivityFeedWidget 
                activities={activities}
                className="h-fit"
              />
            )}

            {/* Upcoming Events */}
            <UpcomingEventsWidget events={upcomingEvents} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PersonalizedExplorePage;
