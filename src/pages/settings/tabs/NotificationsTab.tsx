
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { UserProfileFormData } from '../hooks/useProfileData';
import { useProfileFormContext } from '../hooks/useProfileFormContext';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

interface NotificationsTabProps {
  profile: UserProfileFormData;
  isLightTheme: boolean;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({ profile, isLightTheme }) => {
  const form = useProfileFormContext();
  
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
          <FormField
            control={form.control}
            name="email_notifications"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between space-y-0">
                <div className="space-y-0.5">
                  <FormLabel className={isLightTheme ? "text-gray-700" : ""}>
                    Email Notifications
                  </FormLabel>
                  <FormDescription className={cn(
                    "text-sm", 
                    isLightTheme ? "text-gray-600" : "text-muted-foreground"
                  )}>
                    Receive updates via email
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="push_notifications"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between space-y-0">
                <div className="space-y-0.5">
                  <FormLabel className={isLightTheme ? "text-gray-700" : ""}>
                    Push Notifications
                  </FormLabel>
                  <FormDescription className={cn(
                    "text-sm", 
                    isLightTheme ? "text-gray-600" : "text-muted-foreground"
                  )}>
                    Receive updates on your device
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default NotificationsTab;
