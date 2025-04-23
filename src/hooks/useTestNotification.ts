
import { useNotificationSender } from './notifications/useNotificationSender';
import { useNotificationToasts } from './notifications/useNotificationToasts';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/lib/supabase';

export const useTestNotification = () => {
  const { isSending, isRegistering, sendNotification } = useNotificationSender();
  const { showSuccessToast, showErrorToast, showAuthErrorToast } = useNotificationToasts();
  const { user } = useAuth();

  const sendTestNotification = async () => {
    if (!user) {
      showAuthErrorToast();
      return;
    }

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
        // Edge function returned an error
        console.error('[useTestNotification] Edge function error:', error);
        showErrorToast(error instanceof Error ? error : new Error('Failed to send test notification'));
        return;
      }

      if (data && data.success) {
        console.log('Test notification sent successfully');
        showSuccessToast();
      } else {
        // Edge function returned a non-successful payload
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
  };

  return {
    isSending: isSending || isRegistering,
    sendTestNotification
  };
};
