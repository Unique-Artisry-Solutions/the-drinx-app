
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
    toastService.debouncedError(title, description, debounceMs);
  },

  /**
   * Show a success toast with debouncing
   */
  success: (title: string, description: string, debounceMs = 5000) => {
    toastService.debouncedSuccess(title, description, debounceMs);
  },

  /**
   * Show an info toast with debouncing
   */
  info: (title: string, description: string, debounceMs = 5000) => {
    toastService.debouncedInfo(title, description, debounceMs);
  },

  /**
   * Show a warning toast with debouncing
   */
  warning: (title: string, description: string, debounceMs = 5000) => {
    toastService.debouncedWarning(title, description, debounceMs);
  },

  /**
   * Generic toast method for any notification type
   */
  show: (title: string, description: string, type: NotificationType = 'info', debounceMs = 5000) => {
    toastService.debouncedToast(title, description, type, debounceMs);
  },

  /**
   * Clear all pending toasts
   */
  clear: () => {
    toastService.clearAll();
  }
};
