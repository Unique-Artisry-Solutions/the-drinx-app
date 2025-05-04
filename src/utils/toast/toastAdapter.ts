
import { toast } from '@/hooks/use-toast';
import { ToastActionElement } from '@/components/ui/toast';
import { ButtonProps } from '@/components/ui/button';

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
  options?: { duration?: number; variant?: 'default' | 'destructive' }
) => {
  // In a .ts file, don't return JSX for the action
  const toastConfig = {
    title,
    description,
    ...(options || {}),
  };

  if (actionConfig) {
    // The action property will be properly interpreted as a JSX element
    // when used in recovery.tsx
    toastConfig['action'] = actionConfig;
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
  options?: { duration?: number; variant?: 'default' | 'destructive' }
) => {
  return toast(createToast(title, description, actionConfig, options));
};

/**
 * Shows a recovery toast for session issues
 */
export const showRecoveryToast = () => {
  return showToast(
    "Session reset",
    "Your session has been reset. Please sign in again.",
    {
      label: "Refresh Now",
      onClick: () => window.location.reload()
    }
  );
};

/**
 * Shows a stuck state toast for loading issues
 */
export const showStuckStateToast = () => {
  return showToast(
    "Loading issue detected",
    "The application seems to be stuck. Click to refresh.",
    {
      label: "Refresh Now",
      onClick: () => window.location.reload()
    },
    { duration: 0 }
  );
};
