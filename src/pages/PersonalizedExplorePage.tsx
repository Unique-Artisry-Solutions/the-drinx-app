
import React from 'react';
import Layout from '@/components/Layout';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import { QuickStatsWidget } from '@/components/explore/personalized/QuickStatsWidget';
import { RecommendationsWidget } from '@/components/explore/personalized/RecommendationsWidget';
import ActivityFeedWidget from '@/components/explore/personalized/ActivityFeedWidget';
import QuickActionCards from '@/components/explore/personalized/QuickActionCards';
import { NearbyEstablishmentsWidget } from '@/components/explore/personalized/NearbyEstablishmentsWidget';
import { UpcomingEventsWidget } from '@/components/explore/personalized/UpcomingEventsWidget';
import { Skeleton } from '@/components/ui/skeleton';

const PersonalizedExplorePage: React.FC = () => {
  const {
    loading,
    userStats,
    recentActivity,
    recommendations,
    quickActions,
    nearbyEstablishments,
    upcomingEvents,
    isAuthenticated
  } = usePersonalizedData();

  if (loading) {
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

  // Transform data to match expected types
  const transformedRecommendations = recommendations.map(rec => ({
    ...rec,
    reason: `Recommended based on your preferences`,
    tags: ['popular', 'nearby'],
    isSaved: false
  }));

  const transformedActivities = recentActivity.map(activity => ({
    ...activity,
    likes: Math.floor(Math.random() * 20),
    isLiked: Math.random() > 0.5
  }));

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
          <QuickActionCards actions={quickActions} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Stats - Only for authenticated users */}
            {isAuthenticated && userStats && (
              <QuickStatsWidget 
                totalMocktailsTried={userStats.totalMocktailsTried}
                totalPoints={userStats.totalPoints}
                currentStreak={userStats.currentStreak}
              />
            )}

            {/* Recommendations */}
            <RecommendationsWidget recommendations={transformedRecommendations} />

            {/* Nearby Establishments */}
            <NearbyEstablishmentsWidget establishments={nearbyEstablishments} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Activity - Enhanced Activity Feed */}
            <ActivityFeedWidget activities={transformedActivities} />

            {/* Upcoming Events */}
            <UpcomingEventsWidget events={upcomingEvents} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PersonalizedExplorePage;
