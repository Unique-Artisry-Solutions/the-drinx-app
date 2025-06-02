
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoyaltyProgramPanel from '@/components/analytics/engagement/LoyaltyProgramPanel';
import ContentAnalyticsPanel from '@/components/analytics/engagement/ContentAnalyticsPanel';

interface EngagementTabProps {
  establishmentId?: string;
}

export const EngagementTab: React.FC<EngagementTabProps> = () => {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground mb-4">
        Track customer engagement metrics including loyalty program performance, user-generated content,
        and customer feedback to optimize your customer relations strategy.
      </p>
      
      <Tabs defaultValue="loyalty" className="w-full">
        <TabsList>
          <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
          <TabsTrigger value="content">User Content</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="loyalty" className="mt-6">
          <LoyaltyProgramPanel />
        </TabsContent>
        
        <TabsContent value="content" className="mt-6">
          <ContentAnalyticsPanel />
        </TabsContent>
        
        <TabsContent value="feedback" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Feedback Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Feedback analytics will be available soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
