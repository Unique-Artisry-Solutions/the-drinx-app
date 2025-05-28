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
import { Badge } from '@/components/ui/badge';
import { UserStats, ViewMode } from '@/types/ExploreTypes';
import { NotificationService } from '@/services/NotificationService';
import { OfflineService } from '@/services/OfflineService';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';

const Explore: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('personalized');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [queuedActions, setQueuedActions] = useState(OfflineService.getQueuedActions());
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

  useEffect(() => {
    // Listen for online/offline events
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Subscribe to notification service
    const unsubscribe = NotificationService.subscribe((notifications) => {
      // Handle notifications if needed
    });

    // Update queued actions periodically
    const interval = setInterval(() => {
      setQueuedActions(OfflineService.getQueuedActions());
    }, 1000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Explore</h1>
              <p className="text-muted-foreground">Discover new experiences, track your journey</p>
            </div>
            
            {/* Connection status */}
            <div className="flex items-center gap-2">
              {isOffline ? (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <WifiOff className="h-3 w-3" />
                  Offline
                </Badge>
              ) : (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Wifi className="h-3 w-3" />
                  Online
                </Badge>
              )}
              
              {queuedActions.length > 0 && (
                <Badge variant="secondary">
                  {queuedActions.length} queued
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Offline banner */}
        <AnimatePresence>
          {isOffline && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <div className="flex items-center gap-2 text-yellow-800">
                <WifiOff className="h-5 w-5" />
                <div>
                  <p className="font-medium">You're currently offline</p>
                  <p className="text-sm">Some features may be limited. Actions will sync when you reconnect.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
