
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import MapView from '@/components/map/MapView';
import { SearchFilter } from '@/components/SearchFilter';
import { ViewModeToggle } from '@/components/ViewModeToggle';
import { QuickStatsWidget } from '@/components/explore/QuickStatsWidget';
import { UpcomingEventsWidget } from '@/components/explore/UpcomingEventsWidget';
import { NearbyEstablishmentsWidget } from '@/components/explore/NearbyEstablishmentsWidget';
import StreakMotivationWidget from '@/components/explore/StreakMotivationWidget';
import RewardsHighlightWidget from '@/components/explore/RewardsHighlightWidget';
import { QuickActionCards } from '@/components/explore/QuickActionCards';
import { ViewMode, QuickAction } from '@/types/explore';
import { useEstablishments } from '@/hooks/useEstablishments';
import { useEnhancedQuickActions } from '@/hooks/useEnhancedQuickActions';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import { useGeolocation } from '@/hooks/useGeolocation';
import { EstablishmentCard } from '@/types/CoreTypes';

const ExplorePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('popular');

  const { latitude, longitude } = useGeolocation();
  const { establishments, isLoading: establishmentsLoading } = useEstablishments({
    latitude,
    longitude,
    searchTerm
  });

  const { actions, handleActionClick, isLoading: actionsLoading } = useEnhancedQuickActions();
  const { 
    loading: personalizedLoading, 
    userStats, 
    isAuthenticated 
  } = usePersonalizedData();

  // Create proper QuickAction array
  const quickActions: QuickAction[] = [
    {
      id: 'check-in',
      title: 'Check In Nearby',
      description: 'Find and check into nearby establishments',
      iconName: 'MapPin',
      color: 'bg-blue-500',
      isEnabled: true,
      onClick: actions.checkInNearby
    },
    {
      id: 'find-events',
      title: 'Find Events',
      description: 'Discover upcoming events in your area',
      iconName: 'Search',
      color: 'bg-green-500',
      isEnabled: true,
      onClick: actions.findEvents
    },
    {
      id: 'create-recipe',
      title: 'Create Recipe',
      description: 'Share your favorite mocktail recipe',
      iconName: 'Plus',
      color: 'bg-purple-500',
      isEnabled: true,
      onClick: actions.createRecipe
    },
    {
      id: 'start-bar-crawl',
      title: 'Start Bar Crawl',
      description: 'Plan a route through multiple venues',
      iconName: 'Users',
      color: 'bg-orange-500',
      isEnabled: true,
      onClick: actions.startBarCrawl
    }
  ];

  // Convert establishments to the format expected by widgets
  const nearbyEstablishments = establishments.map(est => ({
    id: est.id,
    name: est.name,
    description: est.description || est.bio || 'Great establishment for mocktails',
    distance: est.distance || '0.0 mi',
    rating: 4.5, // Default rating since it's not in the establishment data
    isOpen: true // Default to open since we don't have this data
  }));

  const renderContent = () => {
    if (viewMode === 'map') {
      return (
        <div className="h-[600px] w-full rounded-lg overflow-hidden">
          <MapView 
            establishments={establishments}
            userLocation={latitude && longitude ? { lat: latitude, lng: longitude } : undefined}
          />
        </div>
      );
    }

    // Grid view with personalized widgets
    return (
      <div className="space-y-6">
        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <QuickActionCards actions={quickActions} />
        </div>

        {/* Personalized widgets for authenticated users */}
        {isAuthenticated && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stats Widget */}
            {userStats && (
              <QuickStatsWidget
                totalMocktailsTried={userStats.totalMocktailsTried || 0}
                totalPoints={userStats.totalPoints || 0}
                currentStreak={userStats.currentStreak || 0}
              />
            )}
            
            {/* Streak Motivation */}
            <StreakMotivationWidget />
            
            {/* Rewards Highlight */}
            <RewardsHighlightWidget />
            
            {/* Nearby Establishments */}
            <NearbyEstablishmentsWidget establishments={nearbyEstablishments} />
            
            {/* Upcoming Events */}
            <UpcomingEventsWidget />
          </div>
        )}

        {/* For non-authenticated users, show basic widgets */}
        {!isAuthenticated && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NearbyEstablishmentsWidget establishments={nearbyEstablishments} />
            <UpcomingEventsWidget />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Explore</h1>
        
        {/* Search and Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search establishments, events, or mocktails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="nearby">Nearby</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="circuits">Swig Circuits</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      {renderContent()}
    </div>
  );
};

export default ExplorePage;
