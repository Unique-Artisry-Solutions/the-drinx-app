import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { QuickStatsWidget } from '@/components/explore/QuickStatsWidget';
import { QuickActionCards } from '@/components/explore/QuickActionCards';
import { UpcomingEventsWidget } from '@/components/explore/UpcomingEventsWidget';
import { RewardsHighlightWidget } from '@/components/explore/RewardsHighlightWidget';
import { NearbyEstablishmentsWidget } from '@/components/explore/NearbyEstablishmentsWidget';
import StreakMotivationWidget from '@/components/explore/StreakMotivationWidget';
import PromoterSection from '@/components/explore/PromoterSection';
import FeaturedEstablishmentsSection from '@/components/explore/FeaturedEstablishmentsSection';
import CocktailsSection from '@/components/explore/CocktailsSection';
import EventsSection from '@/components/explore/EventsSection';
import BarCrawlSection from '@/components/explore/BarCrawlSection';
import SwigCircuitsSection from '@/components/explore/SwigCircuitsSection';
import CategoryTabs from '@/components/CategoryTabs';
import { useEnhancedQuickActions } from '@/hooks/useEnhancedQuickActions';
import { UserStats } from '@/types/ExploreTypes';

const mockUserStats: UserStats = {
  totalMocktailsTried: 42,
  totalPoints: 1785,
  currentStreak: 14,
  establishmentsVisited: 28,
  favoriteEstablishments: 5,
};

const Explore: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('personalized');
  const quickActions = useEnhancedQuickActions();

  return (
    <div className="container mx-auto py-6">
      <CategoryTabs
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {selectedCategory === 'personalized' && isLoggedIn ? (
            <>
              <QuickStatsWidget {...mockUserStats} />
              <QuickActionCards actions={quickActions} />
              <UpcomingEventsWidget />
              <RewardsHighlightWidget />
              <NearbyEstablishmentsWidget />
              <StreakMotivationWidget />
            </>
          ) : selectedCategory === 'popular' ? (
            <>
              <FeaturedEstablishmentsSection />
              <CocktailsSection />
              <EventsSection />
            </>
          ) : selectedCategory === 'trending' ? (
            <>
              <BarCrawlSection />
              <SwigCircuitsSection />
            </>
          ) : selectedCategory === 'new' ? (
            <>
              <FeaturedEstablishmentsSection />
              <CocktailsSection />
            </>
          ) : selectedCategory === 'swig-circuits' ? (
            <SwigCircuitsSection />
          ) : selectedCategory === 'promoters' ? (
            <PromoterSection />
          ) : (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  Select a category to explore
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-6">
          <PromoterSection />
        </div>
      </div>
    </div>
  );
};

export default Explore;
