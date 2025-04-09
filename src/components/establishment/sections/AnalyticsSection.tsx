
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { addDays } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { AnalyticsTabContent } from '@/components/analytics/AnalyticsTabContent';
import { useEstablishmentAnalytics } from '@/hooks/useEstablishmentAnalytics';

interface AnalyticsSectionProps {
  visitorStats: {
    totalVisits: number;
    uniqueVisitors: number;
    returningVisitors: number;
    hasData: boolean;
    isLoading: boolean;
    error: string | null;
  };
  establishmentId?: string;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ visitorStats, establishmentId }) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const {
    visitorAnalytics,
    visitorTrends,
    retentionTrends,
    revenueReports,
    popularDrinks,
    isLoading,
    error
  } = useEstablishmentAnalytics({
    establishmentId: establishmentId || '',
    range: {
      startDate: date?.from || addDays(new Date(), -30),
      endDate: date?.to || new Date()
    }
  });
  
  if (isLoading || visitorStats.isLoading) {
    return (
      <Card className="mb-6 mx-4 md:mx-6 lg:mx-[10%]">
        <CardContent className="py-6">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-4 w-2/3 mb-6" />
          
          <div className="mt-6 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || visitorStats.error) {
    return (
      <Card className="mb-6 mx-4 md:mx-6 lg:mx-[10%]">
        <CardContent className="py-6">
          <h1 className="text-2xl font-bold mb-4">Analytics</h1>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || visitorStats.error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!visitorStats.hasData) {
    return (
      <Card className="mb-6 mx-4 md:mx-6 lg:mx-[10%]">
        <CardContent className="py-6">
          <h1 className="text-2xl font-bold mb-4">Analytics</h1>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Data Available</AlertTitle>
            <AlertDescription>
              There is currently no analytics data available for this establishment.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 mx-4 md:mx-6 lg:mx-[10%]">
      <CardContent className="py-6">
        <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
        
        <AnalyticsHeader 
          establishmentName={establishmentId ? `Your Establishment` : 'Establishment'} 
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
          ratingData={[]}
        />
      </CardContent>
    </Card>
  );
};

export default AnalyticsSection;
