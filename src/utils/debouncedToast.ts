
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
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

/**
 * Create a debounced toast system to prevent duplicate toasts
 * This uses the ToastService singleton for consistency
 */
export const debouncedToast = {
  /**
   * Show an error toast with debouncing
   */
  error: (title: string, description: string, options: DebouncedToastOptions | number = {}) => {
    const opts = typeof options === 'number' ? { debounceMs: options } : options;
    const { debounceMs = 5000, ...restOptions } = opts;
    toastService.error(title, description, { 
      ...restOptions,
      priority: restOptions.priority || 'high'
    });
  },

  /**
   * Show a success toast with debouncing
   */
  success: (title: string, description: string, options: DebouncedToastOptions | number = {}) => {
    const opts = typeof options === 'number' ? { debounceMs: options } : options;
    const { debounceMs = 5000, ...restOptions } = opts;
    toastService.success(title, description, { 
      ...restOptions,
      priority: restOptions.priority || 'medium'
    });
  },

  /**
   * Show an info toast with debouncing
   */
  info: (title: string, description: string, options: DebouncedToastOptions | number = {}) => {
    const opts = typeof options === 'number' ? { debounceMs: options } : options;
    const { debounceMs = 5000, ...restOptions } = opts;
    toastService.info(title, description, { 
      ...restOptions,
      priority: restOptions.priority || 'low'
    });
  },

  /**
   * Show a warning toast with debouncing
   */
  warning: (title: string, description: string, options: DebouncedToastOptions | number = {}) => {
    const opts = typeof options === 'number' ? { debounceMs: options } : options;
    const { debounceMs = 5000, ...restOptions } = opts;
    toastService.warning(title, description, { 
      ...restOptions,
      priority: restOptions.priority || 'medium'
    });
  },

  /**
   * Generic toast method for any notification type
   */
  show: (title: string, description: string, type: NotificationType = 'info', options: DebouncedToastOptions | number = {}) => {
    const opts = typeof options === 'number' ? { debounceMs: options } : options;
    const { debounceMs = 5000, ...restOptions } = opts;
    
    // Set appropriate default priority based on notification type
    const priority = restOptions.priority || 
      (type === 'error' ? 'high' : 
       type === 'warning' ? 'medium' : 
       type === 'success' ? 'medium' : 'low');
    
    switch (type) {
      case 'error':
        toastService.error(title, description, { ...restOptions, priority });
        break;
      case 'success':
        toastService.success(title, description, { ...restOptions, priority });
        break;
      case 'warning':
        toastService.warning(title, description, { ...restOptions, priority });
        break;
      default:
        toastService.info(title, description, { ...restOptions, priority });
    }
  },

  /**
   * Clear all pending toasts
   */
  clear: () => {
    toastService.clearAll();
  }
};
