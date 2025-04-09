
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams } from 'react-router-dom';
import LoyaltyProgramPanel from '@/components/analytics/engagement/LoyaltyProgramPanel';
import ContentAnalyticsPanel from '@/components/analytics/engagement/ContentAnalyticsPanel';
import FeedbackAnalyticsPanel from '@/components/analytics/engagement/FeedbackAnalyticsPanel';

interface EngagementTabProps {
  establishmentId?: string;
}

export const EngagementTab: React.FC<EngagementTabProps> = ({ establishmentId }) => {
  const { id: urlEstablishmentId } = useParams<{ id: string }>();
  const effectiveEstablishmentId = establishmentId || urlEstablishmentId || '';
  
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
          <LoyaltyProgramPanel establishmentId={effectiveEstablishmentId} />
        </TabsContent>
        
        <TabsContent value="content" className="mt-6">
          <ContentAnalyticsPanel establishmentId={effectiveEstablishmentId} />
        </TabsContent>
        
        <TabsContent value="feedback" className="mt-6">
          <FeedbackAnalyticsPanel establishmentId={effectiveEstablishmentId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
