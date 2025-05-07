
import { ReactNode } from 'react';
import { ToastActionElement } from '@/components/ui/toast';
import { ActionConfig } from '@/hooks/use-toast';

/**
 * Central definition for notification-related types
 */

export interface NotificationOptions {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: ActionConfig;
}

export interface Toast {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ToastActionElement | ActionConfig;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  duration?: number;
}

// Re-export the ActionConfig type from use-toast for consistency
export { ActionConfig };
