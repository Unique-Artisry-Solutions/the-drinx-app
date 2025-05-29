
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import EstablishmentCard from '@/components/EstablishmentCard';
import CocktailCard from '@/components/CocktailCard';
import ViewModeToggle from '@/components/ViewModeToggle';
import { ViewMode } from '@/types/ExploreTypes';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import { useRecentActivity } from '@/hooks/useRecentActivity';
import QuickStatsWidget from '@/components/explore/personalized/QuickStatsWidget';
import RewardsHighlightWidget from '@/components/explore/personalized/RewardsHighlightWidget';
import StreakMotivationWidget from '@/components/explore/personalized/StreakMotivationWidget';
import ActivityFeedWidget from '@/components/explore/personalized/ActivityFeedWidget';
import NearbyEstablishmentsWidget from '@/components/explore/personalized/NearbyEstablishmentsWidget';
import UpcomingEventsWidget from '@/components/explore/personalized/UpcomingEventsWidget';
import RecommendationsWidget from '@/components/explore/personalized/RecommendationsWidget';

const Explore: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  // Get personalized data
  const {
    loading: personalizedDataLoading,
    isAuthenticated,
    userStats,
    recommendations,
    nearbyEstablishments,
    upcomingEvents
  } = usePersonalizedData();

  // Get activity data
  const {
    data: activities = [],
    isLoading: activitiesLoading
  } = useRecentActivity();

  // Mock data for establishments and cocktails
  const establishments = [
    {
      id: '1',
      name: 'The Spiritless Bar',
      address: '123 Main St, Downtown',
      rating: 4.8,
      cocktailCount: 25,
      image: '/api/placeholder/300/200',
      distance: '0.3 miles'
    },
    {
      id: '2',
      name: 'Zero Proof Lounge',
      address: '456 Oak Ave, Midtown',
      rating: 4.6,
      cocktailCount: 18,
      image: '/api/placeholder/300/200',
      distance: '0.7 miles'
    }
  ];

  const cocktails = [
    {
      id: '1',
      name: 'Virgin Mojito Supreme',
      establishment: 'The Spiritless Bar',
      rating: 4.9,
      image: '/api/placeholder/300/300',
      ingredients: ['Fresh mint', 'Lime juice', 'Club soda', 'Simple syrup']
    },
    {
      id: '2',
      name: 'Elderflower Fizz',
      establishment: 'Zero Proof Lounge',
      rating: 4.7,
      image: '/api/placeholder/300/300',
      ingredients: ['Elderflower cordial', 'Lemon juice', 'Sparkling water']
    }
  ];

  const filteredEstablishments = establishments.filter(establishment =>
    establishment.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCocktails = cocktails.filter(cocktail =>
    cocktail.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-spiritless-pink to-spiritless-orange bg-clip-text text-transparent">
            Explore Spiritless
          </h1>
          <p className="text-material-on-surface-variant text-lg">
            Discover amazing mocktails and alcohol-free experiences near you
          </p>
        </div>

        {/* Quick Stats Widget - Show for all users */}
        <div className="mb-6">
          <QuickStatsWidget />
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search establishments or cocktails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
              <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {personalizedDataLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-spiritless-pink mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading your personalized content...</p>
          </div>
        )}

        {/* Main Content Layout - Two Column with Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - Left 3 Columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Recommendations Widget */}
            <RecommendationsWidget
              recommendations={recommendations}
              onRecommendationClick={(id) => console.log('Recommendation clicked:', id)}
            />

            {/* Establishments Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Nearby Establishments</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEstablishments.map((establishment) => (
                  <EstablishmentCard key={establishment.id} establishment={establishment} />
                ))}
              </div>
            </section>

            {/* Nearby Establishments Widget - Only show if authenticated */}
            {isAuthenticated && !personalizedDataLoading && (
              <NearbyEstablishmentsWidget establishments={nearbyEstablishments} />
            )}

            {/* Recent Activity - Center of layout */}
            <ActivityFeedWidget activities={activities} isLoading={activitiesLoading} />

            {/* Cocktails Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Featured Mocktails</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCocktails.map((cocktail) => (
                  <CocktailCard key={cocktail.id} cocktail={cocktail} />
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar - Personal Widgets */}
          <div className="space-y-6">
            {/* Personal Widgets Stack - Only show if authenticated */}
            {isAuthenticated && !personalizedDataLoading && (
              <>
                <RewardsHighlightWidget
                  totalPoints={userStats?.totalPoints || 1250}
                  currentTier="Silver"
                  nextTier="Gold"
                  progressToNextTier={83}
                />
                <StreakMotivationWidget />
              </>
            )}
            
            {/* Upcoming Events - Only show if authenticated */}
            {isAuthenticated && !personalizedDataLoading && (
              <UpcomingEventsWidget events={upcomingEvents} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
