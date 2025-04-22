
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Bell, BellOff, BellRing, RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { useRetry } from '@/hooks/useRetry';

const NotificationTester = () => {
  const { isSupported, subscription, permissionStatus, isLoading, subscribeToNotifications } = usePushNotifications();
  const [isSending, setIsSending] = useState(false);
  const [hasServiceWorker, setHasServiceWorker] = useState(false);
  const [isCheckingServiceWorker, setIsCheckingServiceWorker] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { executeWithRetry } = useRetry();
  const [isRetrying, setIsRetrying] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const checkServiceWorker = async () => {
    try {
      setRegistrationError(null);
      console.log('Checking service worker support...');
      
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service Worker not supported in this browser');
      }
      
      console.log('Getting service worker registrations...');
      const registrations = await navigator.serviceWorker.getRegistrations();
      const hasActiveWorker = registrations.some(registration => 
        registration.active && registration.active.scriptURL.includes('service-worker.js')
      );
      
      if (!hasActiveWorker) {
        console.log('No active service worker found, registering new one...');
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service worker registered:', registration);
        
        // Wait for the service worker to be ready
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Service worker registration timeout'));
          }, 5000);

          registration.addEventListener('activate', () => {
            clearTimeout(timeout);
            resolve(true);
          });
        });
      }
      
      console.log('Service worker check completed successfully');
      setHasServiceWorker(true);
    } catch (error) {
      console.error('Error checking/registering service worker:', error);
      setHasServiceWorker(false);
      setRegistrationError(error instanceof Error ? error.message : 'Failed to setup service worker');
      throw error;
    } finally {
      setIsCheckingServiceWorker(false);
    }
  };

  useEffect(() => {
    const setupServiceWorker = async () => {
      setIsRetrying(true);
      try {
        await executeWithRetry(
          async () => {
            await checkServiceWorker();
          },
          3
        );
      } catch (error) {
        console.error('Service worker setup failed after multiple attempts:', error);
        toast({
          title: "Service Worker Error",
          description: "Failed to set up notifications. Please try again or check browser settings.",
          variant: "destructive"
        });
      } finally {
        setIsRetrying(false);
      }
    };

    setupServiceWorker();
  }, []);

  const handleTestNotification = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to use push notifications",
        variant: "destructive"
      });
      return;
    }

    if (!subscription) {
      toast({
        title: "Error",
        description: "Please enable notifications first",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSending(true);
      console.log('Sending test notification...');
      
      const { data, error } = await supabase.functions.invoke('notifications', {
        body: {
          action: 'createNotification',
          params: {
            recipientId: user.id,
            title: "Test Push Notification",
            content: "This is a test push notification from your dashboard!",
            priority: "medium",
            categoryId: "test",
            metadata: {
              source: "notification-tester",
              timestamp: new Date().toISOString()
            }
          }
        }
      });

      if (error) throw error;
      
      const pushStatus = data?.push_status;
      
      if (pushStatus?.success) {
        console.log('Test notification sent successfully');
        toast({
          title: "Success",
          description: "Test notification sent successfully!",
        });
      } else {
        throw new Error(pushStatus?.error || 'Push notification failed to send');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast({
        title: "Notification Error",
        description: error instanceof Error ? error.message : "Failed to send test notification",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

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
    return (
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Setting up notifications...
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    );
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
        {registrationError && (
          <div className="border border-red-200 bg-red-50 p-4 rounded-md mb-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">Error: {registrationError}</p>
            </div>
          </div>
        )}
        
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
              onClick={handleTestNotification}
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
