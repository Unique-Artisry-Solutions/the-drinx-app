
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuickStatsWidget } from '@/components/explore/personalized/QuickStatsWidget';
import { RewardsHighlightWidget } from '@/components/explore/personalized/RewardsHighlightWidget';
import StreakMotivationWidget from '@/components/explore/personalized/StreakMotivationWidget';
import { ActivityFeedWidget } from '@/components/explore/personalized/ActivityFeedWidget';
import { QuickActionCards } from '@/components/explore/personalized/QuickActionCards';
import { UpcomingEventsWidget } from '@/components/explore/personalized/UpcomingEventsWidget';
import { NearbyEstablishmentsWidget } from '@/components/explore/personalized/NearbyEstablishmentsWidget';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import { useQuickActions } from '@/hooks/useQuickActions';
import { Compass, TrendingUp } from 'lucide-react';

const PersonalizedExplorePage: React.FC = () => {
  const { loading, isAuthenticated, userStats, recentActivity } = usePersonalizedData();
  const { createQuickActions } = useQuickActions();

  const quickActions = createQuickActions();

  // Widget validation in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const requiredWidgets = [
        'QuickStatsWidget',
        'RewardsHighlightWidget', 
        'StreakMotivationWidget',
        'ActivityFeedWidget'
      ];
      
      console.log('PersonalizedExplorePage: Required widgets validation', {
        widgets: requiredWidgets,
        userStats: !!userStats,
        isAuthenticated,
        activitiesCount: recentActivity.length
      });
    }
  }, [userStats, isAuthenticated, recentActivity]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Compass className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Explore</h1>
        </div>
        <p className="text-muted-foreground">
          Discover new mocktails, connect with establishments, and track your journey
        </p>
      </div>

      {/* Quick Actions - Always visible */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Quick Actions
        </h2>
        <QuickActionCards actions={quickActions} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Column - Main widgets (XL: 3 columns) */}
        <div className="xl:col-span-3 space-y-6">
          {/* Top Row - Quick Stats (authenticated users only) */}
          {isAuthenticated && userStats && (
            <QuickStatsWidget
              totalMocktailsTried={userStats.totalMocktailsTried}
              totalPoints={userStats.totalPoints}
              currentStreak={userStats.currentStreak}
            />
          )}

          {/* Second Row - Rewards and Streak (authenticated users only) */}
          {isAuthenticated && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RewardsHighlightWidget
                totalPoints={userStats?.totalPoints}
                currentTier="Silver"
                nextTier="Gold"
                progressToNextTier={83}
              />
              <StreakMotivationWidget />
            </div>
          )}

          {/* Recommendations Widget */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Personalized recommendations will appear here based on your preferences and activity.
              </p>
            </CardContent>
          </Card>

          {/* Nearby Establishments */}
          <NearbyEstablishmentsWidget />
        </div>

        {/* Right Column - Activity and Events (XL: 1 column) */}
        <div className="xl:col-span-1 space-y-6">
          {/* Activity Feed (authenticated users only) */}
          {isAuthenticated && (
            <ActivityFeedWidget activities={recentActivity} />
          )}

          {/* Upcoming Events */}
          <UpcomingEventsWidget />
        </div>
      </div>

      {/* Debug panel for development */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="mt-8 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Debug: Widget Status</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="space-y-1 text-orange-700">
              <p>✅ QuickStatsWidget: {isAuthenticated && userStats ? 'Rendered' : 'Hidden (auth required)'}</p>
              <p>✅ RewardsHighlightWidget: {isAuthenticated ? 'Rendered' : 'Hidden (auth required)'}</p>
              <p>✅ StreakMotivationWidget: {isAuthenticated ? 'Rendered' : 'Hidden (auth required)'}</p>
              <p>✅ ActivityFeedWidget: {isAuthenticated ? `Rendered (${recentActivity.length} activities)` : 'Hidden (auth required)'}</p>
              <p>Auth Status: {isAuthenticated ? 'Authenticated' : 'Not authenticated'}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonalizedExplorePage;
