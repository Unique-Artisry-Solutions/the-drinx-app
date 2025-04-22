
import { useNotificationSender } from './notifications/useNotificationSender';
import { useNotificationToasts } from './notifications/useNotificationToasts';
import { useAuth } from '@/contexts/auth';

export const useTestNotification = () => {
  const { isSending, sendNotification } = useNotificationSender();
  const { showSuccessToast, showErrorToast, showAuthErrorToast } = useNotificationToasts();
  const { user } = useAuth();

  const sendTestNotification = async () => {
    if (!user) {
      showAuthErrorToast();
      return;
    }

    try {
      const pushStatus = await sendNotification();
      
      if (pushStatus.success) {
        console.log('Test notification sent successfully');
        showSuccessToast();
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      showErrorToast(error instanceof Error ? error : new Error('Failed to send test notification'));
    }
  };

  return {
    isSending,
    sendTestNotification
  };
};
