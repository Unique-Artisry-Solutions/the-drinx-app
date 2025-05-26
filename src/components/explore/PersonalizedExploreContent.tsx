
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import QuickStatsWidget from './widgets/QuickStatsWidget';
import RecentActivityWidget from './widgets/RecentActivityWidget';
import PersonalizedRecommendations from './widgets/PersonalizedRecommendations';
import QuickActionCards from './widgets/QuickActionCards';
import NearbyEstablishments from './widgets/NearbyEstablishments';
import UpcomingEvents from './widgets/UpcomingEvents';
import LoadingDashboard from './widgets/LoadingDashboard';

const PersonalizedExploreContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    userStats, 
    recentActivity, 
    recommendations, 
    nearbyEstablishments,
    upcomingEvents,
    isLoading 
  } = usePersonalizedData();

  if (isLoading) {
    return <LoadingDashboard />;
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Welcome to Swig!</h2>
          <p className="text-muted-foreground mb-6">
            Sign in to get personalized recommendations and track your activity
          </p>
          <QuickActionCards showAuthPrompt={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl space-y-6">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.user_metadata?.display_name || 'Swig Explorer'}!
        </h1>
        <p className="text-muted-foreground">
          Discover new experiences tailored just for you
        </p>
      </div>

      {/* Quick Stats Row */}
      <QuickStatsWidget stats={userStats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Primary Content */}
        <div className="lg:col-span-2 space-y-6">
          <PersonalizedRecommendations recommendations={recommendations} />
          <UpcomingEvents events={upcomingEvents} />
        </div>

        {/* Right Column - Secondary Content */}
        <div className="space-y-6">
          <QuickActionCards />
          <RecentActivityWidget activities={recentActivity} />
          <NearbyEstablishments establishments={nearbyEstablishments} />
        </div>
      </div>
    </div>
  );
};

export default PersonalizedExploreContent;
