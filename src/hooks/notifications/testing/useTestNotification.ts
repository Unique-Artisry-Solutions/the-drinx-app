
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';

export type NotificationRole = 'user' | 'promoter' | 'establishment' | 'admin';
export type NotificationDirection = 'to' | 'from';

export interface RoleBasedNotificationConfig {
  sourceRole: NotificationRole;
  targetRole: NotificationRole;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
}

export function useTestNotification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const sendTestNotification = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to send test notifications",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Call the edge function directly for test notification
      const { data, error } = await supabase.functions.invoke('notifications', {
        body: {
          action: 'testPushNotification',
          params: {
            userId: user.id
          }
        }
      });

      if (error) {
        console.error('[useTestNotification] Edge function error:', error);
        setError(error instanceof Error ? error.message : 'Failed to send test notification');
        toast({
          title: "Notification Error",
          description: error instanceof Error ? error.message : 'Failed to send test notification',
          variant: "destructive"
        });
        return;
      }

      if (data && data.success) {
        console.log('Test notification sent successfully');
        toast({
          title: "Success",
          description: "Test notification sent successfully",
        });
      } else {
        const errorMsg = typeof data?.error === 'string'
          ? data.error
          : 'Unknown error from notification function';
        setError(errorMsg);
        toast({
          title: "Notification Error",
          description: errorMsg,
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('[useTestNotification] Unexpected exception:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to send test notification';
      setError(errorMsg);
      toast({
        title: "Notification Error",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendRoleBasedNotification = async (config: RoleBasedNotificationConfig) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to send test notifications",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log(`[RoleNotificationTesting] Sending ${config.sourceRole} to ${config.targetRole} notification`);
      
      // This would call an edge function to handle role-based notifications
      // For now, we just show a toast to simulate success
      toast({
        title: "Role-based Test Started",
        description: `Sending ${config.sourceRole} to ${config.targetRole} notification (${config.priority} priority)`,
      });
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Role-based Test Complete",
        description: `Successfully sent ${config.sourceRole} to ${config.targetRole} notification`,
      });
      
      return { success: true };
    } catch (err) {
      console.error('[useTestNotification] Role-based error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to send role-based notification';
      setError(errorMsg);
      toast({
        title: "Notification Error",
        description: errorMsg,
        variant: "destructive"
      });
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    sendTestNotification,
    sendRoleBasedNotification
  };
}
