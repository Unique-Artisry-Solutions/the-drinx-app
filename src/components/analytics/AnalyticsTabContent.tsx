
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OverviewTab from './tabs/OverviewTab';
import VisitorsTab from './tabs/VisitorsTab';

interface AnalyticsTabContentProps {
  timeRange: string;
  data: any;
  isLoading: boolean;
}

const AnalyticsTabContent: React.FC<AnalyticsTabContentProps> = ({
  timeRange,
  data,
  isLoading
}) => {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="visitors">Visitors</TabsTrigger>
        <TabsTrigger value="engagement">Engagement</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab 
          timeRange={timeRange}
          data={data}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="visitors">
        <VisitorsTab 
          timeRange={timeRange}
          data={data}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="engagement">
        <Card>
          <CardHeader>
            <CardTitle>Engagement Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Engagement analytics will be available soon.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AnalyticsTabContent;
