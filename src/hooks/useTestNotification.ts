
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';

export const useTestNotification = () => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const sendTestNotification = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to use push notifications",
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

  return {
    isSending,
    sendTestNotification
  };
};
