
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
    barCrawlData,
    isLoading 
  } = useDashboardData();
  
  if (isLoading) {
    return (
      <div className="animate-fade-in vibrant-bg p-4 space-y-4">
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in vibrant-bg p-4 space-y-4">
      {/* Dashboard Header */}
      <DashboardHeader establishmentName={establishmentName} />
      
      {/* Key Metrics Cards */}
      <KeyMetricsCards stats={stats} />
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Metrics Visualization - Takes 3/4 of the width on large screens */}
        <div className="lg:col-span-3">
          <MetricsVisualization 
            returningRate={stats.returningRate}
            visitorData={visitorData}
            ratingData={ratingData}
            mocktailData={mocktailData}
            barCrawlData={barCrawlData}
          />
        </div>
        
        {/* Right Side Content - Takes 1/4 of the width on large screens */}
        <div className="lg:col-span-1 space-y-4">
          {/* Pending Actions */}
          <PendingActionsCard 
            pendingBarCrawls={stats.pendingBarCrawls} 
            pendingReviews={stats.reviewsThisWeek} 
          />
          
          {/* Recent Activity */}
          <ActivitiesSection />
        </div>
      </div>
    </div>
  );
};

export default EstablishmentDashboard;
