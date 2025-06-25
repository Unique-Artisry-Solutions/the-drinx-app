
import React from 'react';
import { ActivityFeedWidget } from './personalized/ActivityFeedWidget';
import { QuickStatsWidget } from './personalized/QuickStatsWidget';
import { QuickActionCards } from './personalized/QuickActionCards';
import { NearbyEstablishmentsWidget } from './personalized/NearbyEstablishmentsWidget';
import { UpcomingEventsWidget } from './personalized/UpcomingEventsWidget';
import { RewardsHighlightWidget } from './personalized/RewardsHighlightWidget';
import StreakMotivationWidget from './personalized/StreakMotivationWidget';
import { NearbyCheckInModal } from './NearbyCheckInModal';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import { useNearbyCheckIns } from '@/hooks/useNearbyCheckIns';
import { useNavigate } from 'react-router-dom';

const PersonalizedExploreSection: React.FC = () => {
  const { quickActions, quickStats, activities, nearbyEstablishments, upcomingEvents } = usePersonalizedData();
  const navigate = useNavigate();
  
  const {
    isModalOpen,
    closeModal,
    nearbyEstablishments: nearbyCheckInEstablishments,
    isLoading,
    hasError,
    isCheckingIn,
    handleCheckIn
  } = useNearbyCheckIns();

  const handleViewMap = () => {
    closeModal();
    navigate('/establishments');
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats Section */}
      <QuickStatsWidget 
        totalMocktailsTried={quickStats.totalMocktailsTried}
        totalPoints={quickStats.totalPoints}
        currentStreak={quickStats.currentStreak}
      />

      {/* Quick Actions Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <QuickActionCards actions={quickActions} />
      </div>

      {/* Activity Feed */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <ActivityFeedWidget activities={activities} />
      </div>

      {/* Two-column layout for additional widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Nearby Establishments */}
          <NearbyEstablishmentsWidget establishments={nearbyEstablishments} />
          
          {/* Rewards Highlight */}
          <RewardsHighlightWidget />
        </div>
        
        <div className="space-y-6">
          {/* Upcoming Events */}
          <UpcomingEventsWidget events={upcomingEvents} />
          
          {/* Streak Motivation */}
          <StreakMotivationWidget />
        </div>
      </div>

      {/* Nearby Check-in Modal */}
      <NearbyCheckInModal
        isOpen={isModalOpen}
        onClose={closeModal}
        establishments={nearbyCheckInEstablishments}
        isLoading={isLoading}
        hasError={hasError}
        isCheckingIn={isCheckingIn}
        onCheckIn={handleCheckIn}
        onViewMap={handleViewMap}
      />
    </div>
  );
};

export default PersonalizedExploreSection;
