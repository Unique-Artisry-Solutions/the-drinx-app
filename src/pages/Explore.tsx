
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Search, Plus, Clock, Star, Users } from 'lucide-react';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import { QuickStatsWidget } from '@/components/explore/personalized/QuickStatsWidget';
import { RewardsHighlightWidget } from '@/components/explore/personalized/RewardsHighlightWidget';
import { ActivityFeedWidget } from '@/components/explore/personalized/ActivityFeedWidget';
import { RecommendationsWidget } from '@/components/explore/personalized/RecommendationsWidget';
import { NearbyEstablishmentsWidget } from '@/components/explore/personalized/NearbyEstablishmentsWidget';
import { UpcomingEventsWidget } from '@/components/explore/personalized/UpcomingEventsWidget';
import { StreakMotivationWidget } from '@/components/explore/personalized/StreakMotivationWidget';
import { QuickActionCards } from '@/components/explore/personalized/QuickActionCards';

const ExplorePage: React.FC = () => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Welcome to Explore</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Sign in to discover personalized recommendations, track your progress, and connect with the community.
            </p>
            <Button className="w-full">
              Sign In to Explore
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore</h1>
          <p className="text-lg text-gray-600">Discover your next great mocktail adventure</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <QuickActionCards actions={quickActions} />
        </div>

        {/* Personalized Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Stats */}
          {userStats && (
            <div className="lg:col-span-3">
              <QuickStatsWidget 
                totalMocktailsTried={userStats.totalMocktailsTried}
                totalPoints={userStats.totalPoints}
                currentStreak={userStats.currentStreak}
              />
            </div>
          )}

          {/* Streak Motivation */}
          <StreakMotivationWidget />

          {/* Rewards Highlight */}
          {userStats && (
            <RewardsHighlightWidget 
              totalPoints={userStats.totalPoints}
              currentTier="Silver"
              nextTier="Gold"
              progressToNextTier={83}
            />
          )}

          {/* Activity Feed */}
          <ActivityFeedWidget activities={recentActivity} />

          {/* Recommendations */}
          <RecommendationsWidget recommendations={recommendations} />

          {/* Nearby Establishments */}
          <NearbyEstablishmentsWidget establishments={nearbyEstablishments} />

          {/* Upcoming Events */}
          <UpcomingEventsWidget events={upcomingEvents} />
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
