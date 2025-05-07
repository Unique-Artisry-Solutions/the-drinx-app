
import { ReactNode } from 'react';
import { ToastActionElement } from '@/components/ui/toast';

/**
 * Central definition for notification-related types
 */

export interface NotificationOptions {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
    altText?: string;
  };
}

export interface Toast {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ToastActionElement | ActionConfig;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: 'default' | 'destructive';
  duration?: number;
}

export interface ActionConfig {
  label: string;
  onClick: () => void;
  altText?: string;
}
