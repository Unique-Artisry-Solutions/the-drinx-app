
import { useTestNotification } from './testing/useTestNotification';

export function useNotificationTesting() {
  const { isSending, sendTestNotification } = useTestNotification();
  
  return {
    isLoading: isSending, // Map isSending to isLoading for backward compatibility
    error: null, // Provide a default error value since useTestNotification doesn't return one
    sendTestNotification
  };
}
