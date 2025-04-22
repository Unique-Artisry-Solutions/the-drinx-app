
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useServiceWorker } from '@/hooks/useServiceWorker';
import { useTestNotification } from '@/hooks/useTestNotification';
import { useAuth } from '@/contexts/auth';
import { NotificationLoading } from './NotificationLoading';
import { NotificationError } from './NotificationError';
import { SubscriptionStatus } from './SubscriptionStatus';
import { ActiveSubscription } from './ActiveSubscription';
import { LoginPrompt } from './LoginPrompt';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotificationTester = () => {
  const { 
    isSupported, 
    subscription, 
    permissionStatus, 
    isLoading, 
    error: setupError, 
    subscribeToNotifications,
    showPermissionPrompt 
  } = usePushNotifications();
  const { hasServiceWorker, isCheckingServiceWorker, registrationError, isRetrying } = useServiceWorker();
  const { isSending, sendTestNotification } = useTestNotification();
  const { user } = useAuth();

  // Helper for permission guidance
  const renderPermissionGuidance = () => {
    if (permissionStatus === 'denied') {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Notification Permission Denied</AlertTitle>
          <AlertDescription>
            <p className="mb-2">You've denied notification permissions. To enable them:</p>
            <ol className="list-decimal ml-5 space-y-1 text-sm">
              <li>Click the lock/info icon in your browser's address bar</li>
              <li>Find "Notifications" in the site settings</li>
              <li>Change the setting to "Allow"</li>
              <li>Refresh this page</li>
            </ol>
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  };

  // Early return for unsupported browsers
  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>
            Push notifications are not supported in your browser.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Loading state
  if (isCheckingServiceWorker || isRetrying || isLoading) {
    return <NotificationLoading />;
  }

  // Determine if there are errors to show
  const showError = registrationError || setupError;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Push Notifications</CardTitle>
        <CardDescription>
          Test and manage push notification settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Permission guidance */}
        {renderPermissionGuidance()}
        
        {/* Permission prompt alert */}
        {showPermissionPrompt && (
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <AlertTitle>Permission Required</AlertTitle>
            <AlertDescription>
              Please click "Allow" on the browser notification permission prompt.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Error display */}
        {showError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {registrationError || setupError}
            </AlertDescription>
          </Alert>
        )}
        
        {!user ? (
          <LoginPrompt />
        ) : !subscription ? (
          <SubscriptionStatus
            isLoading={isLoading}
            hasServiceWorker={hasServiceWorker}
            permissionStatus={permissionStatus}
            subscribeToNotifications={subscribeToNotifications}
          />
        ) : (
          <ActiveSubscription
            isSending={isSending}
            sendTestNotification={sendTestNotification}
          />
        )}
        
        {/* Debugging info for development */}
        {process.env.NODE_ENV !== 'production' && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
              <Settings className="h-3 w-3" /> Debug Info
            </h4>
            <div className="text-xs space-y-1 text-gray-500">
              <p>Service Worker: {hasServiceWorker ? 'Active' : 'Inactive'}</p>
              <p>Permission: {permissionStatus}</p>
              <p>Subscription: {subscription ? 'Yes' : 'No'}</p>
            </div>
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.reload()}
                className="text-xs"
              >
                Reload Page
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationTester;
