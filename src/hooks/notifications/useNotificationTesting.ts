
import { useTestNotification } from './testing/useTestNotification';

export function useNotificationTesting() {
  const { isLoading, sendTestNotification } = useTestNotification();
  
  return {
    isLoading, // Direct pass-through of isLoading
    error: null, // Provide a default error value since useTestNotification doesn't return one
    sendTestNotification
  };
}
