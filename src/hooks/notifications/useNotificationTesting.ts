
import { useTestNotification } from './testing/useTestNotification';

export function useNotificationTesting() {
  const { isLoading, error, sendTestNotification } = useTestNotification();
  
  return {
    isLoading,
    error,
    sendTestNotification
  };
}
