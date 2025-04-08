
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { AnalyticsTabContent } from '@/components/analytics/AnalyticsTabContent';
import { AnalyticsLoadingState } from '@/components/analytics/AnalyticsLoadingState';
import { useEstablishmentDetails } from '@/hooks/analytics/useEstablishmentDetails';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useEstablishmentAnalytics } from '@/hooks/useEstablishmentAnalytics';

const EstablishmentAnalyticsPage = () => {
  const { user } = useAuth();
  const { id: urlEstablishmentId } = useParams<{ id: string }>();
  
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
    establishmentId: establishmentId || '',
    range: {
      startDate: date?.from || addDays(new Date(), -30),
      endDate: date?.to || new Date()
    }
  });

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
      <div className="container max-w-6xl mx-auto p-6 pb-12">
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
    </Layout>
  );
};

export default EstablishmentAnalyticsPage;
