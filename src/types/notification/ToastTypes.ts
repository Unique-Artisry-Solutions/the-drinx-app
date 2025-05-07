
import { ReactNode } from 'react';
import { NotificationType } from './NotificationTypes';

/**
 * Toast variant type mapping to notification types
 */
export type ToastVariant = 'default' | 'destructive';

/**
 * Helper function to map notification types to toast variants
 */
export const mapNotificationTypeToToastVariant = (type?: NotificationType): ToastVariant => {
  switch (type) {
    case 'error':
      return 'destructive';
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
