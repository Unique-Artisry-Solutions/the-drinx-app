
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { UserProfile } from '../hooks/useProfileData';
import { useProfileFormContext } from '../hooks/useProfileFormContext';

interface NotificationsTabProps {
  profile: UserProfile;
  isLightTheme: boolean;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({ profile, isLightTheme }) => {
  const { handleToggle } = useProfileFormContext();
  
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
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className={isLightTheme ? "text-gray-700" : ""}>
                Email Notifications
              </Label>
              <p className={cn(
                "text-sm", 
                isLightTheme ? "text-gray-600" : "text-muted-foreground"
              )}>
                Receive updates via email
              </p>
            </div>
            <Switch
              checked={profile.email_notifications}
              onCheckedChange={(checked) => handleToggle('email_notifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className={isLightTheme ? "text-gray-700" : ""}>
                Push Notifications
              </Label>
              <p className={cn(
                "text-sm", 
                isLightTheme ? "text-gray-600" : "text-muted-foreground"
              )}>
                Receive updates on your device
              </p>
            </div>
            <Switch
              checked={profile.push_notifications}
              onCheckedChange={(checked) => handleToggle('push_notifications', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default NotificationsTab;
