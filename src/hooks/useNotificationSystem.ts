
import { useState } from 'react';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';
import { safeJsonToRecord } from '@/utils/typeGuards';

type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
type NotificationChannel = 'email' | 'in_app' | 'push';

interface NotificationOptions {
  title: string;
  content: string;
  priority?: NotificationPriority;
  channels?: NotificationChannel[];
  metadata?: Record<string, any>;
}

export const useNotificationSystem = () => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const sendNotification = async (
    recipientId: string,
    options: NotificationOptions
  ): Promise<boolean> => {
    setIsSending(true);
    
    try {
      const {
        title,
        content,
        priority = 'medium',
        metadata = {}
      } = options;
      
      // Sanitize metadata to ensure it's a valid object
      const safeMetadata = safeJsonToRecord(metadata);

      const { error } = await supabase
        .from('notifications')
        .insert({
          recipient_id: recipientId,
          title,
          content,
          priority,
          metadata: safeMetadata,
        });

      if (error) {
        console.error('Error sending notification:', error);
        toast({
          title: 'Notification Error',
          description: 'Failed to send notification.',
          variant: 'destructive',
        });
        return false;
      }

      toast({
        title: 'Notification Sent',
        description: 'Your notification has been delivered.',
      });
      
      return true;
    } catch (err) {
      console.error('Error in notification system:', err);
      toast({
        title: 'System Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return {
    sendNotification,
    isSending
  };
};
