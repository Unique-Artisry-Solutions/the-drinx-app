
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, List, Grid3X3, Star, TrendingUp, Users, Calendar } from 'lucide-react';
import ViewModeToggle from '@/components/ViewModeToggle';
import CategoryTabs from '@/components/CategoryTabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CocktailsSection from '@/components/explore/CocktailsSection';
import SwigCircuitsSection from '@/components/explore/SwigCircuitsSection';
import PromoterDiscoverySection from '@/components/explore/PromoterDiscoverySection';
import { QuickStatsWidget } from '@/components/explore/personalized/QuickStatsWidget';
import QuickActionCards from '@/components/explore/personalized/QuickActionCards';
import RewardsHighlightWidget from '@/components/explore/personalized/RewardsHighlightWidget';
import StreakMotivationWidget from '@/components/explore/personalized/StreakMotivationWidget';
import { NearbyEstablishmentsWidget } from '@/components/explore/personalized/NearbyEstablishmentsWidget';
import { UpcomingEventsWidget } from '@/components/explore/personalized/UpcomingEventsWidget';
import { usePersonalizedRecommendations } from '@/hooks/usePersonalizedRecommendations';

type CategoryType = 'popular' | 'trending' | 'new' | 'personalized' | 'swig-circuits' | 'promoters';
type ViewMode = 'map' | 'list' | 'grid';

const Explore: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('popular');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);

  const { recommendations } = usePersonalizedRecommendations();

  // Fetch cocktails based on category
  const { data: cocktails = [], isLoading: cocktailsLoading } = useQuery({
    queryKey: ['cocktails', selectedCategory, searchQuery, locationFilter, priceRange],
    queryFn: async () => {
      let query = supabase.from('cocktails').select(`
        *,
        establishment:establishments(*)
      `);

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      const { data, error } = await query.limit(20);
      if (error) throw error;

      return data?.map(cocktail => ({
        id: cocktail.id,
        name: cocktail.name,
        price: cocktail.price || '$12',
        description: cocktail.description || 'Delicious cocktail',
        ingredients: cocktail.ingredients || [],
        image: cocktail.image_url,
        establishment: {
          id: cocktail.establishment?.id || '',
          name: cocktail.establishment?.name || 'Unknown',
          distance: '0.5 miles'
        }
      })) || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const resetFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setPriceRange([0, 50]);
  };

  const renderMainContent = () => {
    switch (selectedCategory) {
      case 'swig-circuits':
        return <SwigCircuitsSection />;
      case 'promoters':
        return <PromoterDiscoverySection />;
      case 'popular':
      case 'trending':
      case 'new':
      case 'personalized':
      default:
        return (
          <CocktailsSection 
            cocktails={cocktails} 
            resetFilters={resetFilters}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Explore</h1>
              <p className="text-muted-foreground">Discover new experiences and connect with the community</p>
            </div>
            <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b bg-card/30">
        <div className="container mx-auto px-4 py-2">
          <CategoryTabs 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Quick Stats */}
            <div className="mb-6">
              <QuickStatsWidget
                totalMocktailsTried={47}
                totalPoints={2340}
                currentStreak={12}
              />
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <QuickActionCards />
            </div>

            {/* Category Content */}
            {renderMainContent()}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Rewards Highlight */}
            <RewardsHighlightWidget />

            {/* Streak Motivation */}
            <StreakMotivationWidget />

            {/* Nearby Establishments */}
            <NearbyEstablishmentsWidget />

            {/* Upcoming Events */}
            <UpcomingEventsWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
