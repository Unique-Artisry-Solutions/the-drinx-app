
import React, { useState, useEffect } from 'react';
import { CircleSlash } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
import MocktailSuggestionsCard from './MocktailSuggestionsCard';
import { useAuth } from '@/contexts/auth';

// Import our new components
import VisitorStatsTab from './VisitorStatsTab';
import RevenueStatsTab from './RevenueStatsTab';
import DrinkPopularityTab from './DrinkPopularityTab';
import { useEstablishmentAnalytics } from '@/hooks/useEstablishmentAnalytics';
import { recordVisitorSession } from '@/services/establishmentAnalyticsService';

interface EstablishmentDashboardProps {
  establishmentName: string;
  establishmentId: string;
}

const EstablishmentDashboard: React.FC<EstablishmentDashboardProps> = ({ 
  establishmentName,
  establishmentId
}) => {
  const [isAddMocktailModalOpen, setIsAddMocktailModalOpen] = useState(false);
  const [pendingSuggestions, setPendingSuggestions] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Use our custom hook to get all dashboard data
  const { 
    stats, 
    visitorData, 
    ratingData, 
    mocktailData,
    barCrawlData,
    isLoading 
  } = useDashboardData();
  
  // Define date range for analytics
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date()
  });
  
  // Use our new analytics hook
  const {
    visitorAnalytics,
    popularDrinks,
    revenueReports,
    refresh: refreshAnalytics,
    isLoading: isAnalyticsLoading
  } = useEstablishmentAnalytics({
    establishmentId,
    range: dateRange
  });
  
  // Format visitor data for the VisitorStatsTab
  const formattedVisitorData = React.useMemo(() => {
    return visitorAnalytics.map(data => ({
      name: new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      visitors: data.total_visitors,
      returningVisitors: data.returning_visitors,
      uniqueVisitors: data.unique_visitors,
      date: data.date
    }));
  }, [visitorAnalytics]);
  
  // Calculate total revenue
  const totalRevenue = React.useMemo(() => {
    return revenueReports.reduce((sum, report) => sum + report.monthly_revenue, 0);
  }, [revenueReports]);
  
  // Record visitor session when dashboard loads
  useEffect(() => {
    if (establishmentId && user) {
      // Simplified visitor session recording for now
      const checkPreviousVisits = async () => {
        try {
          // Using our mock service instead of direct Supabase calls
          await recordVisitorSession(establishmentId, false);
        } catch (error) {
          console.error('Error recording visitor session:', error);
        }
      };
      
      checkPreviousVisits();
    }
  }, [establishmentId, user]);
  
  // Fetch pending mocktail suggestions count
  useEffect(() => {
    const fetchPendingSuggestionsCount = async () => {
      if (!establishmentId) return;
      // Mock data for now
      setPendingSuggestions(3);
    };
    
    fetchPendingSuggestionsCount();
  }, [establishmentId]);
  
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
  
  if (isLoading || isAnalyticsLoading) {
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
            stats={{
              ...stats,
              // Update with real data from our analytics
              totalVisits: visitorAnalytics.reduce((sum, item) => sum + item.total_visitors, 0),
              visitorCount: visitorAnalytics.reduce((sum, item) => sum + item.unique_visitors, 0),
              revenue: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(totalRevenue),
              // Add data availability flags
              hasRevenueData: revenueReports.length > 0,
              hasVisitorData: visitorAnalytics.length > 0,
              hasRatingData: ratingData.length > 0,
              hasReturnRateData: visitorAnalytics.length > 0,
              hasAnalyticsData: true  // We now have real analytics data
            }}
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

        {/* Mocktail Suggestions Card */}
        <div className="mb-6">
          <MocktailSuggestionsCard pendingSuggestionCount={pendingSuggestions} />
        </div>
        
        {/* New Analytics Tabs */}
        <div className="mb-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="visitors">Visitors</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="drinks">Popular Drinks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
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
            </TabsContent>
            
            <TabsContent value="visitors">
              <VisitorStatsTab 
                visitorStats={{
                  totalVisits: visitorAnalytics.reduce((sum, item) => sum + item.total_visitors, 0),
                  uniqueVisitors: visitorAnalytics.reduce((sum, item) => sum + item.unique_visitors, 0),
                  returningVisitors: visitorAnalytics.reduce((sum, item) => sum + item.returning_visitors, 0)
                }}
                visitorTrends={formattedVisitorData}
                hasData={visitorAnalytics.length > 0}
              />
            </TabsContent>
            
            <TabsContent value="revenue">
              <RevenueStatsTab 
                establishmentId={establishmentId}
                revenueTrends={revenueReports.map(report => ({
                  name: new Date(report.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                  revenue: report.monthly_revenue,
                  transactions: report.transaction_count,
                  average: report.average_transaction,
                  month: report.month
                }))}
                totalRevenue={totalRevenue}
                hasData={revenueReports.length > 0}
                onRevenueAdded={refreshAnalytics}
              />
            </TabsContent>
            
            <TabsContent value="drinks">
              <DrinkPopularityTab 
                popularDrinks={popularDrinks} 
                hasData={popularDrinks.length > 0}
              />
            </TabsContent>
          </Tabs>
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
