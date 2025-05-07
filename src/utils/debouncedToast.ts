
import { toastService } from '@/services/ToastService';
import { NotificationType } from '@/types/notification';

/**
 * Create a debounced toast system to prevent duplicate toasts
 * This uses the ToastService singleton for consistency
 */
export const debouncedToast = {
  /**
   * Show an error toast with debouncing
   */
  error: (title: string, description: string, debounceMs = 5000) => {
    toastService.error(title, description, { debounceMs });
  },

  /**
   * Show a success toast with debouncing
   */
  success: (title: string, description: string, debounceMs = 5000) => {
    toastService.success(title, description, { debounceMs });
  },

  /**
   * Show an info toast with debouncing
   */
  info: (title: string, description: string, debounceMs = 5000) => {
    toastService.info(title, description, { debounceMs });
  },

  /**
   * Show a warning toast with debouncing
   */
  warning: (title: string, description: string, debounceMs = 5000) => {
    toastService.warning(title, description, { debounceMs });
  },

  /**
   * Generic toast method for any notification type
   */
  show: (title: string, description: string, type: NotificationType = 'info', debounceMs = 5000) => {
    switch (type) {
      case 'error':
        toastService.error(title, description, { debounceMs });
        break;
      case 'success':
        toastService.success(title, description, { debounceMs });
        break;
      case 'warning':
        toastService.warning(title, description, { debounceMs });
        break;
      default:
        toastService.info(title, description, { debounceMs });
    }
  },

  /**
   * Clear all pending toasts
   */
  clear: () => {
    toastService.clearAll();
  }
};
