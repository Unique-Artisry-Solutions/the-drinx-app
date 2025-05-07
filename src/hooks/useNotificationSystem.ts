
import { useCallback } from 'react';
import { toastService } from '@/services/ToastService';
import { NotificationOptions, NotificationType } from '@/types/notification';

/**
 * Hook that provides a unified notification system across the application
 * Acts as a wrapper around the ToastService
 */
export const useNotificationSystem = () => {
  const showNotification = useCallback(
    (options: NotificationOptions) => {
      return toastService.show(options);
    },
    []
  );

  const showSuccess = useCallback(
    (message: string, title: string = 'Success', options?: Partial<Omit<NotificationOptions, 'title' | 'message' | 'type'>>) => {
      return toastService.success(title, message, options);
    },
    []
  );

  const showError = useCallback(
    (message: string, title: string = 'Error', options?: Partial<Omit<NotificationOptions, 'title' | 'message' | 'type'>>) => {
      return toastService.error(title, message, options);
    },
    []
  );

  const showWarning = useCallback(
    (message: string, title: string = 'Warning', options?: Partial<Omit<NotificationOptions, 'title' | 'message' | 'type'>>) => {
      return toastService.warning(title, message, options);
    },
    []
  );

  const showInfo = useCallback(
    (message: string, title: string = 'Information', options?: Partial<Omit<NotificationOptions, 'title' | 'message' | 'type'>>) => {
      return toastService.info(title, message, options);
    },
    []
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
