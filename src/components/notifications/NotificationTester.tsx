
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Bell, BellOff, BellRing } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';

const NotificationTester = () => {
  const { isSupported, subscription, permissionStatus, isLoading, subscribeToNotifications } = usePushNotifications();
  const [isSending, setIsSending] = useState(false);
  const [hasServiceWorker, setHasServiceWorker] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if service worker is active
  useEffect(() => {
    const checkServiceWorker = async () => {
      try {
        if (!('serviceWorker' in navigator)) return;
        
        const registrations = await navigator.serviceWorker.getRegistrations();
        setHasServiceWorker(registrations.length > 0);
      } catch (error) {
        console.error('Error checking service worker:', error);
      }
    };
    
    checkServiceWorker();
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
        description: error instanceof Error ? error.message : "Failed to send test notification. Please ensure you're logged in.",
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Push Notifications</CardTitle>
        <CardDescription>
          Test and manage push notification settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
              {!hasServiceWorker && ' Service worker needs to be registered.'}
            </p>
            <Button 
              onClick={subscribeToNotifications}
              disabled={isLoading}
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
