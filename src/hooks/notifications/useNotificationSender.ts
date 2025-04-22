
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';

export const useNotificationSender = () => {
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();

  const sendNotification = async () => {
    if (!user) {
      throw new Error("Authentication Required");
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
      
      if (!pushStatus?.success) {
        throw new Error(pushStatus?.error || 'Push notification failed to send');
      }

      return pushStatus;
    } finally {
      setIsSending(false);
    }
  };

  return {
    isSending,
    sendNotification
  };
};
