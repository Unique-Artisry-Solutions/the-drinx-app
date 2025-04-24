
import { useNotificationSender } from '../useNotificationSender';
import { useNotificationToasts } from '../useNotificationToasts';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/lib/supabase';
import { useEnhancedNotificationTesting } from './useEnhancedNotificationTesting';

export const useTestNotification = () => {
  const { isSending, isRegistering, sendNotification } = useNotificationSender();
  const { showSuccessToast, showErrorToast, showAuthErrorToast } = useNotificationToasts();
  const { user } = useAuth();
  const { sendEnhancedTestNotification } = useEnhancedNotificationTesting();

  const sendTestNotification = async () => {
    if (!user) {
      showAuthErrorToast();
      return;
    }

    try {
      // Try the enhanced local notification first
      // This is more reliable for testing and doesn't require server interaction
      await sendEnhancedTestNotification();
      return;
    } catch (localError) {
      console.warn('Local notification failed, falling back to edge function:', localError);
      
      // If that fails, fall back to the edge function
      try {
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
          showErrorToast(error instanceof Error ? error : new Error('Failed to send test notification'));
          return;
        }

        if (data && data.success) {
          console.log('Test notification sent successfully');
          showSuccessToast();
        } else {
          console.error('[useTestNotification] Edge function response is not successful:', data);
          showErrorToast(
            typeof data?.error === 'string'
              ? new Error(data.error)
              : new Error('Unknown error from notification function')
          );
        }
      } catch (err) {
        console.error('[useTestNotification] Unexpected exception:', err);
        showErrorToast(err instanceof Error ? err : new Error('Failed to send test notification'));
      }
    }
  };

  return {
    isSending: isSending || isRegistering,
    sendTestNotification
  };
};
