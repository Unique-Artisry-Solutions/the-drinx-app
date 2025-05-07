
import { toast } from '@/hooks/use-toast';
import { ActionConfig } from '@/hooks/use-toast';
import { ToastActionElement } from '@/components/ui/toast';
import { ReactElement } from 'react';

/**
 * Helper to create toast actions for both JS and JSX contexts
 */
export interface ToastActionConfig {
  label: string;
  onClick: () => void;
  altText?: string;
}

/**
 * Creates a toast configuration that works in both JS and TSX environments
 * This avoids issues with trying to use JSX in .ts files
 */
export const createToast = (
  title: string,
  description: string,
  actionConfig?: ToastActionConfig,
  options?: { 
    duration?: number; 
    variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
    priority?: 'low' | 'medium' | 'high' | 'urgent'; 
  }
) => {
  // In a .ts file, don't return JSX for the action
  const toastConfig: {
    title: string;
    description: string;
    action?: ActionConfig;
    duration?: number;
    variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  } = {
    title,
    description,
    ...(options || {}),
  };

  if (actionConfig) {
    toastConfig.action = {
      label: actionConfig.label,
      onClick: actionConfig.onClick,
      altText: actionConfig.altText
    };
  }

  return toastConfig;
};

/**
 * Shows a toast notification with standard formatting
 */
export const showToast = (
  title: string,
  description: string,
  actionConfig?: ToastActionConfig,
  options?: { 
    duration?: number; 
    variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }
) => {
  // In a TS context, we can't directly create JSX, so we pass the config
  // and let the toast function handle it internally
  const toastConfig: {
    title: string;
    description: string;
    action?: ActionConfig;
    duration?: number;
    variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  } = {
    title,
    description,
    ...(options || {}),
  };
  
  if (actionConfig) {
    toastConfig.action = {
      label: actionConfig.label,
      onClick: actionConfig.onClick,
      altText: actionConfig.altText
    };
  }
  
  // Return the toast instance
  return toast(toastConfig);
};

/**
 * Shows a recovery toast for session issues
 */
export const showRecoveryToast = () => {
  return toast({
    title: "Session reset",
    description: "Your session has been reset. Please sign in again.",
    action: {
      label: "Refresh Now",
      onClick: () => window.location.reload(),
      altText: "Refresh Now"
    },
    priority: 'high',
    variant: 'warning'
  });
};

/**
 * Shows a stuck state toast for loading issues
 */
export const showStuckStateToast = () => {
  return toast({
    title: "Loading issue detected",
    description: "The application seems to be stuck. Click to refresh.",
    action: {
      label: "Refresh Now",
      onClick: () => window.location.reload(),
      altText: "Refresh Now"
    },
    priority: 'urgent',
    variant: 'destructive',
    duration: 0
  });
};
