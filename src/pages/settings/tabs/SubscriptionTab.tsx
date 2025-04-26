
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { SubscriptionManagement } from '@/components/promoter/subscription/SubscriptionManagement';

interface SubscriptionTabProps {
  isLightTheme: boolean;
}

const SubscriptionTab: React.FC<SubscriptionTabProps> = ({ isLightTheme }) => {
  return (
    <TabsContent value="subscriptions">
      <Card className={isLightTheme ? "bg-[#f5f3ed] border-gray-200" : ""}>
        <CardHeader>
          <CardTitle className={isLightTheme ? "text-gray-800" : ""}>
            Subscription Management
          </CardTitle>
          <CardDescription className={isLightTheme ? "text-gray-600" : ""}>
            Manage your promoter subscriptions and notification preferences
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <SubscriptionManagement />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default SubscriptionTab;
