
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Bell, BellRing } from 'lucide-react';
import { useServiceWorker } from '@/hooks/useServiceWorker';
import { useTestNotification } from '@/hooks/useTestNotification';
import { NotificationLoading } from './NotificationLoading';
import { NotificationError } from './NotificationError';
import { useAuth } from '@/contexts/auth';

const NotificationTester = () => {
  const { isSupported, subscription, permissionStatus, isLoading, subscribeToNotifications } = usePushNotifications();
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Push Notifications</CardTitle>
        <CardDescription>
          Test and manage push notification settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {registrationError && <NotificationError error={registrationError} />}
        
        {!user ? (
          <div className="border border-amber-200 bg-amber-50 p-4 rounded-md mb-4">
            <p className="text-sm text-amber-800">
              Please log in to enable push notifications.
            </p>
          </div>
        ) : !subscription ? (
          <div className="border border-amber-200 bg-amber-50 p-4 rounded-md mb-4">
            <p className="text-sm text-amber-800 mb-3">
              Push notifications are {permissionStatus === 'granted' ? 'enabled in your browser' : 'not enabled yet'}.
              {!hasServiceWorker && ' Notification service needs to be initialized.'}
            </p>
            <Button 
              onClick={subscribeToNotifications}
              disabled={isLoading || !hasServiceWorker}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              <BellRing className="h-4 w-4 mr-2" />
              {isLoading ? 'Enabling...' : 'Enable Notifications'}
            </Button>
          </div>
        ) : (
          <>
            <div className="border border-green-200 bg-green-50 p-4 rounded-md mb-4">
              <p className="text-sm text-green-800">
                <span className="flex items-center">
                  <BellRing className="h-4 w-4 mr-2 text-green-600" /> 
                  Push notifications are enabled
                </span>
              </p>
            </div>
            <Button 
              onClick={sendTestNotification}
              disabled={isSending}
              className="flex gap-2"
            >
              <Bell className="h-4 w-4" />
              {isSending ? 'Sending...' : 'Send Test Notification'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationTester;
