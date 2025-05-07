
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NotificationOptions {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Hook that provides a unified notification system across the application
 * Acts as a wrapper around the shadcn/ui toast system
 */
export const useNotificationSystem = () => {
  const { toast } = useToast();

  const showNotification = useCallback(
    (options: NotificationOptions) => {
      const { title, message, type = 'info', duration = 5000, action } = options;

      // Map notification types to valid toast variants
      // Note: shadcn/ui toast only supports 'default' and 'destructive' variants
      const variant = type === 'error' ? 'destructive' : 'default';

      toast({
        title,
        description: message,
        variant,
        duration,
        action: action ? {
          label: action.label,
          onClick: action.onClick,
          altText: action.label
        } : undefined
      });
    },
    [toast]
  );

  const showSuccess = useCallback(
    (message: string, title: string = 'Success') => {
      showNotification({ title, message, type: 'success' });
    },
    [showNotification]
  );

  const showError = useCallback(
    (message: string, title: string = 'Error') => {
      showNotification({ title, message, type: 'error' });
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (message: string, title: string = 'Warning') => {
      showNotification({ title, message, type: 'warning' });
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (message: string, title: string = 'Information') => {
      showNotification({ title, message, type: 'info' });
    },
    [showNotification]
  );

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default useNotificationSystem;
