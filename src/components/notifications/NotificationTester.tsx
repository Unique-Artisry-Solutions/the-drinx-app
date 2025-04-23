import React, { useState, useEffect } from 'react';
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
import { AlertCircle, Settings, RefreshCw, Info, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServiceWorkerStatus } from '@/hooks/service-worker/useServiceWorkerStatus';
import { debouncedToast } from '@/utils/debouncedToast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DirectNotificationTester from './DirectNotificationTester';
import { useNotificationDiagnostics } from '@/hooks/notifications/useNotificationDiagnostics';
import NotificationDiagnosticsPanel from './NotificationDiagnosticsPanel';
import PermissionRequestDialog from './PermissionRequestDialog';

const NotificationTester = () => {
  const { 
    isSupported, 
    subscription, 
    permissionStatus,
    isLoading, 
    error: setupError,
    subscribeToNotifications,
    showPermissionPrompt,
    checkPermissions,
    resetSubscriptionState
  } = usePushNotifications();
  const { hasServiceWorker, isCheckingServiceWorker, registrationError, isRetrying } = useServiceWorker();
  const { isSending, sendTestNotification } = useTestNotification();
  const { user } = useAuth();
  const { refreshPermissionStatus } = useServiceWorkerStatus();
  const [permissionState, setPermissionState] = useState<NotificationPermission>(permissionStatus);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  // use the new diagnostics logic
  const {
    diagnosticsData,
    serviceWorkerStatus,
    runDiagnostics,
    handleReset,
    hasJustReset,
    onHasJustResetUsed
  } = useNotificationDiagnostics({ resetSubscriptionState });

  useEffect(() => {
    if (hasJustReset) {
      onHasJustResetUsed();
      runDiagnostics();
    }
  }, [hasJustReset, onHasJustResetUsed, runDiagnostics]);

  const handleRefreshPermissions = () => {
    const currentPermission = refreshPermissionStatus();
    if (currentPermission) {
      setPermissionState(currentPermission);
      if (checkPermissions) {
        checkPermissions();
      }
      debouncedToast.info(
        "Permission Status", 
        `Current notification permission: ${currentPermission}`
      );
    }
  };

  const handleSubscribeClick = () => {
    if (permissionStatus === 'default') {
      setShowPermissionDialog(true);
    } else {
      subscribeToNotifications();
    }
  };

  // Listen for messages from service worker
  useEffect(() => {
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SW_ACTIVATED') {
        console.log('Service worker activated message received:', event.data);
        runDiagnostics();
      }
    };
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }
    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
    };
  }, [runDiagnostics]);

  useEffect(() => {
    setPermissionState(permissionStatus);
  }, [permissionStatus]);

  useEffect(() => {
    runDiagnostics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isCheckingServiceWorker || isRetrying || isLoading) {
    return <NotificationLoading />;
  }

  const showError = registrationError || setupError;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>
            Test and manage notification settings
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={runDiagnostics}
            title="Run system diagnostics"
            className="h-8 px-2"
          >
            <Zap className="h-4 w-4 mr-1" />
            Diagnose
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshPermissions}
            title="Refresh permission status"
            className="h-8 px-2"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
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
        ) : (
          <Tabs defaultValue="direct" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="direct">Direct Browser</TabsTrigger>
              <TabsTrigger value="service-worker">Service Worker</TabsTrigger>
            </TabsList>
            
            <TabsContent value="direct" className="py-4">
              <DirectNotificationTester />
            </TabsContent>
            
            <TabsContent value="service-worker" className="py-4">
              {!subscription ? (
                <SubscriptionStatus
                  isLoading={isLoading}
                  hasServiceWorker={hasServiceWorker}
                  permissionStatus={permissionState}
                  subscribeToNotifications={handleSubscribeClick}
                  refreshPermissions={handleRefreshPermissions}
                />
              ) : (
                <ActiveSubscription
                  isSending={isSending}
                  sendTestNotification={sendTestNotification}
                />
              )}

              <NotificationDiagnosticsPanel
                diagnosticsData={diagnosticsData}
                serviceWorkerStatus={serviceWorkerStatus}
                permissionState={permissionState}
                subscription={subscription}
                onReset={handleReset}
              />
            </TabsContent>
          </Tabs>
        )}

        <PermissionRequestDialog
          open={showPermissionDialog}
          onOpenChange={setShowPermissionDialog}
          onRequestPermission={subscribeToNotifications}
          permissionStatus={permissionState}
        />
      </CardContent>
    </Card>
  );
};

export default NotificationTester;
