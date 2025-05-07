
import { ReactNode } from 'react';
import { NotificationType } from './NotificationTypes';

/**
 * Toast variant type mapping to notification types
 * Now includes all variants defined in the toast component
 */
export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';

/**
 * Helper function to map notification types to toast variants
 */
export const mapNotificationTypeToToastVariant = (type?: NotificationType): ToastVariant => {
  switch (type) {
    case 'error':
      return 'destructive';
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    case 'info':
      return 'info';
    default:
      return 'default';
  }
};

/**
 * Interface for toast data
 */
export interface Toast {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: ToastVariant;
  duration?: number;
}
