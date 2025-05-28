
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Users, TrendingUp, Search, Filter } from 'lucide-react';
import SearchInput from '@/components/search/SearchInput';
import FilterPanel from '@/components/search/FilterPanel';
import EstablishmentList from '@/components/EstablishmentList';
import AllCocktails from '@/components/home/AllCocktails';
import BarCrawlSection from '@/components/explore/BarCrawlSection';
import EventsSection from '@/components/explore/EventsSection';
import FeaturedEstablishmentsSection from '@/components/explore/FeaturedEstablishmentsSection';
import CocktailsSection from '@/components/explore/CocktailsSection';
import AchievementProximityAlerts from '@/components/rewards/AchievementProximityAlerts';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';

const Explore: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const { 
    loading,
    userStats,
    recentActivity,
    recommendations,
    isAuthenticated
  } = usePersonalizedData();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Explore
          </h1>
          <p className="text-muted-foreground">
            Discover amazing mocktails, venues, and experiences in your area
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <SearchInput
                placeholder="Search venues, cocktails, or events..."
                onSearch={handleSearch}
                className="w-full"
              />
            </div>
            <Button
              variant="outline"
              onClick={toggleFilters}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
          
          {showFilters && (
            <FilterPanel onFilterChange={() => {}} />
          )}
        </div>

        {/* Quick Stats for Authenticated Users */}
        {isAuthenticated && !loading && userStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{userStats.totalVisits}</div>
                <div className="text-sm text-muted-foreground">Venues Visited</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{userStats.totalMocktailsTried}</div>
                <div className="text-sm text-muted-foreground">Mocktails Tried</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{userStats.totalPoints}</div>
                <div className="text-sm text-muted-foreground">Points Earned</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{userStats.currentStreak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="venues">Venues</TabsTrigger>
                <TabsTrigger value="cocktails">Cocktails</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-8">
                <FeaturedEstablishmentsSection />
                <CocktailsSection />
                <BarCrawlSection />
                <EventsSection />
              </TabsContent>

              <TabsContent value="venues">
                <EstablishmentList searchTerm={searchTerm} />
              </TabsContent>

              <TabsContent value="cocktails">
                <AllCocktails searchTerm={searchTerm} />
              </TabsContent>

              <TabsContent value="events">
                <EventsSection />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievement Proximity Alerts - No achievements prop needed */}
            <AchievementProximityAlerts />

            {/* Trending Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending Now
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="font-medium">Virgin Mojito Revival</div>
                  <div className="text-sm text-muted-foreground">Popular at 12 venues</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Sunset Strip Tour</div>
                  <div className="text-sm text-muted-foreground">New bar crawl route</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Mocktail Monday</div>
                  <div className="text-sm text-muted-foreground">Weekly event series</div>
                </div>
              </CardContent>
            </Card>

            {/* Location-based Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Near You
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="font-medium">The Herb Garden</div>
                  <div className="text-sm text-muted-foreground">0.3 miles • 4.8★</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Citrus & Sage</div>
                  <div className="text-sm text-muted-foreground">0.7 miles • 4.6★</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Fresh & Pure</div>
                  <div className="text-sm text-muted-foreground">1.2 miles • 4.9★</div>
                </div>
                <Button variant="outline" className="w-full">
                  View All Nearby
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
