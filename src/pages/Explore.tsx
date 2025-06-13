
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SearchFilter from '@/components/SearchFilter';
import { ViewModeToggle } from '@/components/ViewModeToggle';
import { MapView } from '@/components/map/MapView';
import { useEstablishments } from '@/hooks/useEstablishments';
import { useIsMobile } from '@/hooks/use-mobile';
import { QuickStatsWidget } from '@/components/explore/QuickStatsWidget';
import { QuickActionCards } from '@/components/explore/QuickActionCards';
import { UpcomingEventsWidget } from '@/components/explore/UpcomingEventsWidget';
import { RewardsHighlightWidget } from '@/components/explore/RewardsHighlightWidget';
import StreakMotivationWidget from '@/components/explore/StreakMotivationWidget';
import { NearbyEstablishmentsWidget } from '@/components/explore/NearbyEstablishmentsWidget';
import { ViewMode, QuickAction } from '@/types/explore';
import { Establishment } from '@/types/CoreTypes';

const ExplorePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const isMobile = useIsMobile();

  const { 
    establishments, 
    isLoading, 
    error, 
    filterEstablishments,
    performSearch
  } = useEstablishments({
    latitude: userLocation?.latitude,
    longitude: userLocation?.longitude,
    searchTerm
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    filterEstablishments(query);
  };

  const handleFilterChange = (filters: any) => {
    console.log('Filter changed:', filters);
  };

  const handleApplyFilters = () => {
    performSearch();
  };

  // Mock user stats for the widgets
  const userStats = {
    totalMocktailsTried: 42,
    totalPoints: 1250,
    currentStreak: 7,
    establishmentsVisited: 15,
    favoriteEstablishments: 8
  };

  // Mock quick actions
  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Find Nearby',
      description: 'Discover establishments near you',
      iconName: 'MapPin',
      color: 'bg-blue-500',
      isEnabled: true,
      onClick: () => setViewMode('map')
    },
    {
      id: '2',
      title: 'Search Drinks',
      description: 'Find your favorite mocktails',
      iconName: 'Search',
      color: 'bg-green-500',
      isEnabled: true,
      onClick: () => console.log('Search drinks')
    },
    {
      id: '3',
      title: 'Add Favorite',
      description: 'Save places you love',
      iconName: 'Plus',
      color: 'bg-purple-500',
      isEnabled: true,
      onClick: () => console.log('Add favorite')
    }
  ];

  // Convert establishments to the format expected by NearbyEstablishmentsWidget
  const nearbyEstablishments = establishments.slice(0, 3).map(est => ({
    id: est.id,
    name: est.name,
    description: est.description || 'Great mocktail selection',
    distance: est.distance || '0.5 miles',
    rating: 4.5,
    isOpen: true
  }));

  const renderContent = () => {
    if (viewMode === 'map') {
      return (
        <div className="h-[600px] w-full">
          <MapView 
            establishments={establishments}
            userLocation={userLocation}
          />
        </div>
      );
    }

    // Grid view with personalized widgets
    return (
      <div className="space-y-6">
        {/* Personalized Widgets Grid */}
        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
          {/* Left Column - Stats and Actions */}
          <div className="space-y-6">
            <QuickStatsWidget
              totalMocktailsTried={userStats.totalMocktailsTried}
              totalPoints={userStats.totalPoints}
              currentStreak={userStats.currentStreak}
            />
            <QuickActionCards actions={quickActions} />
          </div>

          {/* Middle Column - Activity and Events */}
          <div className="space-y-6">
            <StreakMotivationWidget />
            <UpcomingEventsWidget />
          </div>

          {/* Right Column - Rewards and Nearby */}
          <div className="space-y-6">
            <RewardsHighlightWidget />
            <NearbyEstablishmentsWidget establishments={nearbyEstablishments} />
          </div>
        </div>

        {/* Establishments List */}
        {establishments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>All Establishments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {establishments.map((establishment) => (
                  <div key={establishment.id} className="p-4 border rounded-lg">
                    <h3 className="font-semibold">{establishment.name}</h3>
                    <p className="text-sm text-muted-foreground">{establishment.address}</p>
                    {establishment.distance && (
                      <p className="text-xs text-blue-600">{establishment.distance}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <SearchFilter
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            initialSearchTerm={searchTerm}
            establishments={establishments}
          />
        </div>
        <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="py-6">
            <p className="text-center text-red-600">
              Error loading establishments: {error.message}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      {!isLoading && !error && renderContent()}
    </div>
  );
};

export default ExplorePage;
