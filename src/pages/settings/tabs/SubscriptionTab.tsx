
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
            Following & Notification Preferences
          </CardTitle>
          <CardDescription className={isLightTheme ? "text-gray-600" : ""}>
            Manage how you receive updates from promoters you follow
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            <div className={cn(
              "rounded-lg border p-4",
              isLightTheme ? "border-gray-200 bg-white" : "border-gray-700 bg-gray-800"
            )}>
              <h3 className={cn(
                "text-lg font-medium mb-4", 
                isLightTheme ? "text-gray-800" : ""
              )}>
                Notification Settings
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className={cn("font-medium", isLightTheme ? "text-gray-700" : "")}>
                      Event Announcements
                    </Label>
                    <p className={cn("text-sm", isLightTheme ? "text-gray-600" : "text-gray-400")}>
                      Get notified when promoters announce new events
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className={cn("font-medium", isLightTheme ? "text-gray-700" : "")}>
                      Promotions & Discounts
                    </Label>
                    <p className={cn("text-sm", isLightTheme ? "text-gray-600" : "text-gray-400")}>
                      Receive special offers and discount codes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className={cn("font-medium", isLightTheme ? "text-gray-700" : "")}>
                      General Updates
                    </Label>
                    <p className={cn("text-sm", isLightTheme ? "text-gray-600" : "text-gray-400")}>
                      Get updates about promoter activities and news
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className={cn("font-medium", isLightTheme ? "text-gray-700" : "")}>
                      Email Notifications
                    </Label>
                    <p className={cn("text-sm", isLightTheme ? "text-gray-600" : "text-gray-400")}>
                      Also receive notifications via email
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
            
            <div className={cn(
              "rounded-lg border p-4",
              isLightTheme ? "border-gray-200 bg-white" : "border-gray-700 bg-gray-800"
            )}>
              <h3 className={cn(
                "text-lg font-medium mb-2", 
                isLightTheme ? "text-gray-800" : ""
              )}>
                Following Summary
              </h3>
              <div className="space-y-2">
                <div className={cn(
                  "flex justify-between items-center",
                  isLightTheme ? "text-gray-700" : ""
                )}>
                  <span>Free Follows</span>
                  <span className="text-sm opacity-70">3 promoters</span>
                </div>
                <div className={cn(
                  "flex justify-between items-center",
                  isLightTheme ? "text-gray-700" : ""
                )}>
                  <span>Premium Follows</span>
                  <span className="text-sm opacity-70">1 promoter</span>
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
