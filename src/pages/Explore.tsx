
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Grid, List } from 'lucide-react';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import { useIsMobile } from '@/hooks/use-mobile';

// Import widgets with defensive fallbacks
import { QuickStatsWidget } from '@/components/explore/personalized/QuickStatsWidget';
import { RecommendationsWidget } from '@/components/explore/personalized/RecommendationsWidget';
import { ActivityFeedWidget } from '@/components/explore/personalized/ActivityFeedWidget';
import { QuickActionCards } from '@/components/explore/personalized/QuickActionCards';
import { RewardsHighlightWidget } from '@/components/explore/personalized/RewardsHighlightWidget';
import StreakMotivationWidget from '@/components/explore/personalized/StreakMotivationWidget';
import { NearbyEstablishmentsWidget } from '@/components/explore/personalized/NearbyEstablishmentsWidget';
import { UpcomingEventsWidget } from '@/components/explore/personalized/UpcomingEventsWidget';

const Explore: React.FC = () => {
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'grid'>('grid');
  const isMobile = useIsMobile();
  
  const {
    loading = false,
    userStats = null,
    recentActivity = [],
    recommendations = [],
    quickActions = [],
    nearbyEstablishments = [],
    upcomingEvents = [],
    isAuthenticated = false
  } = usePersonalizedData() ?? {};

  // Loading state with skeleton
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // Safely transform activity data with fallbacks
  const transformedActivity = (recentActivity ?? []).map(activity => ({
    ...activity,
    user: typeof activity?.user === 'string' 
      ? { id: activity.user, name: activity.user } 
      : activity?.user ?? { id: 'unknown', name: 'Unknown User' },
    likes: activity?.likes ?? 0,
    isLiked: activity?.isLiked ?? false
  }));

  // Safely extract stats with defaults
  const safeUserStats = {
    totalMocktailsTried: userStats?.totalMocktailsTried ?? 0,
    totalPoints: userStats?.totalPoints ?? 0,
    currentStreak: userStats?.currentStreak ?? 0
  };

  const handleViewModeChange = (mode: 'map' | 'list' | 'grid') => {
    setViewMode(mode);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header with defensive checks */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Explore</h1>
            <p className="text-muted-foreground">
              Discover new places, drinks, and experiences
            </p>
          </div>
          
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewModeChange('map')}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Map
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewModeChange('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewModeChange('grid')}
            >
              <Grid className="h-4 w-4 mr-2" />
              Grid
            </Button>
          </div>
        </div>

        {/* Mobile Layout */}
        {isMobile ? (
          <div className="space-y-6">
            {isAuthenticated && userStats && (
              <QuickStatsWidget {...safeUserStats} />
            )}
            <QuickActionCards actions={quickActions ?? []} />
            <RecommendationsWidget recommendations={recommendations ?? []} />
            <ActivityFeedWidget activities={transformedActivity} isLoading={loading} />
            {isAuthenticated && (
              <>
                <RewardsHighlightWidget />
                <StreakMotivationWidget />
              </>
            )}
            <NearbyEstablishmentsWidget establishments={nearbyEstablishments ?? []} />
            <UpcomingEventsWidget events={upcomingEvents ?? []} />
          </div>
        ) : (
          /* Desktop Layout */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Side - Main Content (3 columns) */}
            <div className="lg:col-span-3 space-y-6">
              {isAuthenticated && userStats && (
                <QuickStatsWidget {...safeUserStats} />
              )}
              <QuickActionCards actions={quickActions ?? []} />
              <RecommendationsWidget recommendations={recommendations ?? []} />
              <ActivityFeedWidget activities={transformedActivity} isLoading={loading} />
            </div>

            {/* Right Side - Sidebar (1 column) */}
            <div className="space-y-6">
              {isAuthenticated && (
                <>
                  <RewardsHighlightWidget />
                  <StreakMotivationWidget />
                </>
              )}
              <NearbyEstablishmentsWidget establishments={nearbyEstablishments ?? []} />
              <UpcomingEventsWidget events={upcomingEvents ?? []} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Explore;
