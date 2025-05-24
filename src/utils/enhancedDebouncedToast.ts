
import { toastService } from '@/services/ToastService';
import { NotificationType } from '@/types/notification';
import { TOAST_CATEGORIES, ToastCategory, toastSpamManager } from './toastCategories';

interface EnhancedToastOptions {
  debounceMs?: number;
  category?: ToastCategory;
  action?: {
    label: string;
    onClick: () => void;
    altText?: string;
  };
  duration?: number;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  bypassSpamCheck?: boolean;
}

/**
 * Enhanced debounced toast system with category-based spam prevention
 */
export const enhancedDebouncedToast = {
  /**
   * Show an auth error toast with proper categorization
   */
  authError: (title: string, description: string, options: Omit<EnhancedToastOptions, 'category'> = {}) => {
    const category = TOAST_CATEGORIES.AUTH_ERROR;
    
    if (!options.bypassSpamCheck && !toastSpamManager.shouldAllowToast(category)) {
      return;
    }
    
    toastService.error(title, description, {
      ...options,
      priority: options.priority || 'high',
      duration: options.duration || 5000
    });
  },

  /**
   * Show an auth success toast with proper categorization
   */
  authSuccess: (title: string, description: string, options: Omit<EnhancedToastOptions, 'category'> = {}) => {
    const category = TOAST_CATEGORIES.AUTH_SUCCESS;
    
    if (!options.bypassSpamCheck && !toastSpamManager.shouldAllowToast(category)) {
      return;
    }
    
    toastService.success(title, description, {
      ...options,
      priority: options.priority || 'medium',
      duration: options.duration || 3000
    });
  },

  /**
   * Show an auth recovery toast with proper categorization
   */
  authRecovery: (title: string, description: string, options: Omit<EnhancedToastOptions, 'category'> = {}) => {
    const category = TOAST_CATEGORIES.AUTH_RECOVERY;
    
    if (!options.bypassSpamCheck && !toastSpamManager.shouldAllowToast(category)) {
      return;
    }
    
    toastService.info(title, description, {
      ...options,
      priority: options.priority || 'medium',
      duration: options.duration || 8000
    });
  },

  /**
   * Show a navigation error toast with proper categorization
   */
  navigationError: (title: string, description: string, options: Omit<EnhancedToastOptions, 'category'> = {}) => {
    const category = TOAST_CATEGORIES.NAVIGATION_ERROR;
    
    if (!options.bypassSpamCheck && !toastSpamManager.shouldAllowToast(category)) {
      return;
    }
    
    toastService.error(title, description, {
      ...options,
      priority: options.priority || 'medium',
      duration: options.duration || 3000
    });
  },

  /**
   * Show a form validation toast with proper categorization
   */
  formValidation: (title: string, description: string, options: Omit<EnhancedToastOptions, 'category'> = {}) => {
    const category = TOAST_CATEGORIES.FORM_VALIDATION;
    
    if (!options.bypassSpamCheck && !toastSpamManager.shouldAllowToast(category)) {
      return;
    }
    
    toastService.warning(title, description, {
      ...options,
      priority: options.priority || 'low',
      duration: options.duration || 4000
    });
  },

  /**
   * Clear spam counters for a specific category or all categories
   */
  clearSpamCounters: (categoryKey?: string) => {
    toastSpamManager.reset(categoryKey);
  }
};
