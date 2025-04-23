
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotificationFormContext } from '../hooks/useNotificationFormContext';
import GlobalNotificationSettings from '@/components/notifications/settings/GlobalNotificationSettings';
import QuietHoursSettings from '@/components/notifications/settings/QuietHoursSettings';
import NotificationCategoriesList from '@/components/notifications/settings/NotificationCategoriesList';
import { useNotificationPreferences } from '@/hooks/notifications/useNotificationPreferences';
import { useAuth } from '@/contexts/auth';

interface NotificationsTabProps {
  isLightTheme: boolean;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({ isLightTheme }) => {
  const form = useNotificationFormContext();
  const { user } = useAuth();
  const { isLoading } = useNotificationPreferences(user?.id);
  
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
          <GlobalNotificationSettings isLightTheme={isLightTheme} />
          <QuietHoursSettings isLightTheme={isLightTheme} />
          <NotificationCategoriesList isLightTheme={isLightTheme} isLoading={isLoading} />
          
          {/* Reset button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              type="button"
              onClick={() => form.reset()}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default NotificationsTab;
