
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel
} from '@/components/ui/form';
import { useNotificationActions } from '@/hooks/notifications/useNotificationActions';

interface GlobalNotificationSettingsProps {
  isLightTheme: boolean;
}

const GlobalNotificationSettings: React.FC<GlobalNotificationSettingsProps> = ({ isLightTheme }) => {
  const { permissionStatus, handleRefreshPermissions, handleSubscribe } = useNotificationActions();
  const isPushSupported = 'Notification' in window;
  const isBrowserBlocking = isPushSupported && permissionStatus === 'denied';
  const isPermissionPromptNeeded = isPushSupported && permissionStatus === 'default';
  const isPermissionGranted = isPushSupported && permissionStatus === 'granted';

  return (
    <div className="space-y-4">
      <h3 className={cn("text-lg font-medium", isLightTheme ? "text-gray-700" : "")}>
        Global Settings
      </h3>
      
      <div className="flex flex-col md:flex-row gap-4">
        <Card className={cn("flex-1", isLightTheme ? "bg-gray-50 border-gray-200" : "")}>
          <CardContent className="pt-6">
            <FormField
              name="email_notifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("text-base mb-2", isLightTheme ? "text-gray-800" : "")}>
                    Email Notifications
                  </FormLabel>
                  <p className={cn("text-sm mb-4", isLightTheme ? "text-gray-600" : "text-muted-foreground")}>
                    Receive notifications to your registered email address
                  </p>
                  <FormControl>
                    <Button
                      variant={field.value ? "default" : "outline"}
                      className="w-full"
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                    >
                      {field.value ? 'Enabled' : 'Disabled'}
                    </Button>
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card className={cn("flex-1", isLightTheme ? "bg-gray-50 border-gray-200" : "")}>
          <CardContent className="pt-6">
            <FormField
              name="push_notifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("text-base mb-2", isLightTheme ? "text-gray-800" : "")}>
                    Push Notifications
                  </FormLabel>
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
                    <FormControl>
                      <Button
                        variant={field.value ? "default" : "outline"}
                        className="w-full"
                        type="button"
                        onClick={() => field.onChange(!field.value)}
                        disabled={!isPushSupported || isBrowserBlocking}
                      >
                        {field.value ? 'Enabled' : 'Disabled'}
                      </Button>
                    </FormControl>
                    
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
                        <Info className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GlobalNotificationSettings;
