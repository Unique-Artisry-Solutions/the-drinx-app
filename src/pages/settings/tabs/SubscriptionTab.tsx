
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
            Manage your subscription settings and preferences
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            <div className={cn(
              "rounded-lg border p-4",
              isLightTheme ? "border-gray-200 bg-white" : "border-gray-700 bg-gray-800"
            )}>
              <h3 className={cn(
                "text-lg font-medium mb-2", 
                isLightTheme ? "text-gray-800" : ""
              )}>
                Current Plan: Free
              </h3>
              <p className={cn(
                "text-sm mb-4",
                isLightTheme ? "text-gray-600" : ""
              )}>
                You're currently on the free plan with limited features.
              </p>
              <Button variant="outline" className={isLightTheme ? "border-gray-300" : ""}>
                Upgrade to Premium
              </Button>
            </div>
            
            <div className={cn(
              "rounded-lg border p-4",
              isLightTheme ? "border-gray-200 bg-white" : "border-gray-700 bg-gray-800"
            )}>
              <h3 className={cn(
                "text-lg font-medium mb-2", 
                isLightTheme ? "text-gray-800" : ""
              )}>
                Subscription Settings
              </h3>
              <div className="space-y-2">
                <div className={cn(
                  "flex justify-between items-center",
                  isLightTheme ? "text-gray-700" : ""
                )}>
                  <span>Auto-renewal</span>
                  <span className="text-sm opacity-70">Off</span>
                </div>
                <div className={cn(
                  "flex justify-between items-center",
                  isLightTheme ? "text-gray-700" : ""
                )}>
                  <span>Billing cycle</span>
                  <span className="text-sm opacity-70">Monthly</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default SubscriptionTab;
