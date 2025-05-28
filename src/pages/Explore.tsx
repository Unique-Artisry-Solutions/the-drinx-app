
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { QuickStatsWidget } from '@/components/explore/personalized/QuickStatsWidget';
import { QuickActionCards } from '@/components/explore/personalized/QuickActionCards';
import { RecommendationsWidget } from '@/components/explore/personalized/RecommendationsWidget';
import ActivityFeedWidget from '@/components/explore/personalized/ActivityFeedWidget';
import { NearbyEstablishmentsWidget } from '@/components/explore/personalized/NearbyEstablishmentsWidget';
import { UpcomingEventsWidget } from '@/components/explore/personalized/UpcomingEventsWidget';
import StreakMotivationWidget from '@/components/explore/personalized/StreakMotivationWidget';
import RewardsHighlightWidget from '@/components/rewards/RewardsHighlightWidget';
import ViewModeToggle from '@/components/ViewModeToggle';
import { ViewMode } from '@/types/ExploreTypes';
import { useEnhancedQuickActions } from '@/hooks/useEnhancedQuickActions';
import { usePersonalizedRecommendations } from '@/hooks/usePersonalizedRecommendations';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import DevBypassLinks from '@/components/development/DevBypassLinks';

const Explore: React.FC = () => {
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { isLoading, handleActionClick, actions } = useEnhancedQuickActions();
  const { 
    recommendations, 
    saveRecommendation, 
    dismissRecommendation, 
    shareRecommendation 
  } = usePersonalizedRecommendations();
  
  // Mock data for demo
  const mockData = {
    totalMocktailsTried: 12,
    totalPoints: 1250,
    currentStreak: 5
  };

  // Mock quick actions data
  const quickActions = [
    {
      id: 'check-in',
      title: 'Check In',
      description: 'Check in nearby',
      icon: '📍',
      color: 'bg-blue-500',
      isEnabled: true,
      onClick: actions.checkInNearby
    },
    {
      id: 'find-events',
      title: 'Find Events',
      description: 'Discover events',
      icon: '🎉',
      color: 'bg-purple-500',
      isEnabled: true,
      onClick: actions.findEvents
    },
    {
      id: 'create-recipe',
      title: 'Create Recipe',
      description: 'Share a recipe',
      icon: '🍹',
      color: 'bg-green-500',
      isEnabled: true,
      onClick: actions.createRecipe
    }
  ];

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search establishments, events, cocktails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-center">
            <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>

          <QuickStatsWidget {...mockData} />
          
          {/* Quick Actions */}
          <QuickActionCards 
            actions={quickActions}
            onActionClick={handleActionClick}
            isLoading={isLoading}
          />
          
          <StreakMotivationWidget />
          
          {/* Recommended for you */}
          <RecommendationsWidget 
            recommendations={recommendations}
            onSave={saveRecommendation}
            onDismiss={dismissRecommendation}
            onShare={shareRecommendation}
          />
          
          <RewardsHighlightWidget />
          <ActivityFeedWidget />
          <NearbyEstablishmentsWidget />
          <UpcomingEventsWidget />
          
          {/* Dev Tools */}
          <DevBypassLinks />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search establishments, events, cocktails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-8">
          <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <QuickStatsWidget {...mockData} />
            
            {/* Quick Actions */}
            <QuickActionCards 
              actions={quickActions}
              onActionClick={handleActionClick}
              isLoading={isLoading}
            />
            
            <ActivityFeedWidget />
          </div>
          
          <div className="space-y-6">
            {/* Recommended for you */}
            <RecommendationsWidget 
              recommendations={recommendations}
              onSave={saveRecommendation}
              onDismiss={dismissRecommendation}
              onShare={shareRecommendation}
            />
            
            <StreakMotivationWidget />
            <RewardsHighlightWidget />
            <NearbyEstablishmentsWidget />
            <UpcomingEventsWidget />
          </div>
        </div>
        
        {/* Dev Tools */}
        <DevBypassLinks />
      </div>
    </div>
  );
};

export default Explore;
