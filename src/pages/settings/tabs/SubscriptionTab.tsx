
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import AppSubscriptionManagement from '@/components/subscription/AppSubscriptionManagement';
import AppSubscriptionPlans from '@/components/subscription/AppSubscriptionPlans';
import { useAppSubscription } from '@/hooks/useAppSubscription';

interface SubscriptionTabProps {
  isLightTheme: boolean;
}

const SubscriptionTab: React.FC<SubscriptionTabProps> = ({ isLightTheme }) => {
  const { hasActiveSubscription } = useAppSubscription();

  return (
    <TabsContent value="subscriptions">
      <Card className={isLightTheme ? "bg-[#f5f3ed] border-gray-200" : ""}>
        <CardHeader>
          <CardTitle className={isLightTheme ? "text-gray-800" : ""}>
            App Subscription
          </CardTitle>
          <CardDescription className={isLightTheme ? "text-gray-600" : ""}>
            Manage your Swig app subscription and billing
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {hasActiveSubscription ? (
            <AppSubscriptionManagement />
          ) : (
            <div className="space-y-6">
              <div className={cn(
                "rounded-lg border p-4 text-center",
                isLightTheme ? "border-gray-200 bg-white" : "border-gray-700 bg-gray-800"
              )}>
                <h3 className={cn(
                  "text-lg font-medium mb-2", 
                  isLightTheme ? "text-gray-800" : ""
                )}>
                  Subscribe to Access Premium Features
                </h3>
                <p className={cn(
                  "text-sm mb-4", 
                  isLightTheme ? "text-gray-600" : "text-gray-400"
                )}>
                  Choose a plan to unlock all Swig app features and start following your favorite promoters
                </p>
              </div>
              
              <AppSubscriptionPlans />
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default SubscriptionTab;
