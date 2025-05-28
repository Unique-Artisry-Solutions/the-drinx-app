import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { QuickStatsWidget } from '@/components/explore/personalized/QuickStatsWidget';
import { QuickActionCards } from '@/components/explore/personalized/QuickActionCards';
import { RecommendationsWidget } from '@/components/explore/personalized/RecommendationsWidget';
import ActivityFeedWidget from '@/components/explore/personalized/ActivityFeedWidget';
import { NearbyEstablishmentsWidget } from '@/components/explore/personalized/NearbyEstablishmentsWidget';
import { UpcomingEventsWidget } from '@/components/explore/personalized/UpcomingEventsWidget';
import StreakMotivationWidget from '@/components/explore/personalized/StreakMotivationWidget';
import RewardsHighlightWidget from '@/components/rewards/RewardsHighlightWidget';

const Explore: React.FC = () => {
  // Mock data for demo
  const isMobile = useIsMobile();
  
  // Mock data for demo
  const mockData = {
    totalMocktailsTried: 12,
    totalPoints: 1250,
    currentStreak: 5
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-md mx-auto space-y-6">
          <QuickStatsWidget {...mockData} />
          <StreakMotivationWidget />
          <RewardsHighlightWidget />
          <ActivityFeedWidget />
          <NearbyEstablishmentsWidget />
          <UpcomingEventsWidget />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <QuickStatsWidget {...mockData} />
            <ActivityFeedWidget />
          </div>
          
          <div className="space-y-6">
            <StreakMotivationWidget />
            <RewardsHighlightWidget />
            <NearbyEstablishmentsWidget />
            <UpcomingEventsWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
