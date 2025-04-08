
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OverviewTab } from './tabs/OverviewTab';
import { VisitorsTab } from './tabs/VisitorsTab';
import { SalesTab } from './tabs/SalesTab';
import { EngagementTab } from './tabs/EngagementTab';
import { EstablishmentAnalytics, DrinkPopularity, RevenueReport, TrendDataPoint } from '@/services/establishmentAnalyticsService';
import { format } from 'date-fns';

interface AnalyticsTabContentProps {
  visitorAnalytics: EstablishmentAnalytics[];
  visitorTrends: TrendDataPoint[];
  retentionTrends: TrendDataPoint[];
  revenueReports: RevenueReport[];
  popularDrinks: DrinkPopularity[];
  ratingData: any[];
}

export const AnalyticsTabContent: React.FC<AnalyticsTabContentProps> = ({
  visitorAnalytics,
  visitorTrends,
  retentionTrends,
  revenueReports,
  popularDrinks,
  ratingData
}) => {
  // Format data for charts
  const formattedVisitorData = React.useMemo(() => {
    return visitorAnalytics.map(data => ({
      name: format(new Date(data.date), 'MMM d'),
      visitors: data.total_visitors,
      returningVisitors: data.returning_visitors,
      uniqueVisitors: data.unique_visitors,
      date: data.date
    }));
  }, [visitorAnalytics]);

  const formattedRevenueData = React.useMemo(() => {
    return revenueReports.map(report => ({
      name: format(new Date(report.month), 'MMM yyyy'),
      revenue: report.monthly_revenue,
      transactions: report.transaction_count
    }));
  }, [revenueReports]);

  return (
    <Tabs defaultValue="overview" className="w-full mb-10">
      <TabsList className="w-full grid grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="visitors">Visitors</TabsTrigger>
        <TabsTrigger value="sales">Sales</TabsTrigger>
        <TabsTrigger value="engagement">Engagement</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-8 mt-6">
        <OverviewTab 
          formattedVisitorData={formattedVisitorData} 
          ratingData={ratingData}
          popularDrinks={popularDrinks}
          formattedRevenueData={formattedRevenueData}
        />
      </TabsContent>
      
      <TabsContent value="visitors" className="space-y-8 mt-6">
        <VisitorsTab 
          formattedVisitorData={formattedVisitorData} 
        />
      </TabsContent>
      
      <TabsContent value="sales" className="space-y-8 mt-6">
        <SalesTab 
          formattedRevenueData={formattedRevenueData}
          popularDrinks={popularDrinks}
        />
      </TabsContent>
      
      <TabsContent value="engagement" className="space-y-8 mt-6">
        <EngagementTab />
      </TabsContent>
    </Tabs>
  );
};
