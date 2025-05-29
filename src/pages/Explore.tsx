
import React from 'react';
import FeaturedEstablishmentsSection from '@/components/explore/FeaturedEstablishmentsSection';
import CocktailsSection from '@/components/explore/CocktailsSection';
import EventsSection from '@/components/explore/EventsSection';
import BarCrawlSection from '@/components/explore/BarCrawlSection';
import { NearbyEstablishmentsWidget } from '@/components/explore/personalized/NearbyEstablishmentsWidget';
import { ActivityFeedWidget } from '@/components/explore/personalized/ActivityFeedWidget';
import { QuickStatsWidget } from '@/components/explore/personalized/QuickStatsWidget';
import { RecommendationsWidget } from '@/components/explore/personalized/RecommendationsWidget';
import { UpcomingEventsWidget } from '@/components/explore/personalized/UpcomingEventsWidget';

const Explore: React.FC = () => {
  // Mock data for the components
  const mockEstablishments = [
    { id: '1', name: 'The Mocktail Lounge', address: '123 Main St', cocktailCount: 12, distance: '0.3 miles' },
    { id: '2', name: 'Sober Social Club', address: '456 Oak Ave', cocktailCount: 8, distance: '0.7 miles' }
  ];

  const mockCocktails = [
    { 
      id: '1', 
      name: 'Virgin Mojito', 
      price: '$8', 
      description: 'Fresh mint and lime', 
      ingredients: ['mint', 'lime', 'soda water'],
      establishment: { id: '1', name: 'The Mocktail Lounge', distance: '0.3 miles' }
    }
  ];

  const mockBarCrawls = [
    { id: '1', name: 'Downtown Swig Circuit', stops: 4 },
    { id: '2', name: 'Weekend Explorer', stops: 3 }
  ];

  const resetFilters = () => {
    // Mock function for resetting filters
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <FeaturedEstablishmentsSection establishments={mockEstablishments} />
          <CocktailsSection cocktails={mockCocktails} resetFilters={resetFilters} />
          <EventsSection />
          <BarCrawlSection barCrawls={mockBarCrawls} isAuthenticated={true} />
          
          {/* Nearby Places */}
          <div className="space-y-6">
            <NearbyEstablishmentsWidget />
            
            {/* Recent Activity - moved here underneath nearby places */}
            <ActivityFeedWidget />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:w-80 space-y-6">
          <QuickStatsWidget totalMocktailsTried={12} totalPoints={1250} currentStreak={5} />
          <RecommendationsWidget />
          <UpcomingEventsWidget />
        </div>
      </div>
    </div>
  );
};

export default Explore;
