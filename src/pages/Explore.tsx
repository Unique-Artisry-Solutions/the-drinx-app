
import React from 'react';
import Layout from '@/components/Layout';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import { usePersonalizedRecommendations } from '@/hooks/usePersonalizedRecommendations';
import { QuickStatsWidget } from '@/components/explore/personalized/QuickStatsWidget';
import { RewardsHighlightWidget } from '@/components/explore/personalized/RewardsHighlightWidget';
import { ActivityFeedWidget } from '@/components/explore/personalized/ActivityFeedWidget';
import { QuickActionCards } from '@/components/explore/personalized/QuickActionCards';
import { NearbyEstablishmentsWidget } from '@/components/explore/personalized/NearbyEstablishmentsWidget';
import { UpcomingEventsWidget } from '@/components/explore/personalized/UpcomingEventsWidget';
import { RecommendationsWidget } from '@/components/explore/personalized/RecommendationsWidget';
import StreakMotivationWidget from '@/components/explore/personalized/StreakMotivationWidget';
import WidgetErrorBoundary from '@/components/explore/WidgetErrorBoundary';

const Explore: React.FC = () => {
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

  const {
    recommendations: personalizedRecs,
    isLoading: recsLoading
  } = usePersonalizedRecommendations();

  // Check if user appears to be new
  const isNewUser = userStats.totalMocktailsTried === 0 && 
                   userStats.totalPoints === 0 && 
                   userStats.currentStreak === 0;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your personalized experience...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Spiritless</h2>
            <p className="text-gray-600 mb-6">Please sign in to access your personalized explore page</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isNewUser ? 'Welcome to Your Sober Journey!' : 'Explore'}
              </h1>
              <p className="text-gray-600">
                {isNewUser 
                  ? 'Let\'s get you started with amazing alcohol-free experiences'
                  : 'Discover your personalized sober social experience'
                }
              </p>
            </div>
            {isNewUser && (
              <div className="text-right">
                <div className="text-sm text-blue-600 font-medium">New Member</div>
                <div className="text-xs text-gray-500">Complete your first activity!</div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <WidgetErrorBoundary widgetName="Quick Stats">
              <QuickStatsWidget
                totalMocktailsTried={userStats.totalMocktailsTried}
                totalPoints={userStats.totalPoints}
                currentStreak={userStats.currentStreak}
              />
            </WidgetErrorBoundary>

            {/* Quick Actions */}
            <WidgetErrorBoundary widgetName="Quick Actions">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {isNewUser ? 'Get Started' : 'Quick Actions'}
                </h2>
                <QuickActionCards actions={quickActions} />
              </div>
            </WidgetErrorBoundary>

            {/* Personalized Recommendations */}
            <WidgetErrorBoundary widgetName="Personalized Recommendations">
              <RecommendationsWidget recommendations={recommendations} />
            </WidgetErrorBoundary>

            {/* Activity Feed */}
            <WidgetErrorBoundary widgetName="Activity Feed">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {isNewUser ? 'Your Journey Starts Here' : 'Recent Activity'}
                </h2>
                <ActivityFeedWidget activities={recentActivity} />
              </div>
            </WidgetErrorBoundary>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Streak Motivation */}
            <WidgetErrorBoundary widgetName="Streak Motivation">
              <StreakMotivationWidget />
            </WidgetErrorBoundary>

            {/* Rewards Highlight */}
            <WidgetErrorBoundary widgetName="Rewards">
              <RewardsHighlightWidget
                totalPoints={userStats.totalPoints}
                currentTier="Silver"
                nextTier="Gold"
                progressToNextTier={83}
              />
            </WidgetErrorBoundary>

            {/* Nearby Establishments */}
            <WidgetErrorBoundary widgetName="Nearby Places">
              <NearbyEstablishmentsWidget establishments={nearbyEstablishments} />
            </WidgetErrorBoundary>

            {/* Upcoming Events */}
            <WidgetErrorBoundary widgetName="Upcoming Events">
              <UpcomingEventsWidget events={upcomingEvents} />
            </WidgetErrorBoundary>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
