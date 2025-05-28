
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SearchInput from '@/components/SearchFilter';
import FilterPanel from '@/components/ViewModeToggle'; 
import EstablishmentList from '@/components/EstablishmentList';
import AllCocktails from '@/components/home/AllCocktails';
import FeaturedEstablishmentsSection from '@/components/explore/FeaturedEstablishmentsSection';
import CocktailsSection from '@/components/explore/CocktailsSection';
import BarCrawlSection from '@/components/explore/BarCrawlSection';
import { QuickStatsWidget } from '@/components/explore/personalized/QuickStatsWidget';
import { QuickActionCards } from '@/components/explore/personalized/QuickActionCards';
import { RecommendationsWidget } from '@/components/explore/personalized/RecommendationsWidget';
import { ActivityFeedWidget } from '@/components/explore/personalized/ActivityFeedWidget';
import { NearbyEstablishmentsWidget } from '@/components/explore/personalized/NearbyEstablishmentsWidget';
import { UpcomingEventsWidget } from '@/components/explore/personalized/UpcomingEventsWidget';
import StreakMotivationWidget from '@/components/explore/personalized/StreakMotivationWidget';
import RewardsHighlightWidget from '@/components/rewards/RewardsHighlightWidget';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserStats, ViewMode } from '@/types/ExploreTypes';

const Explore: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('personalized');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [userStats] = useState<UserStats>({
    totalMocktailsTried: 12,
    totalPoints: 1250,
    currentStreak: 5,
    establishmentsVisited: 8,
    favoriteEstablishments: 3
  });

  // Mock data
  const establishments = [];
  const cocktails = [];
  const barCrawls = [];
  const isAuthenticated = true;

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const resetFilters = () => {
    setSearchTerm('');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Explore</h1>
          <p className="text-muted-foreground">Discover new experiences, track your journey</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchInput 
              onSearch={handleSearch}
              onFilterChange={() => {}}
              onApplyFilters={() => {}}
              className="w-full"
            />
          </div>
          <FilterPanel 
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>

        {/* Main Content */}
        <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personalized">For You</TabsTrigger>
            <TabsTrigger value="establishments">Places</TabsTrigger>
            <TabsTrigger value="cocktails">Drinks</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="personalized" className="space-y-6">
            {/* Personalized Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Widgets */}
              <div className="lg:col-span-2 space-y-6">
                <QuickStatsWidget 
                  totalMocktailsTried={userStats.totalMocktailsTried}
                  totalPoints={userStats.totalPoints}
                  currentStreak={userStats.currentStreak}
                />
                <QuickActionCards actions={[]} />
                <RecommendationsWidget recommendations={[]} />
                <ActivityFeedWidget activities={[]} />
              </div>

              {/* Right Column - Secondary Widgets */}
              <div className="space-y-6">
                <RewardsHighlightWidget />
                <StreakMotivationWidget />
                <NearbyEstablishmentsWidget establishments={[]} />
                <UpcomingEventsWidget events={[]} />
              </div>
            </div>

            {/* Featured Sections */}
            <div className="space-y-6">
              <FeaturedEstablishmentsSection establishments={establishments} />
              <CocktailsSection cocktails={cocktails} resetFilters={resetFilters} />
              <BarCrawlSection barCrawls={barCrawls} isAuthenticated={isAuthenticated} />
            </div>
          </TabsContent>

          <TabsContent value="establishments">
            <EstablishmentList 
              establishments={establishments} 
              selectedEstablishment={null}
              favoriteEstablishments={[]}
              onToggleFavorite={() => {}}
              onEstablishmentClick={() => {}}
            />
          </TabsContent>

          <TabsContent value="cocktails">
            <AllCocktails 
              cocktails={cocktails} 
              onResetFilters={resetFilters}
            />
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Events coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Explore;
