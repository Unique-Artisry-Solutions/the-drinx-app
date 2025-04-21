
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Bell, BellOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const NotificationTester = () => {
  const { isSupported, subscription } = usePushNotifications();
  const { toast } = useToast();

  const handleTestNotification = async () => {
    if (!subscription) {
      toast({
        title: "Error",
        description: "Please enable notifications first",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('notifications', {
        body: {
          action: 'createNotification',
          params: {
            recipientId: subscription.user_id,
            title: "Test Push Notification",
            content: "This is a test push notification from your dashboard!",
            priority: "medium",
            categoryId: "test",
            metadata: {
              source: "notification-tester"
            }
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Test notification sent!",
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast({
        title: "Error",
        description: "Failed to send test notification",
        variant: "destructive"
      });
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
      <CardContent>
        <Button 
          onClick={handleTestNotification}
          disabled={!subscription}
          className="flex gap-2"
        >
          <Bell className="h-4 w-4" />
          Send Test Notification
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationTester;
