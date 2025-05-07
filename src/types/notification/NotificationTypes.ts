
import { ReactNode } from 'react';
import { ToastActionElement } from '@/components/ui/toast';

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

/**
 * Interface for notification action configuration
 */
export interface ActionConfig {
  label: string;
  onClick: () => void;
  altText?: string;
}
