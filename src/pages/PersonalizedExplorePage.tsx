
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import { QuickActionCards } from '@/components/explore/personalized/QuickActionCards';
import { QuickStatsWidget } from '@/components/explore/personalized/QuickStatsWidget';
import { RewardsHighlightWidget } from '@/components/explore/personalized/RewardsHighlightWidget';
import StreakMotivationWidget from '@/components/explore/personalized/StreakMotivationWidget';
import { ActivityFeedWidget } from '@/components/explore/personalized/ActivityFeedWidget';
import { RecommendationsWidget } from '@/components/explore/personalized/RecommendationsWidget';
import { NearbyEstablishmentsWidget } from '@/components/explore/personalized/NearbyEstablishmentsWidget';
import { UpcomingEventsWidget } from '@/components/explore/personalized/UpcomingEventsWidget';
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

  // Development mode widget validation
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const requiredWidgets = [
        { name: 'QuickStatsWidget', component: QuickStatsWidget },
        { name: 'RewardsHighlightWidget', component: RewardsHighlightWidget },
        { name: 'StreakMotivationWidget', component: StreakMotivationWidget },
        { name: 'ActivityFeedWidget', component: ActivityFeedWidget }
      ];

      const missingWidgets = requiredWidgets.filter(widget => !widget.component);
      
      if (missingWidgets.length > 0) {
        console.warn('⚠️ Missing required widgets:', missingWidgets.map(w => w.name));
      } else {
        console.log('✅ All required widgets are present');
      }
    }
  }, []);

  // Convert Activity to RealtimeActivity format for ActivityFeedWidget
  const convertToRealtimeActivity = (activities: any[]): RealtimeActivity[] => {
    return activities.map(activity => ({
      ...activity,
      user: typeof activity.user === 'string' 
        ? { id: 'user-1', name: activity.user, avatar: undefined }
        : activity.user || { id: 'user-1', name: 'Anonymous', avatar: undefined },
      likes: 0,
      isLiked: false,
      metadata: {}
    }));
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Your Personalized Experience
          </h1>
          <p className="text-muted-foreground">
            Discover amazing mocktails and connect with the swig community.
          </p>
        </div>

        {/* Quick Actions - Always visible */}
        <div>
          <QuickActionCards actions={quickActions} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Column - Main widgets */}
          <div className="xl:col-span-3 space-y-6">
            {/* Stats Row - Only show when authenticated and userStats available */}
            {isAuthenticated && userStats && (
              <QuickStatsWidget
                totalMocktailsTried={userStats.totalMocktailsTried}
                totalPoints={userStats.totalPoints}
                currentStreak={userStats.currentStreak}
              />
            )}

            {/* Rewards and Streak Row */}
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

            {/* Recommendations */}
            <RecommendationsWidget
              recommendations={recommendations}
              isLoading={loading}
              activeCategory="all"
            />

            {/* Nearby Establishments */}
            <NearbyEstablishmentsWidget 
              establishments={nearbyEstablishments}
              isLoading={loading}
            />
          </div>

          {/* Right Column - Activity and Events */}
          <div className="space-y-6">
            {/* Activity Feed - Only show when authenticated */}
            {isAuthenticated && (
              <ActivityFeedWidget 
                activities={convertToRealtimeActivity(recentActivity)}
                isLoading={loading}
              />
            )}

            {/* Upcoming Events */}
            <UpcomingEventsWidget 
              events={upcomingEvents}
              isLoading={loading}
            />
          </div>
        </div>

        {/* Development Debug Panel */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Widget Status Debug</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Authentication:</strong> {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
              </div>
              <div>
                <strong>User Stats:</strong> {userStats ? '✅ Available' : '❌ Missing'}
              </div>
              <div>
                <strong>QuickStatsWidget:</strong> {isAuthenticated && userStats ? '✅ Visible' : '❌ Hidden'}
              </div>
              <div>
                <strong>RewardsHighlightWidget:</strong> {isAuthenticated ? '✅ Visible' : '❌ Hidden'}
              </div>
              <div>
                <strong>StreakMotivationWidget:</strong> {isAuthenticated ? '✅ Visible' : '❌ Hidden'}
              </div>
              <div>
                <strong>ActivityFeedWidget:</strong> {isAuthenticated ? '✅ Visible' : '❌ Hidden'}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PersonalizedExplorePage;
