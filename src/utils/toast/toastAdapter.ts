
import { toast, ActionConfig } from '@/hooks/use-toast';
import { ToastVariant } from '@/types/notification/ToastTypes';

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
  options?: { duration?: number; variant?: ToastVariant }
) => {
  // In a .ts file, don't return JSX for the action
  const toastConfig: {
    title: string;
    description: string;
    action?: ToastActionConfig;
    duration?: number;
    variant?: ToastVariant;
  } = {
    title,
    description,
    ...(options || {}),
  };

  if (actionConfig) {
    toastConfig.action = actionConfig;
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
  options?: { duration?: number; variant?: ToastVariant }
) => {
  // In a TS context, we can't directly create JSX, so we pass the config
  // and let the toast function handle it internally
  const toastConfig: {
    title: string;
    description: string;
    action?: ToastActionConfig;
    duration?: number;
    variant?: ToastVariant;
  } = {
    title,
    description,
    ...(options || {}),
  };
  
  if (actionConfig) {
    toastConfig.action = actionConfig;
  }
  
  // Return the toast instance
  return toast(toastConfig);
};

/**
 * Shows a success toast
 */
export const showSuccessToast = (
  title: string,
  description: string,
  actionConfig?: ToastActionConfig,
  duration?: number
) => {
  return showToast(title, description, actionConfig, { duration, variant: 'success' });
};

/**
 * Shows an error toast
 */
export const showErrorToast = (
  title: string,
  description: string,
  actionConfig?: ToastActionConfig,
  duration?: number
) => {
  return showToast(title, description, actionConfig, { duration, variant: 'destructive' });
};

/**
 * Shows a warning toast
 */
export const showWarningToast = (
  title: string,
  description: string,
  actionConfig?: ToastActionConfig,
  duration?: number
) => {
  return showToast(title, description, actionConfig, { duration, variant: 'warning' });
};

/**
 * Shows an info toast
 */
export const showInfoToast = (
  title: string,
  description: string,
  actionConfig?: ToastActionConfig,
  duration?: number
) => {
  return showToast(title, description, actionConfig, { duration, variant: 'info' });
};

/**
 * Shows a recovery toast for session issues
 */
export const showRecoveryToast = () => {
  return showWarningToast(
    "Session reset",
    "Your session has been reset. Please sign in again.",
    {
      label: "Refresh Now",
      onClick: () => window.location.reload(),
      altText: "Refresh Now"
    }
  );
};

/**
 * Shows a stuck state toast for loading issues
 */
export const showStuckStateToast = () => {
  return showErrorToast(
    "Loading issue detected",
    "The application seems to be stuck. Click to refresh.",
    {
      label: "Refresh Now",
      onClick: () => window.location.reload(),
      altText: "Refresh Now"
    },
    0 // Duration of 0 means it won't auto-dismiss
  );
};
