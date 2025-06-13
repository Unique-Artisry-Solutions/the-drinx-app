import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid, List, Map as MapIcon } from 'lucide-react';
import { QuickStatsWidget } from '@/components/explore/QuickStatsWidget';
import { QuickActionCards } from '@/components/explore/QuickActionCards';
import SearchFilter from '@/components/SearchFilter';
import { NearbyEstablishmentsWidget } from '@/components/explore/NearbyEstablishmentsWidget';
import { UpcomingEventsWidget } from '@/components/explore/UpcomingEventsWidget';
import { RewardsHighlightWidget } from '@/components/explore/RewardsHighlightWidget';
import StreakMotivationWidget from '@/components/explore/StreakMotivationWidget';
import { EstablishmentList } from '@/components/EstablishmentList';
import { ViewModeToggle } from '@/components/ViewModeToggle';
import { ViewMode } from '@/types/explore';
import { useEstablishments } from '@/hooks/useEstablishments';
import { useAuth } from '@/contexts/auth';
import { useGeolocation } from '@/hooks/useGeolocation';
import { QuickAction } from '@/types/explore';
import { toast } from 'sonner';

interface Location {
  latitude: number;
  longitude: number;
}

const Explore: React.FC = () => {
  const { user } = useAuth();
  const { location } = useGeolocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filters, setFilters] = useState({});

  const {
    establishments,
    isLoading,
    error,
    filterEstablishments,
    performSearch
  } = useEstablishments({
    latitude: location?.latitude,
    longitude: location?.longitude,
    searchTerm
  });

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    filterEstablishments(query);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    performSearch();
  };

  // Mock user stats
  const userStats = {
    totalMocktailsTried: 23,
    totalPoints: 1250,
    currentStreak: 5,
    establishmentsVisited: 8,
    favoriteEstablishments: 3
  };

  // Create quick actions array
  const quickActions: QuickAction[] = [
    {
      id: 'checkin',
      title: 'Check In Nearby',
      description: 'Find and check into nearby establishments',
      iconName: 'MapPin',
      color: 'bg-blue-500',
      isEnabled: true,
      onClick: async () => {
        toast.info('Finding nearby establishments...');
      }
    },
    {
      id: 'events',
      title: 'Find Events',
      description: 'Discover upcoming mocktail events',
      iconName: 'Search',
      color: 'bg-green-500',
      isEnabled: true,
      onClick: async () => {
        toast.info('Searching for events...');
      }
    },
    {
      id: 'recipe',
      title: 'Create Recipe',
      description: 'Share your mocktail creation',
      iconName: 'Plus',
      color: 'bg-purple-500',
      isEnabled: true,
      onClick: async () => {
        toast.info('Opening recipe creator...');
      }
    },
    {
      id: 'crawl',
      title: 'Start Bar Crawl',
      description: 'Begin a new adventure',
      iconName: 'Users',
      color: 'bg-orange-500',
      isEnabled: true,
      onClick: async () => {
        toast.info('Starting bar crawl...');
      }
    },
    {
      id: 'share',
      title: 'Share Achievement',
      description: 'Celebrate your progress',
      iconName: 'Share',
      color: 'bg-pink-500',
      isEnabled: true,
      onClick: async () => {
        toast.info('Sharing achievement...');
      }
    },
    {
      id: 'friends',
      title: 'Find Friends',
      description: 'Connect with other enthusiasts',
      iconName: 'UserPlus',
      color: 'bg-indigo-500',
      isEnabled: true,
      onClick: async () => {
        toast.info('Finding friends...');
      }
    }
  ];

  // Convert establishments for nearby widget with proper fallbacks
  const nearbyEstablishments = establishments.map(est => ({
    id: est.id,
    name: est.name,
    description: est.description || est.bio || 'A great place to enjoy mocktails',
    distance: est.distance || '0.0 mi',
    rating: est.rating || 4.0,
    isOpen: est.isOpen ?? true
  }));

  // Convert establishments for main list (ensure required properties)
  const establishmentList = establishments.map(est => ({
    ...est,
    cocktailCount: est.cocktailCount || 0,
    description: est.description || est.bio || 'A great establishment'
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Search and Filter Section */}
        <div className="mb-6">
          <SearchFilter
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            initialSearchTerm={searchTerm}
            cocktails={[]}
            establishments={establishmentList}
          />
        </div>

        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Stats and Actions */}
            <div className="lg:col-span-2 space-y-6">
              <QuickStatsWidget {...userStats} />
              <QuickActionCards actions={quickActions} />
            </div>

            {/* Right Column - Widgets */}
            <div className="space-y-6">
              <StreakMotivationWidget />
              <RewardsHighlightWidget />
              <NearbyEstablishmentsWidget establishments={nearbyEstablishments} />
              <UpcomingEventsWidget />
            </div>
          </div>
        )}

        {/* Establishments Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {searchTerm ? `Search Results for "${searchTerm}"` : 'Discover Places'}
            </h2>
            <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>

          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <Grid className="h-4 w-4" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-2">
                <MapIcon className="h-4 w-4" />
                Map
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="mt-6">
              <EstablishmentList
                establishments={establishmentList}
                isLoading={isLoading}
                error={error}
                viewMode="list"
                userLocation={location ? { 
                  latitude: location.latitude, 
                  longitude: location.longitude 
                } : undefined}
              />
            </TabsContent>

            <TabsContent value="grid" className="mt-6">
              <EstablishmentList
                establishments={establishmentList}
                isLoading={isLoading}
                error={error}
                viewMode="grid"
                userLocation={location ? { 
                  latitude: location.latitude, 
                  longitude: location.longitude 
                } : undefined}
              />
            </TabsContent>

            <TabsContent value="map" className="mt-6">
              <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Map view coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Explore;
