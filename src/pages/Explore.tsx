
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Search, Plus, Clock, Star, Users } from 'lucide-react';
import { ViewMode, RecommendationCategory } from '@/types/ExploreTypes';
import { ViewModeToggle } from '@/components/ViewModeToggle';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import { QuickStatsWidget } from '@/components/explore/personalized/QuickStatsWidget';
import { RewardsHighlightWidget } from '@/components/explore/personalized/RewardsHighlightWidget';
import { ActivityFeedWidget } from '@/components/explore/personalized/ActivityFeedWidget';
import { TabbedRecommendationsWidget } from '@/components/explore/personalized/TabbedRecommendationsWidget';
import { NearbyEstablishmentsWidget } from '@/components/explore/personalized/NearbyEstablishmentsWidget';
import { UpcomingEventsWidget } from '@/components/explore/personalized/UpcomingEventsWidget';
import StreakMotivationWidget from '@/components/explore/personalized/StreakMotivationWidget';
import { QuickActionCards } from '@/components/explore/personalized/QuickActionCards';

const ExplorePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
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
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header - Full width */}
        <div className="bg-blue-500 text-white p-6 rounded-lg text-center">
          <h1 className="text-4xl font-bold mb-2">Explore</h1>
          <p className="text-lg mb-4">Discover new places, drinks, and experiences</p>
          <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>

        {/* Grid Layout matching the image */}
        <div className="grid grid-cols-12 gap-4 h-auto">
          {/* Item 6 - Large green block (spans 12 cols, height ~300px) */}
          <div className="col-span-12 bg-emerald-500 text-white p-6 rounded-lg min-h-[300px] flex flex-col justify-center">
            <div className="text-center">
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-white/30 rounded-full"></div>
                ))}
              </div>
              <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
              <QuickActionCards actions={quickActions} />
            </div>
          </div>

          {/* Item 8 - Large blue block (spans 8 cols) */}
          <div className="col-span-12 md:col-span-8 bg-blue-500 text-white p-6 rounded-lg min-h-[300px]">
            <div className="text-center mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-white/30 rounded-full"></div>
                ))}
              </div>
              <h2 className="text-xl font-bold mb-4">Personalized Recommendations</h2>
            </div>
            <TabbedRecommendationsWidget recommendations={recommendations} />
          </div>

          {/* Item 3 - Tall orange block (spans 4 cols) */}
          <div className="col-span-12 md:col-span-4 bg-orange-300 text-white p-6 rounded-lg min-h-[300px]">
            <div className="text-center mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-white/30 rounded-full"></div>
                ))}
              </div>
              <h2 className="text-lg font-bold mb-4">Your Stats</h2>
            </div>
            {userStats && (
              <QuickStatsWidget 
                totalMocktailsTried={userStats.totalMocktailsTried}
                totalPoints={userStats.totalPoints}
                currentStreak={userStats.currentStreak}
              />
            )}
          </div>

          {/* Bottom row with three items */}
          {/* Item 5 - Purple block */}
          <div className="col-span-12 md:col-span-4 bg-purple-600 text-white p-6 rounded-lg min-h-[250px]">
            <div className="text-center mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-white/30 rounded-full"></div>
                ))}
              </div>
              <h2 className="text-lg font-bold mb-4">Your Rewards</h2>
            </div>
            {userStats && (
              <RewardsHighlightWidget 
                totalPoints={userStats.totalPoints}
                currentTier="Silver"
                nextTier="Gold"
                progressToNextTier={83}
              />
            )}
          </div>

          {/* Item 6 - Brown block */}
          <div className="col-span-12 md:col-span-4 bg-amber-800 text-white p-6 rounded-lg min-h-[250px]">
            <div className="text-center mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-white/30 rounded-full"></div>
                ))}
              </div>
              <h2 className="text-lg font-bold mb-4">Streak Motivation</h2>
            </div>
            <StreakMotivationWidget />
          </div>

          {/* Item 4 - Green block */}
          <div className="col-span-12 md:col-span-4 bg-green-600 text-white p-6 rounded-lg min-h-[250px]">
            <div className="text-center mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-white/30 rounded-full"></div>
                ))}
              </div>
              <h2 className="text-lg font-bold mb-4">Nearby Places</h2>
            </div>
            <NearbyEstablishmentsWidget establishments={nearbyEstablishments} />
          </div>

          {/* Item 7 - Full width orange block */}
          <div className="col-span-12 bg-orange-500 text-white p-6 rounded-lg min-h-[200px]">
            <div className="text-center mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-white/30 rounded-full"></div>
                ))}
              </div>
              <h2 className="text-xl font-bold mb-4">Recent Activity & Events</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ActivityFeedWidget activities={recentActivity} />
              <UpcomingEventsWidget events={upcomingEvents} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
