
import { ReactNode } from 'react';
import { NotificationType } from './NotificationTypes';

/**
 * Toast variant type mapping to notification types
 * We're standardizing on shadcn/ui's toast variants
 */
export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';

/**
 * Helper function to map notification types to toast variants
 */
export const mapNotificationTypeToToastVariant = (type?: NotificationType): ToastVariant => {
  switch (type) {
    case 'success':
      return 'success';
    case 'error':
      return 'destructive';
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
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}
