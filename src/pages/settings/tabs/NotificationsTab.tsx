
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface NotificationsTabProps {
  isLightTheme: boolean;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({ isLightTheme }) => {
  return (
    <TabsContent value="notifications">
      <Card className={isLightTheme ? "bg-[#f5f3ed] border-gray-200" : ""}>
        <CardHeader>
          <CardTitle className={isLightTheme ? "text-gray-800" : ""}>
            Notification Preferences
          </CardTitle>
          <CardDescription className={isLightTheme ? "text-gray-600" : ""}>
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className={cn(
              "flex items-center justify-between",
              isLightTheme ? "text-gray-700" : ""
            )}>
              <div>
                <h4 className="font-medium">Push Notifications</h4>
                <p className={cn("text-sm opacity-70", isLightTheme ? "text-gray-600" : "")}>
                  Receive notifications on your device
                </p>
              </div>
              <Switch />
            </div>
            
            <div className={cn(
              "flex items-center justify-between",
              isLightTheme ? "text-gray-700" : ""
            )}>
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className={cn("text-sm opacity-70", isLightTheme ? "text-gray-600" : "")}>
                  Receive notifications via email
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className={cn(
              "flex items-center justify-between",
              isLightTheme ? "text-gray-700" : ""
            )}>
              <div>
                <h4 className="font-medium">Marketing Emails</h4>
                <p className={cn("text-sm opacity-70", isLightTheme ? "text-gray-600" : "")}>
                  Receive emails about new features and promotions
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default NotificationsTab;
