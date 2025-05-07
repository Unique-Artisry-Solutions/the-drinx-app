
import { ReactNode } from 'react';
import { ToastActionElement } from '@/components/ui/toast';
import { ActionConfig } from '@/hooks/use-toast';

/**
 * Notification types used throughout the application
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Interface for notification options
 */
export interface NotificationOptions {
  title: string;
  message: string;
  type?: NotificationType;
  duration?: number;
  action?: ActionConfig;
}
