
import React, { useEffect, useState } from 'react';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import { QuickStatsWidget } from '@/components/explore/personalized/QuickStatsWidget';
import { RewardsHighlightWidget } from '@/components/explore/personalized/RewardsHighlightWidget';
import StreakMotivationWidget from '@/components/explore/personalized/StreakMotivationWidget';
import { ActivityFeedWidget } from '@/components/explore/personalized/ActivityFeedWidget';
import { RecommendationsWidget } from '@/components/explore/personalized/RecommendationsWidget';
import { NearbyEstablishmentsWidget } from '@/components/explore/personalized/NearbyEstablishmentsWidget';
import { UpcomingEventsWidget } from '@/components/explore/personalized/UpcomingEventsWidget';
import { QuickActionCards } from '@/components/explore/personalized/QuickActionCards';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { RealtimeActivity } from '@/types/explore';

const PersonalizedExplorePage: React.FC = () => {
  const {
    loading,
    isAuthenticated,
    userStats,
    recentActivity,
    recommendations,
    quickActions,
    nearbyEstablishments,
    upcomingEvents
  } = usePersonalizedData();
  
  const isMobile = useIsMobile();
  const [widgetValidation, setWidgetValidation] = useState<Record<string, boolean>>({});

  // Convert Activity[] to RealtimeActivity[] for ActivityFeedWidget
  const convertToRealtimeActivities = (activities: any[]): RealtimeActivity[] => {
    return activities.map(activity => ({
      ...activity,
      user: typeof activity.user === 'string' 
        ? { id: 'user1', name: activity.user }
        : activity.user || { id: 'user1', name: 'You' },
      likes: 0,
      isLiked: false,
      metadata: {}
    }));
  };

  // Validate widget existence on mount
  useEffect(() => {
    const requiredWidgets = {
      QuickStatsWidget: !!QuickStatsWidget,
      RewardsHighlightWidget: !!RewardsHighlightWidget,
      StreakMotivationWidget: !!StreakMotivationWidget,
      ActivityFeedWidget: !!ActivityFeedWidget
    };
    
    setWidgetValidation(requiredWidgets);
    
    // Development mode warnings
    if (process.env.NODE_ENV === 'development') {
      Object.entries(requiredWidgets).forEach(([widget, exists]) => {
        if (!exists) {
          console.warn(`Required widget missing: ${widget}`);
        }
      });
    }
  }, []);

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-32 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const realtimeActivities = convertToRealtimeActivities(recentActivity || []);

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Swig</h1>
        <p className="text-muted-foreground">
          Discover new mocktails, events, and connect with the swig community
        </p>
      </div>

      {/* Quick Actions - Always visible */}
      <div className="mb-8">
        <QuickActionCards actions={quickActions} />
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Column - Main Content (spans 3 columns on XL) */}
        <div className="xl:col-span-3 space-y-6">
          {/* QuickStatsWidget - Top row, spans full width */}
          {isAuthenticated && userStats && (
            <QuickStatsWidget
              totalMocktailsTried={userStats.totalMocktailsTried}
              totalPoints={userStats.totalPoints}
              currentStreak={userStats.currentStreak}
            />
          )}

          {/* Rewards and Streak Row */}
          {isAuthenticated && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RewardsHighlightWidget
                totalPoints={userStats?.totalPoints}
                currentTier="Silver"
                nextTier="Gold"
                progressToNextTier={83}
              />
              <StreakMotivationWidget />
            </div>
          )}

          {/* Recommendations */}
          <RecommendationsWidget recommendations={recommendations} />

          {/* Nearby Establishments */}
          <NearbyEstablishmentsWidget establishments={nearbyEstablishments} />
        </div>

        {/* Right Column - Activity and Events (spans 1 column on XL) */}
        <div className="xl:col-span-1 space-y-6">
          {/* Activity Feed */}
          {isAuthenticated && (
            <ActivityFeedWidget activities={realtimeActivities} />
          )}

          {/* Upcoming Events */}
          <UpcomingEventsWidget events={upcomingEvents} />
        </div>
      </div>

      {/* Development Mode Debug Panel */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold mb-2">Widget Validation Debug</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(widgetValidation).map(([widget, exists]) => (
              <div key={widget} className={exists ? 'text-green-600' : 'text-red-600'}>
                {widget}: {exists ? '✓' : '✗'}
              </div>
            ))}
          </div>
          <p className="text-xs mt-2 text-gray-600">
            Auth: {isAuthenticated ? '✓' : '✗'} | 
            Stats: {userStats ? '✓' : '✗'} | 
            Activities: {recentActivity?.length || 0}
          </p>
        </div>
      )}
    </div>
  );
};

export default PersonalizedExplorePage;
