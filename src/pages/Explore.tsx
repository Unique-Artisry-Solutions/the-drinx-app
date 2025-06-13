
import React, { useState } from 'react';
import { useEstablishments } from '@/hooks/useEstablishments';
import CategoryTabs from '@/components/CategoryTabs';
import FeaturedEstablishmentsSection from '@/components/explore/FeaturedEstablishmentsSection';
import CocktailsSection from '@/components/explore/CocktailsSection';
import EventsSection from '@/components/explore/EventsSection';
import BarCrawlSection from '@/components/explore/BarCrawlSection';
import SwigCircuitsSection from '@/components/explore/SwigCircuitsSection';
import PromoterSection from '@/components/explore/PromoterSection';
import { ViewModeToggle } from '@/components/ViewModeToggle';
import { ViewMode } from '@/types/ExploreTypes';
import { useAuth } from '@/hooks/useAuth';

type CategoryType = 'popular' | 'trending' | 'new' | 'personalized' | 'swig-circuits' | 'promoters';

const Explore: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('popular');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const { establishments, isLoading } = useEstablishments();
  const { isAuthenticated } = useAuth();

  // Mock data for sections that need it
  const mockCocktails = [
    {
      id: '1',
      name: 'Virgin Mojito',
      price: '$8.99',
      description: 'Fresh mint, lime, and sparkling water',
      ingredients: ['Mint', 'Lime', 'Sparkling Water'],
      establishment: { id: 'est1', name: 'The Green Bar', distance: '0.5 mi' }
    },
    {
      id: '2',
      name: 'Cucumber Cooler',
      price: '$9.50',
      description: 'Refreshing cucumber and elderflower',
      ingredients: ['Cucumber', 'Elderflower', 'Soda'],
      establishment: { id: 'est2', name: 'Fresh & Co', distance: '0.8 mi' }
    }
  ];

  const mockBarCrawls = [
    { id: '1', name: 'Downtown Sober Circuit', stops: 4 },
    { id: '2', name: 'Artisan Mocktail Tour', stops: 6 },
    { id: '3', name: 'Wellness Weekend', stops: 3 }
  ];

  const resetFilters = () => {
    // Reset any applied filters
    console.log('Filters reset');
  };

  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case 'popular':
        return (
          <div className="space-y-6">
            <FeaturedEstablishmentsSection establishments={establishments} />
            <CocktailsSection cocktails={mockCocktails} resetFilters={resetFilters} />
            <EventsSection />
          </div>
        );
      
      case 'trending':
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">Trending Now</h2>
              <p className="text-muted-foreground">Most popular establishments and cocktails this week</p>
            </div>
            <FeaturedEstablishmentsSection establishments={establishments.slice(0, 3)} />
            <CocktailsSection cocktails={mockCocktails.slice(0, 4)} resetFilters={resetFilters} />
          </div>
        );
      
      case 'new':
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">What's New</h2>
              <p className="text-muted-foreground">Recently added establishments and cocktails</p>
            </div>
            <FeaturedEstablishmentsSection establishments={establishments.slice(0, 2)} />
            <CocktailsSection cocktails={mockCocktails.slice(0, 3)} resetFilters={resetFilters} />
          </div>
        );
      
      case 'personalized':
        if (!isAuthenticated) {
          return (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Sign In for Personalized Recommendations</h2>
              <p className="text-muted-foreground">Create an account to see content tailored just for you</p>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">For You</h2>
              <p className="text-muted-foreground">Personalized recommendations based on your preferences</p>
            </div>
            <FeaturedEstablishmentsSection establishments={establishments.slice(0, 4)} />
            <CocktailsSection cocktails={mockCocktails} resetFilters={resetFilters} />
          </div>
        );
      
      case 'swig-circuits':
        return (
          <div className="space-y-6">
            <BarCrawlSection barCrawls={mockBarCrawls} isAuthenticated={isAuthenticated} />
            <SwigCircuitsSection />
          </div>
        );
      
      case 'promoters':
        return (
          <div className="space-y-6">
            <PromoterSection />
            <EventsSection />
          </div>
        );
      
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Explore</h1>
              <p className="text-muted-foreground">Discover amazing mocktails and venues</p>
            </div>
            <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
          
          <CategoryTabs 
            selectedCategory={selectedCategory} 
            onCategoryChange={setSelectedCategory} 
          />
        </div>
        
        <div className="space-y-6">
          {renderCategoryContent()}
        </div>
      </div>
    </div>
  );
};

export default Explore;
