
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Map, List, Search } from 'lucide-react';
import { usePersonalizedRecommendations } from '@/hooks/usePersonalizedRecommendations';
import { useRealtimeActivity } from '@/hooks/useRealtimeActivity';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import { QuickActionCards } from '@/components/explore/personalized/QuickActionCards';
import { RecommendationsWidget } from '@/components/explore/personalized/RecommendationsWidget';
import { ActivityFeedWidget } from '@/components/explore/personalized/ActivityFeedWidget';
import { QuickStatsWidget } from '@/components/explore/personalized/QuickStatsWidget';
import { RewardsHighlightWidget } from '@/components/explore/personalized/RewardsHighlightWidget';
import StreakMotivationWidget from '@/components/explore/personalized/StreakMotivationWidget';
import { NearbyEstablishmentsWidget } from '@/components/explore/personalized/NearbyEstablishmentsWidget';
import { UpcomingEventsWidget } from '@/components/explore/personalized/UpcomingEventsWidget';
import DevRoleSwitcher from '@/components/development/DevRoleSwitcher';
import { RecommendationCategoryType } from '@/types/explore';

const Explore: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    recommendations,
    isLoading: recommendationsLoading,
    activeCategory,
    setActiveCategory,
    saveRecommendation,
    dismissRecommendation,
    shareRecommendation
  } = usePersonalizedRecommendations();

  const { activities, isLoading: activitiesLoading } = useRealtimeActivity();
  
  const {
    loading: personalizedDataLoading,
    isAuthenticated,
    userStats,
    nearbyEstablishments,
    upcomingEvents
  } = usePersonalizedData();

  // Type-safe category handler
  const handleCategoryChange = (category: RecommendationCategoryType) => {
    setActiveCategory(category);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Explore Amazing Mocktails
          </h1>
          <p className="text-muted-foreground">
            Discover the best non-alcoholic experiences in your area.
          </p>
        </div>

        {/* Search and View Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search establishments, cocktails, events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              size="sm"
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              onClick={() => setViewMode('map')}
              size="sm"
            >
              <Map className="h-4 w-4 mr-2" />
              Map
            </Button>
          </div>
        </div>

        {/* Development Tools */}
        <div className="mb-8">
          <DevRoleSwitcher />
        </div>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <QuickActionCards />
        </div>

        {/* Personalized Stats Section - Only show if authenticated and have user stats */}
        {isAuthenticated && userStats && !personalizedDataLoading && (
          <div className="mb-8">
            <QuickStatsWidget
              totalMocktailsTried={userStats.totalMocktailsTried}
              totalPoints={userStats.totalPoints}
              currentStreak={userStats.currentStreak}
            />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Column - Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Rewards and Streak Row - Only show if authenticated */}
            {isAuthenticated && !personalizedDataLoading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RewardsHighlightWidget
                  totalPoints={userStats?.totalPoints || 1250}
                  currentTier="Silver"
                  nextTier="Gold"
                  progressToNextTier={83}
                />
                <StreakMotivationWidget />
              </div>
            )}

            {/* Recommendations Widget */}
            <RecommendationsWidget
              recommendations={recommendations}
              isLoading={recommendationsLoading}
              activeCategory={activeCategory}
              setActiveCategory={handleCategoryChange}
              onSave={saveRecommendation}
              onDismiss={dismissRecommendation}
              onShare={shareRecommendation}
            />

            {/* Nearby Establishments - Only show if authenticated */}
            {isAuthenticated && !personalizedDataLoading && (
              <NearbyEstablishmentsWidget establishments={nearbyEstablishments} />
            )}
          </div>

          {/* Right Column - Activity and Events */}
          <div className="space-y-6">
            <ActivityFeedWidget activities={activities} isLoading={activitiesLoading} />
            
            {/* Upcoming Events - Only show if authenticated */}
            {isAuthenticated && !personalizedDataLoading && (
              <UpcomingEventsWidget events={upcomingEvents} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
