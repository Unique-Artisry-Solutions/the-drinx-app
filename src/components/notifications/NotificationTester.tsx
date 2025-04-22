
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const NotificationTester = () => {
  const { isSupported, subscription, permissionStatus, isLoading, error: setupError, subscribeToNotifications } = usePushNotifications();
  const { hasServiceWorker, isCheckingServiceWorker, registrationError, isRetrying } = useServiceWorker();
  const { isSending, sendTestNotification } = useTestNotification();
  const { user } = useAuth();

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

  if (isCheckingServiceWorker || isRetrying) {
    return <NotificationLoading />;
  }

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
      </CardContent>
    </Card>
  );
};

export default NotificationTester;
