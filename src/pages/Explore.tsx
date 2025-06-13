import React, { useState, useMemo } from 'react';
import { ViewModeToggle } from '@/components/ViewModeToggle';
import { SearchFilter } from '@/components/SearchFilter';
import EstablishmentList from '@/components/EstablishmentList';
import { QuickStatsWidget } from '@/components/explore/QuickStatsWidget';
import { QuickActionCards } from '@/components/explore/QuickActionCards';
import { UpcomingEventsWidget } from '@/components/explore/UpcomingEventsWidget';
import { RewardsHighlightWidget } from '@/components/explore/RewardsHighlightWidget';
import StreakMotivationWidget from '@/components/explore/StreakMotivationWidget';
import { NearbyEstablishmentsWidget } from '@/components/explore/NearbyEstablishmentsWidget';
import { ActivityFeedWidget } from '@/components/explore/personalized/ActivityFeedWidget';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import { ViewMode, QuickAction, RealtimeActivity } from '@/types/explore';

const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const { 
    loading, 
    isAuthenticated, 
    userStats, 
    recentActivity 
  } = usePersonalizedData();

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Find Nearby',
      description: 'Discover establishments near you',
      iconName: 'MapPin',
      color: 'bg-blue-500',
      isEnabled: true,
      onClick: () => console.log('Find nearby clicked')
    },
    {
      id: '2',
      title: 'Search Drinks',
      description: 'Find your perfect mocktail',
      iconName: 'Search',
      color: 'bg-green-500',
      isEnabled: true,
      onClick: () => console.log('Search drinks clicked')
    },
    {
      id: '3',
      title: 'Add Review',
      description: 'Share your experience',
      iconName: 'Plus',
      color: 'bg-purple-500',
      isEnabled: isAuthenticated,
      onClick: () => console.log('Add review clicked')
    },
    {
      id: '4',
      title: 'Join Events',
      description: 'Connect with community',
      iconName: 'Users',
      color: 'bg-orange-500',
      isEnabled: true,
      onClick: () => console.log('Join events clicked')
    }
  ];

  const filteredEstablishments = useMemo(() => {
    const mockEstablishments = [
      { id: '1', name: 'The Mocktail Lounge', location: 'Downtown', rating: 4.8 },
      { id: '2', name: 'Sober Social Club', location: 'Midtown', rating: 4.5 },
      { id: '3', name: 'Zero Proof Kitchen', location: 'Uptown', rating: 4.6 }
    ];

    if (!searchQuery) return mockEstablishments;
    return mockEstablishments.filter(est => 
      est.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      est.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const convertToRealtimeActivity = (activity: any): RealtimeActivity => ({
    id: activity.id,
    type: activity.type,
    title: activity.title,
    description: activity.description,
    timestamp: activity.timestamp,
    user: activity.user,
    likes: activity.likes || 0,
    isLiked: activity.isLiked || false,
    metadata: activity.metadata || {}
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-3xl font-bold text-purple-700">Explore</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchFilter onSearch={setSearchQuery} />
          <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>
      </div>

      {/* Quick Actions - Always Visible */}
      <QuickActionCards actions={quickActions} />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Column - Main Content */}
        <div className="xl:col-span-3 space-y-6">
          {/* Stats Row - Only for Authenticated Users */}
          {isAuthenticated && userStats && (
            <QuickStatsWidget
              totalMocktailsTried={userStats.totalMocktailsTried}
              totalPoints={userStats.totalPoints}
              currentStreak={userStats.currentStreak}
            />
          )}

          {/* Rewards and Streak Row - Only for Authenticated Users */}
          {isAuthenticated && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RewardsHighlightWidget
                totalPoints={userStats?.totalPoints}
                currentTier="Silver"
                nextTier="Gold"
                progressToNextTier={83}
              />
              <StreakMotivationWidget />
            </div>
          )}

          {/* Establishments List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {searchQuery ? `Search Results (${filteredEstablishments.length})` : 'Nearby Establishments'}
            </h2>
            <EstablishmentList
              establishments={filteredEstablishments}
              viewMode={viewMode}
            />
          </div>

          {/* Nearby Places Widget */}
          <NearbyEstablishmentsWidget />
        </div>

        {/* Right Column - Activity & Events */}
        <div className="xl:col-span-1 space-y-6">
          {/* Activity Feed - Only for Authenticated Users */}
          {isAuthenticated && recentActivity && recentActivity.length > 0 && (
            <ActivityFeedWidget 
              activities={recentActivity.map(convertToRealtimeActivity)}
            />
          )}
          
          {/* Upcoming Events */}
          <UpcomingEventsWidget />
        </div>
      </div>
    </div>
  );
};

export default Explore;
