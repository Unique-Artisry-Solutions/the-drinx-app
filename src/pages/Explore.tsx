
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ViewModeToggle } from '@/components/ViewModeToggle';
import { ViewMode } from '@/types/ExploreTypes';
import { QuickStatsWidget } from '@/components/explore/personalized/QuickStatsWidget';
import StreakMotivationWidget from '@/components/explore/personalized/StreakMotivationWidget';
import RewardsHighlightWidget from '@/components/rewards/RewardsHighlightWidget';
import { TabbedRecommendationsWidget } from '@/components/explore/personalized/TabbedRecommendationsWidget';
import { QuickActionCards } from '@/components/explore/personalized/QuickActionCards';
import { ActivityFeedWidget } from '@/components/explore/personalized/ActivityFeedWidget';
import { NearbyEstablishmentsWidget } from '@/components/explore/personalized/NearbyEstablishmentsWidget';
import { UpcomingEventsWidget } from '@/components/explore/personalized/UpcomingEventsWidget';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';

const ExplorePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const {
    loading,
    userStats,
    recentActivity,
    recommendations,
    quickActions,
    nearbyEstablishments,
    upcomingEvents
  } = usePersonalizedData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Explore</h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">Discover new places, drinks, and experiences</p>
          
          <div className="flex justify-center">
            <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            {/* Top Row - Streak and Stats (Swapped positions) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Streak Motivation Widget - Now on the left */}
              <div className="order-2 md:order-1">
                <StreakMotivationWidget />
              </div>
              
              {/* Stats Widget - Now on the right */}
              <div className="order-1 md:order-2">
                {userStats && (
                  <QuickStatsWidget
                    totalMocktailsTried={userStats.totalMocktailsTried}
                    totalPoints={userStats.totalPoints}
                    currentStreak={userStats.currentStreak}
                  />
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <QuickActionCards actions={quickActions} />

            {/* Tabbed Recommendations */}
            <TabbedRecommendationsWidget recommendations={recommendations} />
          </div>

          {/* Right Column - Secondary Content */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            {/* Rewards Widget */}
            <RewardsHighlightWidget />

            {/* Activity Feed */}
            <ActivityFeedWidget activities={recentActivity} />

            {/* Nearby Establishments */}
            <NearbyEstablishmentsWidget establishments={nearbyEstablishments} />

            {/* Upcoming Events */}
            <UpcomingEventsWidget events={upcomingEvents} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
