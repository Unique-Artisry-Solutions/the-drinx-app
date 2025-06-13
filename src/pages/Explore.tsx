
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MapView from '@/components/map/MapView';
import SearchFilter from '@/components/SearchFilter';
import ViewModeToggle from '@/components/ViewModeToggle';
import { useEstablishments } from '@/hooks/useEstablishments';
import { QuickStatsWidget } from '@/components/explore/QuickStatsWidget';
import { QuickActionCards } from '@/components/explore/QuickActionCards';
import { UpcomingEventsWidget } from '@/components/explore/UpcomingEventsWidget';
import StreakMotivationWidget from '@/components/explore/StreakMotivationWidget';
import { RewardsHighlightWidget } from '@/components/explore/RewardsHighlightWidget';
import { NearbyEstablishmentsWidget } from '@/components/explore/NearbyEstablishmentsWidget';
import { ViewMode } from '@/types/explore';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import { useEnhancedQuickActions } from '@/hooks/useEnhancedQuickActions';
import { useRealtimeActivity } from '@/hooks/useRealtimeActivity';

const ExplorePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<string[]>([]);
  
  // Use existing establishments hook instead of non-existent useNearbyEstablishments
  const { establishments, isLoading: establishmentsLoading } = useEstablishments({
    searchTerm: searchQuery
  });
  
  const { 
    loading: personalizedLoading, 
    isAuthenticated, 
    userStats, 
    recentActivity 
  } = usePersonalizedData();
  
  const { actions: quickActions } = useEnhancedQuickActions();
  const { activities: realtimeActivities } = useRealtimeActivity();

  // Convert establishments data for widgets
  const nearbyEstablishments = establishments.map(est => ({
    id: est.id,
    name: est.name,
    description: est.address || 'Local establishment', // Use address as fallback description
    distance: est.distance || 'Unknown distance',
    rating: 4.5, // Default rating since not in establishment data
    isOpen: true // Default to open since we don't have hours data
  }));

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    // Apply filters logic here
    console.log('Applying filters:', filters);
  };

  if (personalizedLoading || establishmentsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading explore content...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Explore</h1>
          <p className="text-muted-foreground">Discover new places, events, and experiences</p>
        </div>
        <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {/* Search and Filters */}
      <div className="w-full">
        <SearchFilter
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onApplyFilters={handleApplyFilters}
          initialSearchTerm={searchQuery}
          cocktails={[]}
          establishments={establishments}
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="personalized" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personalized">For You</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="establishments">Places</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="personalized" className="space-y-6">
          {isAuthenticated ? (
            <>
              {/* Stats and Quick Actions Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <QuickStatsWidget
                    totalMocktailsTried={userStats?.totalMocktailsTried || 0}
                    totalPoints={userStats?.totalPoints || 0}
                    currentStreak={userStats?.currentStreak || 0}
                  />
                </div>
                <div>
                  <StreakMotivationWidget />
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <QuickActionCards actions={quickActions} />
              </div>

              {/* Widgets Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RewardsHighlightWidget
                  totalPoints={userStats?.totalPoints}
                  currentTier="Silver"
                  nextTier="Gold"
                  progressToNextTier={83}
                />
                <NearbyEstablishmentsWidget establishments={nearbyEstablishments} />
                <UpcomingEventsWidget />
              </div>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Welcome to Explore</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Sign in to get personalized recommendations and track your progress.
                </p>
                <Button>Sign In</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="map">
          <div className="h-[600px] rounded-lg overflow-hidden">
            <MapView establishments={establishments} />
          </div>
        </TabsContent>

        <TabsContent value="establishments">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {establishments.map((establishment) => (
              <Card key={establishment.id}>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{establishment.name}</h3>
                  <p className="text-sm text-muted-foreground">{establishment.address}</p>
                  {establishment.distance && (
                    <p className="text-sm text-primary">{establishment.distance}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Events Coming Soon</h3>
            <p className="text-muted-foreground">
              We're working on bringing you exciting events in your area.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExplorePage;
