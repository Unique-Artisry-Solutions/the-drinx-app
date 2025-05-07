
import { toastService } from '@/services/ToastService';

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
   * Clear all pending toasts
   */
  clear: () => {
    toastService.clearAll();
  }
};
