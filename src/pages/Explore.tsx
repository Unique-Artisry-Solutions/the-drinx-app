
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
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <FeaturedEstablishmentsSection />
          <CocktailsSection />
          <EventsSection />
          <BarCrawlSection />
          
          {/* Nearby Places */}
          <div className="space-y-6">
            <NearbyEstablishmentsWidget />
            
            {/* Recent Activity - moved here underneath nearby places */}
            <ActivityFeedWidget />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:w-80 space-y-6">
          <QuickStatsWidget />
          <RecommendationsWidget />
          <UpcomingEventsWidget />
        </div>
      </div>
    </div>
  );
};

export default Explore;
