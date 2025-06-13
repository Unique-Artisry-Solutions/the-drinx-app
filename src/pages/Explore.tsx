import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Map, List, Grid, Search, Filter } from 'lucide-react';
import SearchFilter from '@/components/SearchFilter';
import MapView from '@/components/map/MapView';
import { useUserLocation } from '@/hooks/useUserLocation';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import { useNearbyEstablishments } from '@/hooks/useNearbyEstablishments';
import { QuickStatsWidget } from '@/components/explore/QuickStatsWidget';
import { QuickActionCards } from '@/components/explore/QuickActionCards';
import { RewardsHighlightWidget } from '@/components/explore/RewardsHighlightWidget';
import { StreakMotivationWidget } from '@/components/explore/StreakMotivationWidget';
import { NearbyEstablishmentsWidget } from '@/components/explore/NearbyEstablishmentsWidget';
import { UpcomingEventsWidget } from '@/components/explore/UpcomingEventsWidget';
import { ViewMode } from '@/types/explore';
import { useIsMobile } from '@/hooks/use-mobile';

interface EstablishmentWithDistanceTemp {
  id: string;
  name: string;
  address: string;
  distance: string;
  latitude: number;
  longitude: number;
  image?: string;
}

const Explore: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const { userLocation, refreshLocation, isLoading: isLoadingLocation } = useUserLocation();
  const { data: nearbyEstablishments } = useNearbyEstablishments(userLocation, 10);
  const { 
    loading, 
    isAuthenticated, 
    userStats, 
    quickActions, 
    recentActivity 
  } = usePersonalizedData();
  
  const isMobile = useIsMobile();

  // Transform establishments to match widget expectations
  const transformedEstablishments = nearbyEstablishments?.map(est => ({
    id: est.id,
    name: est.name,
    description: est.address || 'Local establishment', // Use address as fallback description
    distance: est.distance,
    rating: 4.5, // Default rating since not in the source data
    isOpen: true, // Default to open since not in the source data
    imageUrl: est.image
  })) || [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
  };

  const renderViewModeButton = (mode: ViewMode, icon: React.ReactNode, label: string) => (
    <Button
      key={mode}
      variant={viewMode === mode ? 'default' : 'outline'}
      size="sm"
      onClick={() => setViewMode(mode)}
      className="flex items-center gap-2"
    >
      {icon}
      {!isMobile && <span>{label}</span>}
    </Button>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your personalized experience...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Explore</h1>
          <p className="text-muted-foreground">
            Discover mocktails, establishments, and connect with the community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <SearchFilter 
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            placeholder="Search establishments, mocktails..."
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            {renderViewModeButton('map', <Map className="h-4 w-4" />, 'Map')}
            {renderViewModeButton('list', <List className="h-4 w-4" />, 'List')}
            {renderViewModeButton('grid', <Grid className="h-4 w-4" />, 'Grid')}
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'map' && (
          <div className="h-96 rounded-lg overflow-hidden">
            <MapView 
              establishments={nearbyEstablishments || []}
              userLocation={userLocation}
              onRefreshLocation={refreshLocation}
              isLoadingLocation={isLoadingLocation}
            />
          </div>
        )}

        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Quick Stats & Actions */}
            <div className="space-y-6">
              {isAuthenticated && userStats && (
                <QuickStatsWidget 
                  totalMocktailsTried={userStats.totalMocktailsTried}
                  totalPoints={userStats.totalPoints}
                  currentStreak={userStats.currentStreak}
                />
              )}
              
              {quickActions && quickActions.length > 0 && (
                <QuickActionCards actions={quickActions} />
              )}
            </div>
            
            {/* Middle Column - Main Content */}
            <div className="space-y-6">
              <NearbyEstablishmentsWidget establishments={transformedEstablishments} />
              <UpcomingEventsWidget />
            </div>
            
            {/* Right Column - Rewards & Social */}
            <div className="space-y-6">
              {isAuthenticated && (
                <>
                  <RewardsHighlightWidget />
                  <StreakMotivationWidget />
                </>
              )}
            </div>
          </div>
        )}

        {viewMode === 'list' && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <List className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">List View</h3>
                <p>Detailed list view coming soon!</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Explore;
