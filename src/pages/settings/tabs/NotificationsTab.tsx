import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useProfileFormContext } from '../hooks/useProfileFormContext';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { Bell, Info, RotateCcw, Volume2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import NotificationCategorySection from '@/components/notifications/settings/NotificationCategorySection';
import TimeWindowSelector from '@/components/notifications/settings/TimeWindowSelector';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useNotificationPreferences } from '@/hooks/notifications/useNotificationPreferences';
import { useNotificationActions } from '@/hooks/notifications/useNotificationActions';

interface NotificationsTabProps {
  isLightTheme: boolean;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({ isLightTheme }) => {
  const form = useProfileFormContext();
  const { user } = useAuth();
  const { preferences, isLoading } = useNotificationPreferences(user?.id);
  const { permissionStatus, handleRefreshPermissions, handleSubscribe } = useNotificationActions();
  
  const isPushSupported = 'Notification' in window;
  const isBrowserBlocking = isPushSupported && permissionStatus === 'denied';
  const isPermissionPromptNeeded = isPushSupported && permissionStatus === 'default';
  const isPermissionGranted = isPushSupported && permissionStatus === 'granted';

  const notificationCategories = [
    {
      id: 'system-updates',
      title: 'System Announcements',
      description: 'Updates about the platform and important system changes',
      type: 'system' as const,
    },
    {
      id: 'bar-crawl',
      title: 'Bar Crawl Updates',
      description: 'Notifications about bar crawls you are participating in',
      type: 'bar-crawl' as const,
    },
    {
      id: 'establishment',
      title: 'Establishment Updates',
      description: 'Updates from establishments you follow',
      type: 'establishment' as const,
    },
    {
      id: 'promotions',
      title: 'Promotions and Events',
      description: 'Special offers and upcoming events',
      type: 'promotional' as const,
    }
  ];

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
          {/* Global notification settings */}
          <div className="space-y-4">
            <h3 className={cn("text-lg font-medium", isLightTheme ? "text-gray-700" : "")}>
              Global Settings
            </h3>
            
            <div className="flex flex-col md:flex-row gap-4">
              <Card className={cn("flex-1", isLightTheme ? "bg-gray-50 border-gray-200" : "")}>
                <CardHeader className="pb-2">
                  <CardTitle className={cn("text-base", isLightTheme ? "text-gray-800" : "")}>
                    Email Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={cn("text-sm mb-4", isLightTheme ? "text-gray-600" : "text-muted-foreground")}>
                    Receive notifications to your registered email address
                  </p>
                  <Button
                    variant={form.watch('email_notifications') ? "default" : "outline"}
                    className="w-full"
                    type="button"
                    onClick={() => form.setValue('email_notifications', !form.watch('email_notifications'))}
                  >
                    {form.watch('email_notifications') ? 'Enabled' : 'Disabled'}
                  </Button>
                </CardContent>
              </Card>
              
              <Card className={cn("flex-1", isLightTheme ? "bg-gray-50 border-gray-200" : "")}>
                <CardHeader className="pb-2">
                  <CardTitle className={cn("text-base", isLightTheme ? "text-gray-800" : "")}>
                    Push Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={cn("text-sm mb-4", isLightTheme ? "text-gray-600" : "text-muted-foreground")}>
                    Receive notifications directly in your browser
                  </p>
                  {!isPushSupported ? (
                    <Alert variant="destructive" className="mb-4">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Your browser doesn't support push notifications
                      </AlertDescription>
                    </Alert>
                  ) : isBrowserBlocking ? (
                    <Alert variant="destructive" className="mb-4">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Push notifications are blocked by your browser settings
                      </AlertDescription>
                    </Alert>
                  ) : null}
                  
                  <div className="flex gap-2">
                    <Button
                      variant={form.watch('push_notifications') ? "default" : "outline"}
                      className="flex-1"
                      type="button"
                      onClick={() => form.setValue('push_notifications', !form.watch('push_notifications'))}
                      disabled={!isPushSupported || isBrowserBlocking}
                    >
                      {form.watch('push_notifications') ? 'Enabled' : 'Disabled'}
                    </Button>
                    
                    {isPermissionPromptNeeded && (
                      <Button 
                        variant="outline" 
                        onClick={handleSubscribe}
                        type="button"
                      >
                        Request Permission
                      </Button>
                    )}
                    
                    {isPermissionGranted && (
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={handleRefreshPermissions}
                        type="button"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Global quiet hours */}
          <div className="space-y-4">
            <h3 className={cn("text-lg font-medium", isLightTheme ? "text-gray-700" : "")}>
              Global Quiet Hours
            </h3>
            <Card className={cn(isLightTheme ? "bg-gray-50 border-gray-200" : "")}>
              <CardContent className="pt-6">
                <TimeWindowSelector 
                  isLightTheme={isLightTheme}
                  basePath="global_quiet_hours"
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Category-specific notification preferences */}
          <div className="space-y-4">
            <h3 className={cn("text-lg font-medium", isLightTheme ? "text-gray-700" : "")}>
              Notification Categories
            </h3>
            
            {isLoading ? (
              <div>Loading preferences...</div>
            ) : (
              <Accordion type="multiple" defaultValue={['system-updates']}>
                {notificationCategories.map((category) => (
                  <AccordionItem 
                    value={category.id} 
                    key={category.id}
                    className={cn("border rounded-md mb-2", isLightTheme ? "border-gray-200" : "border-border")}
                  >
                    <AccordionTrigger className="px-4">
                      <div className="flex items-center">
                        <Bell className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{category.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4">
                      <NotificationCategorySection
                        title={category.title}
                        description={category.description}
                        name={category.id}
                        categoryId={category.id}
                        type={category.type}
                        isLightTheme={isLightTheme}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
          
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
