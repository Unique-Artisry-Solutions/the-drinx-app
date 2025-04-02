
import React from 'react';
import { Button } from '@/components/ui/button';
import MetricsVisualization from './MetricsVisualization';
import KeyMetricsCards from './KeyMetricsCards';
import RecentActivityCard from './RecentActivityCard';
import PendingActionsCard from './PendingActionsCard';
import DashboardHeader from './DashboardHeader';
import { useDashboardData } from '@/hooks/useDashboardData';

interface EstablishmentDashboardProps {
  establishmentName: string;
}

const EstablishmentDashboard: React.FC<EstablishmentDashboardProps> = ({ establishmentName }) => {
  // Use our custom hook to get all dashboard data
  const { 
    stats, 
    visitorData, 
    ratingData, 
    mocktailData, 
    recentActivity,
    isLoading 
  } = useDashboardData();
  
  if (isLoading) {
    return (
      <div className="animate-fade-in vibrant-bg p-4 space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in vibrant-bg p-4 space-y-6">
      {/* Dashboard Header */}
      <DashboardHeader establishmentName={establishmentName} />
      
      {/* Key Metrics Cards */}
      <KeyMetricsCards stats={stats} />
      
      {/* Metrics Visualization */}
      <MetricsVisualization 
        returningRate={stats.returningRate}
        visitorData={visitorData}
        ratingData={ratingData}
        mocktailData={mocktailData}
      />
      
      {/* Quick Actions & Pending Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <RecentActivityCard activities={recentActivity} />
        
        {/* Pending Actions */}
        <PendingActionsCard 
          pendingBarCrawls={stats.pendingBarCrawls} 
          pendingReviews={stats.reviewsThisWeek} 
        />
      </div>
    </div>
  );
};

export default EstablishmentDashboard;
