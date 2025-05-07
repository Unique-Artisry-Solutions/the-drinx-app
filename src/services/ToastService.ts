
import { toast } from '@/hooks/use-toast';
import { 
  Notification, 
  NotificationType
} from '@/types/notification';
import { mapNotificationTypeToToastVariant } from '@/types/notification/ToastTypes';
import { ActionConfig } from '@/hooks/use-toast';

/**
 * A singleton service that provides a unified interface for displaying toasts
 * Wraps the shadcn/ui toast system
 */
class ToastService {
  private static instance: ToastService;
  private toastTimeouts: Record<string, NodeJS.Timeout> = {};

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): ToastService {
    if (!ToastService.instance) {
      ToastService.instance = new ToastService();
    }
    return ToastService.instance;
  }

  /**
   * Show a toast with the specified options
   */
  public show(options: {
    title: string;
    message: string;
    type?: NotificationType;
    duration?: number;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    action?: {
      label: string;
      onClick: () => void;
      altText?: string;
    };
  }): { id: string; dismiss: () => void } {
    const { title, message, type = 'info', duration = 5000, priority = 'medium', action } = options;
    
    // Map notification types to valid toast variants
    const variant = mapNotificationTypeToToastVariant(type);
    
    // Convert the NotificationOptions action to an ActionConfig
    let toastAction: ActionConfig | undefined;
    if (action) {
      toastAction = {
        label: action.label,
        onClick: action.onClick,
        altText: action.altText || action.label
      };
    }

    const toastResult = toast({
      title,
      description: message,
      variant,
      priority,
      duration,
      action: toastAction
    });

    return toastResult;
  }

  /**
   * Show a success toast
   */
  public success(title: string, message: string, options?: {
    action?: {
      label: string;
      onClick: () => void;
      altText?: string;
    };
    duration?: number;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }): { id: string; dismiss: () => void } {
    return this.show({
      title,
      message,
      type: 'success',
      ...(options || {})
    });
  }

  /**
   * Show an error toast
   */
  public error(title: string, message: string, options?: {
    action?: {
      label: string;
      onClick: () => void;
      altText?: string;
    };
    duration?: number;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }): { id: string; dismiss: () => void } {
    return this.show({
      title,
      message,
      type: 'error',
      priority: options?.priority || 'high',
      ...(options || {})
    });
  }

  /**
   * Show an info toast
   */
  public info(title: string, message: string, options?: {
    action?: {
      label: string;
      onClick: () => void;
      altText?: string;
    };
    duration?: number;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }): { id: string; dismiss: () => void } {
    return this.show({
      title,
      message,
      type: 'info',
      ...(options || {})
    });
  }

  /**
   * Show a warning toast
   */
  public warning(title: string, message: string, options?: {
    action?: {
      label: string;
      onClick: () => void;
      altText?: string;
    };
    duration?: number;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }): { id: string; dismiss: () => void } {
    return this.show({
      title,
      message,
      type: 'warning',
      priority: options?.priority || 'medium',
      ...(options || {})
    });
  }

  /**
   * Show a debounced toast (prevents duplicate toasts)
   */
  public debounced(key: string, options: {
    title: string;
    message: string;
    type?: NotificationType;
    duration?: number;
    action?: {
      label: string;
      onClick: () => void;
      altText?: string;
    };
  }, debounceMs: number = 5000): void {
    if (this.toastTimeouts[key]) {
      clearTimeout(this.toastTimeouts[key]);
    }
    
    this.toastTimeouts[key] = setTimeout(() => {
      this.show(options);
      delete this.toastTimeouts[key];
    }, debounceMs);
  }

  /**
   * Show a debounced success toast
   */
  public debouncedSuccess(title: string, message: string, debounceMs: number = 5000): void {
    const key = `success-${title}-${message}`;
    this.debounced(key, {
      title,
      message,
      type: 'success'
    }, debounceMs);
  }

  /**
   * Show a debounced error toast
   */
  public debouncedError(title: string, message: string, debounceMs: number = 5000): void {
    const key = `error-${title}-${message}`;
    this.debounced(key, {
      title,
      message,
      type: 'error'
    }, debounceMs);
  }

  /**
   * Show a debounced info toast
   */
  public debouncedInfo(title: string, message: string, debounceMs: number = 5000): void {
    const key = `info-${title}-${message}`;
    this.debounced(key, {
      title,
      message,
      type: 'info'
    }, debounceMs);
  }

  /**
   * Clear all pending toasts
   */
  public clearAll(): void {
    Object.keys(this.toastTimeouts).forEach(key => {
      clearTimeout(this.toastTimeouts[key]);
      delete this.toastTimeouts[key];
    });
  }
}

// Export a singleton instance
export const toastService = ToastService.getInstance();
