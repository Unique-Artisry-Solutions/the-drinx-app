
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from '@/components/Layout';
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
import LoyaltyProgramPanel from '@/components/analytics/engagement/LoyaltyProgramPanel';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const EstablishmentAnalyticsPage = () => {
  const { user } = useAuth();
  const { id: urlEstablishmentId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('analytics');
  const [activeSection, setActiveSection] = useState<string | null>('analytics');
  const [analyticsView, setAnalyticsView] = useState('overview');
  
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

  const { establishmentId: userEstablishmentId } = useUserEstablishment();

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
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'menu') {
      navigate('/establishment/mocktail-menu', { replace: true });
    } else if (tab === 'promotions') {
      navigate('/establishment/promotions', { replace: true });
    } else if (tab === 'barCrawls') {
      navigate('/establishment/bar-crawl-requests', { replace: true });
    }
  };

  const handleQuickLinkClick = (section: string) => {
    if (section === activeSection) return;
    setActiveSection(section);
    if (section === 'settings') {
      navigate('/settings', { replace: true });
    } else if (section === 'allActions') {
      navigate('/establishment/all-actions', { replace: true });
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
          
          <Tabs value={analyticsView} onValueChange={setAnalyticsView} className="mb-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <AnalyticsTabContent 
                visitorAnalytics={visitorAnalytics}
                visitorTrends={visitorTrends}
                retentionTrends={retentionTrends}
                revenueReports={revenueReports}
                popularDrinks={popularDrinks}
                ratingData={ratingData}
              />
            </TabsContent>
            
            <TabsContent value="loyalty">
              <LoyaltyProgramPanel establishmentId={effectiveEstablishmentId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default EstablishmentAnalyticsPage;
