
import { toastService } from '@/services/ToastService';
import { NotificationType } from '@/types/notification';

// Define extended options with debounceMs
interface DebouncedToastOptions {
  debounceMs?: number;
  action?: {
    label: string;
    onClick: () => void;
    altText?: string;
  };
  duration?: number;
}

/**
 * Create a debounced toast system to prevent duplicate toasts
 * This uses the ToastService singleton for consistency
 */
export const debouncedToast = {
  /**
   * Show an error toast with debouncing
   */
  error: (title: string, description: string, options: DebouncedToastOptions = {}) => {
    const { debounceMs = 5000, ...restOptions } = options;
    toastService.error(title, description, { ...restOptions, duration: options.duration });
  },

  /**
   * Show a success toast with debouncing
   */
  success: (title: string, description: string, options: DebouncedToastOptions = {}) => {
    const { debounceMs = 5000, ...restOptions } = options;
    toastService.success(title, description, { ...restOptions, duration: options.duration });
  },

  /**
   * Show an info toast with debouncing
   */
  info: (title: string, description: string, options: DebouncedToastOptions = {}) => {
    const { debounceMs = 5000, ...restOptions } = options;
    toastService.info(title, description, { ...restOptions, duration: options.duration });
  },

  /**
   * Show a warning toast with debouncing
   */
  warning: (title: string, description: string, options: DebouncedToastOptions = {}) => {
    const { debounceMs = 5000, ...restOptions } = options;
    toastService.warning(title, description, { ...restOptions, duration: options.duration });
  },

  /**
   * Generic toast method for any notification type
   */
  show: (title: string, description: string, type: NotificationType = 'info', options: DebouncedToastOptions = {}) => {
    const { debounceMs = 5000, ...restOptions } = options;
    
    switch (type) {
      case 'error':
        toastService.error(title, description, restOptions);
        break;
      case 'success':
        toastService.success(title, description, restOptions);
        break;
      case 'warning':
        toastService.warning(title, description, restOptions);
        break;
      default:
        toastService.info(title, description, restOptions);
    }
  },

  /**
   * Clear all pending toasts
   */
  clear: () => {
    toastService.clearAll();
  }
};
