
import React, { useState } from 'react';
import MetricsVisualization from './MetricsVisualization';
import KeyMetricsCards from './KeyMetricsCards';
import PendingActionsCard from './PendingActionsCard';
import DashboardHeader from './DashboardHeader';
import ActivitiesSection from './ActivitiesSection';
import AppFooter from '@/components/AppFooter';
import { useDashboardData } from '@/hooks/useDashboardData';
import DrinkProfileModal, { Drink } from './DrinkProfileModal';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface EstablishmentDashboardProps {
  establishmentName: string;
}

const EstablishmentDashboard: React.FC<EstablishmentDashboardProps> = ({ establishmentName }) => {
  const [isAddMocktailModalOpen, setIsAddMocktailModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Use our custom hook to get all dashboard data
  const { 
    stats, 
    visitorData, 
    ratingData, 
    mocktailData,
    barCrawlData,
    isLoading 
  } = useDashboardData();
  
  const handleAddMocktail = (drink: Drink) => {
    // Here you would call an API to save the mocktail
    toast({
      title: "Mocktail added",
      description: `${drink.name} has been added to your menu.`,
    });
    setIsAddMocktailModalOpen(false);
  };
  
  const handleViewAllRatings = () => {
    navigate('/establishment/reviews');
  };
  
  const handleViewAllAnalytics = () => {
    navigate('/establishment/analytics');
  };
  
  if (isLoading) {
    return (
      <div className="animate-fade-in vibrant-bg p-6 space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  // Check if we have data for visitor metrics visualization
  const hasEnoughDataForVisualization = visitorData.length > 0 && ratingData.length > 0;

  return (
    <>
      <div className="animate-fade-in vibrant-bg p-6 space-y-8 max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <DashboardHeader 
          establishmentName={establishmentName} 
          onAddMocktail={() => setIsAddMocktailModalOpen(true)}
        />
        
        {/* Key Metrics Cards */}
        <div className="my-8">
          <KeyMetricsCards 
            stats={stats} 
            onViewAllRatings={handleViewAllRatings}
            onViewAllAnalytics={handleViewAllAnalytics}
          />
        </div>
        
        {/* Pending Actions - Full width horizontal */}
        <div className="mb-6">
          <PendingActionsCard 
            pendingBarCrawls={stats.pendingBarCrawls} 
            pendingReviews={stats.reviewsThisWeek} 
          />
        </div>
        
        {/* Main Content: Metrics Visualization (full width) */}
        <div className="mb-8">
          {hasEnoughDataForVisualization ? (
            <MetricsVisualization 
              returningRate={stats.returningRate}
              visitorData={visitorData}
              ratingData={ratingData}
              mocktailData={mocktailData}
              barCrawlData={barCrawlData}
            />
          ) : (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <CircleSlash className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">Not enough data for visualization</h3>
              <p className="text-material-on-surface-variant mb-4">
                Start gathering more data to see detailed metrics and visualizations here.
              </p>
            </div>
          )}
        </div>
        
        {/* Recent Activity - Full width section */}
        <div className="mb-8">
          <ActivitiesSection />
        </div>
      </div>
      
      {/* Include the AppFooter */}
      <AppFooter />
      
      {/* Add Mocktail Modal */}
      <DrinkProfileModal
        isOpen={isAddMocktailModalOpen}
        onClose={() => setIsAddMocktailModalOpen(false)}
        drink={null}
        onSave={handleAddMocktail}
      />
    </>
  );
};

export default EstablishmentDashboard;
