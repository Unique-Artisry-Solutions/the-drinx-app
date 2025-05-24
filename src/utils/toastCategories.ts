
/**
 * Toast categories to prevent spam and manage toast display
 */
export interface ToastCategory {
  key: string;
  debounceMs: number;
  maxDisplayCount: number;
  resetIntervalMs: number;
}

export const TOAST_CATEGORIES = {
  AUTH_ERROR: {
    key: 'auth_error',
    debounceMs: 5000,
    maxDisplayCount: 3,
    resetIntervalMs: 60000 // Reset count every minute
  },
  AUTH_SUCCESS: {
    key: 'auth_success',
    debounceMs: 3000,
    maxDisplayCount: 2,
    resetIntervalMs: 30000
  },
  AUTH_RECOVERY: {
    key: 'auth_recovery',
    debounceMs: 8000,
    maxDisplayCount: 2,
    resetIntervalMs: 120000 // Reset count every 2 minutes
  },
  NAVIGATION_ERROR: {
    key: 'navigation_error',
    debounceMs: 3000,
    maxDisplayCount: 3,
    resetIntervalMs: 60000
  },
  FORM_VALIDATION: {
    key: 'form_validation',
    debounceMs: 2000,
    maxDisplayCount: 5,
    resetIntervalMs: 30000
  }
} as const;

/**
 * Toast spam prevention manager
 */
class ToastSpamManager {
  private displayCounts: Map<string, { count: number; lastReset: number }> = new Map();
  
  shouldAllowToast(category: ToastCategory): boolean {
    const now = Date.now();
    const record = this.displayCounts.get(category.key);
    
    if (!record) {
      this.displayCounts.set(category.key, { count: 1, lastReset: now });
      return true;
    }
    
    // Reset count if interval has passed
    if (now - record.lastReset > category.resetIntervalMs) {
      this.displayCounts.set(category.key, { count: 1, lastReset: now });
      return true;
    }
    
    // Check if we've exceeded max display count
    if (record.count >= category.maxDisplayCount) {
      console.log(`Toast spam prevented for category: ${category.key}`);
      return false;
    }
    
    // Increment count and allow
    record.count++;
    return true;
  }
  
  reset(categoryKey?: string): void {
    if (categoryKey) {
      this.displayCounts.delete(categoryKey);
    } else {
      this.displayCounts.clear();
    }
  }
}

export const toastSpamManager = new ToastSpamManager();
