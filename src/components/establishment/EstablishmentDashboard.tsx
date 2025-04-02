
import React from 'react';
import MetricsVisualization from './MetricsVisualization';
import KeyMetricsCards from './KeyMetricsCards';
import PendingActionsCard from './PendingActionsCard';
import DashboardHeader from './DashboardHeader';
import ActivitiesSection from './ActivitiesSection';
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
      
      {/* Activities and Pending Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Recent Activity - now a separate component */}
        <ActivitiesSection />
        
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
