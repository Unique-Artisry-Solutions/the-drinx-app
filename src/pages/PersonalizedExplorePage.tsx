
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

// Use proper imports
import { MapPin, Calendar, Utensils, Users, Star, Check } from 'lucide-react';

// Import enhanced hooks
import { useEnhancedQuickActions } from '@/hooks/useEnhancedQuickActions';
import { usePersonalizedRecommendations } from '@/hooks/usePersonalizedRecommendations';

const PersonalizedExplorePage: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Use enhanced hooks for proper data
  const { handleActionClick, isLoading: actionsLoading, actions } = useEnhancedQuickActions();
  const { 
    recommendations, 
    isLoading: recommendationsLoading,
    activeCategory,
    setActiveCategory,
    saveRecommendation,
    dismissRecommendation,
    shareRecommendation
  } = usePersonalizedRecommendations();

  // Mock stats data
  const statsData = {
    totalMocktailsTried: 12,
    totalPoints: 1250,
    currentStreak: 5
  };

  // Create enhanced quick actions with proper structure
  const enhancedActions = [
    {
      id: 'check-in',
      title: 'Quick Check-In',
      description: 'Find and check into nearby establishments',
      icon: <MapPin className="h-5 w-5" />,
      color: 'bg-blue-500',
      isEnabled: true,
      requiresAuth: true,
      shortcut: 'C',
      onClick: actions.checkInNearby
    },
    {
      id: 'find-events',
      title: 'Find Events',
      description: 'Discover upcoming events near you',
      icon: <Calendar className="h-5 w-5" />,
      color: 'bg-green-500',
      isEnabled: true,
      requiresAuth: false,
      shortcut: 'E',
      onClick: actions.findEvents
    },
    {
      id: 'create-recipe',
      title: 'Create Recipe',
      description: 'Share your favorite mocktail recipe',
      icon: <Utensils className="h-5 w-5" />,
      color: 'bg-purple-500',
      isEnabled: true,
      requiresAuth: true,
      shortcut: 'R',
      onClick: actions.createRecipe
    },
    {
      id: 'start-crawl',
      title: 'Start Bar Crawl',
      description: 'Begin or join a swig circuit',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-orange-500',
      isEnabled: true,
      requiresAuth: true,
      badge: 'New',
      onClick: actions.startBarCrawl
    },
    {
      id: 'share-achievement',
      title: 'Share Achievement',
      description: 'Show off your latest milestone',
      icon: <Star className="h-5 w-5" />,
      color: 'bg-yellow-500',
      isEnabled: true,
      requiresAuth: true,
      onClick: actions.shareAchievement
    },
    {
      id: 'find-friends',
      title: 'Find Friends',
      description: 'Connect with other swig enthusiasts',
      icon: <Check className="h-5 w-5" />,
      color: 'bg-pink-500',
      isEnabled: true,
      requiresAuth: true,
      onClick: actions.findFriends
    }
  ];

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* Quick Stats */}
          <QuickStatsWidget {...statsData} />
          
          {/* Streak Motivation */}
          <StreakMotivationWidget />
          
          {/* Rewards Highlight */}
          <RewardsHighlightWidget />
          
          {/* Quick Actions */}
          <QuickActionCards 
            actions={enhancedActions}
            onActionClick={handleActionClick}
            isLoading={actionsLoading}
          />
          
          {/* Recommendations */}
          <RecommendationsWidget 
            recommendations={recommendations}
            isLoading={recommendationsLoading}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            onSave={saveRecommendation}
            onDismiss={dismissRecommendation}
            onShare={shareRecommendation}
          />
          
          {/* Activity Feed */}
          <ActivityFeedWidget />
          
          {/* Nearby Establishments */}
          <NearbyEstablishmentsWidget />
          
          {/* Upcoming Events */}
          <UpcomingEventsWidget />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <QuickStatsWidget {...statsData} />
            
            {/* Quick Actions */}
            <QuickActionCards 
              actions={enhancedActions}
              onActionClick={handleActionClick}
              isLoading={actionsLoading}
            />
            
            {/* Recommendations */}
            <RecommendationsWidget 
              recommendations={recommendations}
              isLoading={recommendationsLoading}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              onSave={saveRecommendation}
              onDismiss={dismissRecommendation}
              onShare={shareRecommendation}
            />
            
            {/* Activity Feed */}
            <ActivityFeedWidget />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Streak Motivation */}
            <StreakMotivationWidget />
            
            {/* Rewards Highlight */}
            <RewardsHighlightWidget />
            
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

export default PersonalizedExplorePage;
