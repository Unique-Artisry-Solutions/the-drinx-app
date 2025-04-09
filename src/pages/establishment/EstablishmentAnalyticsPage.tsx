
import React, { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/Layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { useParams, useNavigate } from 'react-router-dom';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { AnalyticsTabContent } from '@/components/analytics/AnalyticsTabContent';
import { AnalyticsLoadingState } from '@/components/analytics/AnalyticsLoadingState';
import { useEstablishmentDetails } from '@/hooks/analytics/useEstablishmentDetails';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useEstablishmentAnalytics } from '@/hooks/useEstablishmentAnalytics';
import QuickNavigation from '@/components/establishment/QuickNavigation';
import { useUserEstablishment } from '@/hooks/establishment';

const EstablishmentAnalyticsPage = () => {
  const { user } = useAuth();
  const { id: urlEstablishmentId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // For navigation between tabs
  const [activeTab, setActiveTab] = useState('analytics');
  const [activeSection, setActiveSection] = useState<string | null>('analytics');
  
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  
  const {
    establishmentId,
    establishmentName,
    isLoading: isEstablishmentLoading,
    error: establishmentError
  } = useEstablishmentDetails(urlEstablishmentId);

  // Get user's establishment for QuickNavigation if no establishmentId is provided
  const { establishmentId: userEstablishmentId } = useUserEstablishment();

  // Use the appropriate establishment ID
  const effectiveEstablishmentId = useMemo(() => 
    establishmentId || userEstablishmentId || '', 
    [establishmentId, userEstablishmentId]
  );

  const { 
    stats, 
    visitorData, 
    ratingData, 
    mocktailData,
    barCrawlData,
    isLoading: isDashboardLoading 
  } = useDashboardData();

  const {
    visitorAnalytics,
    visitorTrends,
    retentionTrends,
    revenueReports,
    popularDrinks,
    isLoading: isAnalyticsLoading,
    error: analyticsError
  } = useEstablishmentAnalytics({
    establishmentId: effectiveEstablishmentId,
    range: {
      startDate: date?.from || addDays(new Date(), -30),
      endDate: date?.to || new Date()
    }
  });
  
  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'menu' || tab === 'promotions' || tab === 'barCrawls') {
      navigate(`/establishment/profile/${effectiveEstablishmentId}`);
    }
  };

  // Handle quick link click
  const handleQuickLinkClick = (section: string) => {
    setActiveSection(section);
    if (section === 'settings' || section === 'allActions') {
      navigate(`/establishment/${section === 'allActions' ? 'all-actions' : section}`);
    }
  };

  if (isEstablishmentLoading || isAnalyticsLoading || isDashboardLoading) {
    return <AnalyticsLoadingState />;
  }

  if (establishmentError || analyticsError) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error Loading Analytics</AlertTitle>
            <AlertDescription>{establishmentError || analyticsError}</AlertDescription>
          </Alert>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto pb-12">
        <QuickNavigation 
          activeSection={activeSection}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          handleQuickLinkClick={handleQuickLinkClick}
          establishmentId={effectiveEstablishmentId}
        />
        
        <div className="px-6">
          <AnalyticsHeader 
            establishmentName={establishmentName} 
            date={date} 
            setDate={setDate} 
            visitorAnalytics={visitorAnalytics}
            revenueReports={revenueReports}
            popularDrinks={popularDrinks}
          />
          
          <AnalyticsTabContent 
            visitorAnalytics={visitorAnalytics}
            visitorTrends={visitorTrends}
            retentionTrends={retentionTrends}
            revenueReports={revenueReports}
            popularDrinks={popularDrinks}
            ratingData={ratingData}
          />
        </div>
      </div>
    </Layout>
  );
};

export default EstablishmentAnalyticsPage;
