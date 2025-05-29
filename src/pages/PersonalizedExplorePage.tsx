
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { QuickActionCards } from '@/components/explore/personalized/QuickActionCards';
import { RecommendationsWidget } from '@/components/explore/personalized/RecommendationsWidget';
import { ActivityFeedWidget } from '@/components/explore/personalized/ActivityFeedWidget';
import { QuickStatsWidget } from '@/components/explore/personalized/QuickStatsWidget';
import { RewardsHighlightWidget } from '@/components/explore/personalized/RewardsHighlightWidget';
import { StreakMotivationWidget } from '@/components/explore/personalized/StreakMotivationWidget';
import { NearbyEstablishmentsWidget } from '@/components/explore/personalized/NearbyEstablishmentsWidget';
import { UpcomingEventsWidget } from '@/components/explore/personalized/UpcomingEventsWidget';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import { usePersonalizedRecommendations } from '@/hooks/usePersonalizedRecommendations';
import { useRealtimeActivity } from '@/hooks/useRealtimeActivity';
import { RealtimeActivity, RecommendationCategoryType } from '@/types/explore';

const PersonalizedExplorePage: React.FC = () => {
  const {
    loading,
    isAuthenticated,
    userStats,
    recentActivity,
    nearbyEstablishments,
    upcomingEvents
  } = usePersonalizedData();

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

  // Convert recent activity to realtime activity format for the feed
  const convertedActivities: RealtimeActivity[] = recentActivity.map(activity => ({
    ...activity,
    user: typeof activity.user === 'string' 
      ? { id: 'user1', name: activity.user, avatar: undefined }
      : activity.user || { id: 'user1', name: 'Anonymous', avatar: undefined },
    likes: 0,
    isLiked: false,
    metadata: {}
  }));

  const handleCategoryChange = (category: RecommendationCategoryType) => {
    setActiveCategory(category);
  };

  // Widget validation for development mode
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const warnings: string[] = [];
      
      // Check for required widgets
      const requiredWidgets = [
        { name: 'QuickStatsWidget', condition: isAuthenticated && userStats },
        { name: 'RewardsHighlightWidget', condition: isAuthenticated },
        { name: 'StreakMotivationWidget', condition: isAuthenticated },
        { name: 'ActivityFeedWidget', condition: isAuthenticated }
      ];

      requiredWidgets.forEach(widget => {
        if (!widget.condition) {
          warnings.push(`${widget.name} may not be visible due to authentication or data state`);
        }
      });

      setValidationWarnings(warnings);

      if (warnings.length > 0) {
        console.warn('PersonalizedExplorePage Widget Validation:', warnings);
      }
    }
  }, [isAuthenticated, userStats]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
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
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Development Mode Validation Panel */}
        {process.env.NODE_ENV === 'development' && validationWarnings.length > 0 && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800">Widget Validation Warnings</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-yellow-700 text-sm space-y-1">
                {validationWarnings.map((warning, i) => (
                  <li key={i}>• {warning}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Your Personalized Experience
          </h1>
          <p className="text-muted-foreground">
            Discover amazing mocktails and experiences tailored just for you.
          </p>
        </div>

        {/* Quick Actions - Always Visible */}
        <div className="mb-8">
          <QuickActionCards />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Column - Wider (3/4 on XL screens) */}
          <div className="xl:col-span-3 space-y-6">
            {/* Quick Stats Row - Only show when authenticated and userStats available */}
            {isAuthenticated && userStats && (
              <div className="mb-6">
                <QuickStatsWidget
                  totalMocktailsTried={userStats.totalMocktailsTried}
                  totalPoints={userStats.totalPoints}
                  currentStreak={userStats.currentStreak}
                />
              </div>
            )}

            {/* Rewards and Streak Row */}
            {isAuthenticated && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <RewardsHighlightWidget />
                <StreakMotivationWidget />
              </div>
            )}

            {/* Recommendations */}
            <RecommendationsWidget
              recommendations={recommendations}
              isLoading={recommendationsLoading}
              activeCategory={activeCategory}
              setActiveCategory={handleCategoryChange}
              onSave={saveRecommendation}
              onDismiss={dismissRecommendation}
              onShare={shareRecommendation}
            />

            {/* Nearby Establishments */}
            <NearbyEstablishmentsWidget establishments={nearbyEstablishments} />
          </div>

          {/* Right Column - Narrower (1/4 on XL screens) */}
          <div className="space-y-6">
            {/* Activity Feed - Show when authenticated */}
            {isAuthenticated && (
              <ActivityFeedWidget 
                activities={convertedActivities.length > 0 ? convertedActivities : activities} 
                isLoading={activitiesLoading} 
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
