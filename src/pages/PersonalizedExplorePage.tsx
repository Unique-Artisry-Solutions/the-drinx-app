
import React from 'react';
import Layout from '@/components/Layout';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import { QuickStatsWidget } from '@/components/explore/personalized/QuickStatsWidget';
import RecommendationsWidget from '@/components/explore/personalized/RecommendationsWidget';
import { ActivityFeedWidget } from '@/components/explore/personalized/ActivityFeedWidget';
import QuickActionCards from '@/components/explore/personalized/QuickActionCards';
import { NearbyEstablishmentsWidget } from '@/components/explore/personalized/NearbyEstablishmentsWidget';
import { UpcomingEventsWidget } from '@/components/explore/personalized/UpcomingEventsWidget';
import { RewardsHighlightWidget } from '@/components/explore/personalized/RewardsHighlightWidget';
import StreakMotivationWidget from '@/components/explore/personalized/StreakMotivationWidget';
import { Skeleton } from '@/components/ui/skeleton';
import { RealtimeActivity } from '@/types/explore';

// Widget existence validation - prevent accidental removal
const REQUIRED_WIDGETS = [
  'QuickStatsWidget',
  'RewardsHighlightWidget', 
  'StreakMotivationWidget',
  'ActivityFeedWidget'
] as const;

const validateWidgetExistence = () => {
  const missingWidgets: string[] = [];
  
  if (!QuickStatsWidget) missingWidgets.push('QuickStatsWidget');
  if (!RewardsHighlightWidget) missingWidgets.push('RewardsHighlightWidget');
  if (!StreakMotivationWidget) missingWidgets.push('StreakMotivationWidget');
  if (!ActivityFeedWidget) missingWidgets.push('ActivityFeedWidget');
  
  if (missingWidgets.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('⚠️ WIDGET VALIDATION: Missing required widgets:', missingWidgets);
    console.warn('📋 Required widgets for PersonalizedExplorePage:', REQUIRED_WIDGETS);
  }
  
  return missingWidgets.length === 0;
};

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

  // Validate widgets on mount
  React.useEffect(() => {
    validateWidgetExistence();
  }, []);

  // Convert base Activity to RealtimeActivity format for the widget
  const convertToRealtimeActivity = (activities: any[]): RealtimeActivity[] => {
    return activities.map(activity => ({
      ...activity,
      user: typeof activity.user === 'string' 
        ? { id: 'user1', name: activity.user } 
        : activity.user || { id: 'unknown', name: 'Anonymous User' },
      likes: 0,
      isLiked: false,
      metadata: {}
    }));
  };

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

        {/* Main Content Grid - Responsive Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Left Column - Main Content (spans 3 columns on XL screens) */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Top Stats Row - REQUIRED WIDGET: QuickStatsWidget */}
            {isAuthenticated && userStats && (
              <div className="mb-6">
                <QuickStatsWidget 
                  totalMocktailsTried={userStats.totalMocktailsTried}
                  totalPoints={userStats.totalPoints}
                  currentStreak={userStats.currentStreak}
                />
              </div>
            )}

            {/* Rewards and Streak Row - REQUIRED WIDGETS */}
            {isAuthenticated && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* REQUIRED WIDGET: RewardsHighlightWidget */}
                <RewardsHighlightWidget 
                  totalPoints={userStats?.totalPoints}
                  currentTier="Silver"
                  nextTier="Gold"
                  progressToNextTier={83}
                />
                
                {/* REQUIRED WIDGET: StreakMotivationWidget */}
                <StreakMotivationWidget />
              </div>
            )}

            {/* Recommendations Section */}
            <RecommendationsWidget recommendations={recommendations} />

            {/* Nearby Establishments */}
            <NearbyEstablishmentsWidget establishments={nearbyEstablishments} />
          </div>

          {/* Right Column - Sidebar (spans 1 column on XL screens) */}
          <div className="xl:col-span-1 space-y-6">
            
            {/* REQUIRED WIDGET: ActivityFeedWidget - Activity Stream */}
            {isAuthenticated && (
              <div className="mb-6">
                <ActivityFeedWidget activities={convertToRealtimeActivity(recentActivity)} />
              </div>
            )}

            {/* Upcoming Events */}
            <UpcomingEventsWidget events={upcomingEvents} />
          </div>
        </div>

        {/* Development Mode Widget Status */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-blue-100 border border-blue-300 rounded-lg p-3 text-xs">
            <div className="font-semibold text-blue-800 mb-1">Widget Status:</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={QuickStatsWidget ? 'text-green-600' : 'text-red-600'}>●</span>
                QuickStatsWidget {QuickStatsWidget ? '✓' : '✗'}
              </div>
              <div className="flex items-center gap-2">
                <span className={RewardsHighlightWidget ? 'text-green-600' : 'text-red-600'}>●</span>
                RewardsHighlightWidget {RewardsHighlightWidget ? '✓' : '✗'}
              </div>
              <div className="flex items-center gap-2">
                <span className={StreakMotivationWidget ? 'text-green-600' : 'text-red-600'}>●</span>
                StreakMotivationWidget {StreakMotivationWidget ? '✓' : '✗'}
              </div>
              <div className="flex items-center gap-2">
                <span className={ActivityFeedWidget ? 'text-green-600' : 'text-red-600'}>●</span>
                ActivityFeedWidget {ActivityFeedWidget ? '✓' : '✗'}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PersonalizedExplorePage;
