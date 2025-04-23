
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
  const [selectedTab, setSelectedTab] = useState<string>("direct");
  const [diagnosticsData, setDiagnosticsData] = useState<Record<string, any>>({});
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState<'checking' | 'active' | 'inactive'>('checking');
  
  const runDiagnostics = async () => {
    setServiceWorkerStatus('checking');
    const data: Record<string, any> = {
      browser: navigator.userAgent,
      timestamp: new Date().toISOString(),
      notifications: 'Notification' in window,
      serviceWorker: 'serviceWorker' in navigator,
      pushManager: 'PushManager' in window,
      permission: 'Notification' in window ? Notification.permission : 'API not available',
      controller: !!navigator.serviceWorker?.controller,
      registrations: []
    };
    
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        data.registrations = registrations.map(reg => ({
          scope: reg.scope,
          active: !!reg.active,
          installing: !!reg.installing,
          waiting: !!reg.waiting,
          scriptURL: reg.active?.scriptURL || 'N/A'
        }));
        
        // Check if service worker is responding
        if (navigator.serviceWorker.controller) {
          const messageChannel = new MessageChannel();
          const promise = new Promise<boolean>((resolve) => {
            messageChannel.port1.onmessage = (event) => {
              data.serviceWorkerResponse = event.data;
              resolve(true);
            };
            
            // Set a timeout in case the service worker doesn't respond
            setTimeout(() => {
              data.serviceWorkerTimeout = true;
              resolve(false);
            }, 1000);
          });
          
          navigator.serviceWorker.controller.postMessage({
            action: 'ping',
            timestamp: new Date().toISOString()
          }, [messageChannel.port2]);
          
          await promise;
        }
        
        // Update service worker status
        const hasActiveServiceWorker = registrations.some(
          reg => reg.active && reg.active.scriptURL.includes('service-worker.js')
        );
        setServiceWorkerStatus(hasActiveServiceWorker ? 'active' : 'inactive');
      } catch (e) {
        data.registrationsError = e instanceof Error ? e.message : 'Unknown error';
        setServiceWorkerStatus('inactive');
      }
    }
    
    console.log('Diagnostics data:', data);
    setDiagnosticsData(data);
    debouncedToast.info(
      "Diagnostics Complete", 
      "System diagnostics information has been collected"
    );
  };
  
  const handleReset = async () => {
    try {
      setServiceWorkerStatus('checking');
      await resetSubscriptionState();
      
      // Force unregister all service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
        console.log('Unregistered all service workers during reset');
      }
      
      debouncedToast.info(
        "Reset Complete", 
        "Notification system has been reset"
      );
      
      // Run diagnostics after reset
      await runDiagnostics();
      
      // Refresh the page to ensure clean state
      if (window.confirm('Reset complete. Reload the page to ensure a clean state?')) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error during reset:', error);
      debouncedToast.error(
        "Reset Error", 
        error instanceof Error ? error.message : "Failed to reset notification system"
      );
    }
  };
  
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
  
  // Listen for messages from service worker
  useEffect(() => {
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SW_ACTIVATED') {
        console.log('Service worker activated message received:', event.data);
        setServiceWorkerStatus('active');
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
  }, []);

  useEffect(() => {
    setPermissionState(permissionStatus);
  }, [permissionStatus]);
  
  useEffect(() => {
    runDiagnostics();
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
                  subscribeToNotifications={subscribeToNotifications}
                  refreshPermissions={handleRefreshPermissions}
                />
              ) : (
                <ActiveSubscription
                  isSending={isSending}
                  sendTestNotification={sendTestNotification}
                />
              )}
              
              <div className="mt-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle>Service Worker Mode</AlertTitle>
                  <AlertDescription>
                    This mode uses service workers to handle push notifications. If you're having trouble, try the Direct Browser mode instead.
                  </AlertDescription>
                </Alert>
              </div>
              
              {Object.keys(diagnosticsData).length > 0 && (
                <div className="mt-4 p-4 border rounded-md bg-slate-50">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Settings className="h-3 w-3" /> System Diagnostics
                  </h4>
                  <div className="text-xs space-y-1 text-gray-500">
                    <p>Service Worker: {serviceWorkerStatus === 'active' ? 'Active' : serviceWorkerStatus === 'checking' ? 'Checking...' : 'Inactive'}</p>
                    <p>Permission: {permissionState}</p>
                    <p>Controller: {diagnosticsData.controller ? 'Yes' : 'No'}</p>
                    <p>Registrations: {diagnosticsData.registrations?.length || 0}</p>
                    <p>Subscription: {subscription ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleReset}
                      className="text-xs"
                    >
                      Reset System
                    </Button>
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
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationTester;
