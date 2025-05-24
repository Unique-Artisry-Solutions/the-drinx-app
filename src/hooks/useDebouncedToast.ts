
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { toastDeduplication } from '@/utils/toastDeduplication';

interface DebouncedToastOptions {
  title: string;
  description: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
    altText?: string;
  };
}

export const useDebouncedToast = () => {
  const { toast } = useToast();

  const showToast = useCallback((options: DebouncedToastOptions) => {
    const toastKey = {
      title: options.title,
      description: options.description,
      type: options.variant
    };

    if (toastDeduplication.shouldShowToast(toastKey)) {
      return toast(options);
    }
    
    return { id: '', dismiss: () => {}, update: () => {} };
  }, [toast]);

  const showError = useCallback((title: string, description: string, options?: Omit<DebouncedToastOptions, 'title' | 'description' | 'variant'>) => {
    return showToast({
      title,
      description,
      variant: 'destructive',
      ...options
    });
  }, [showToast]);

  const showSuccess = useCallback((title: string, description: string, options?: Omit<DebouncedToastOptions, 'title' | 'description' | 'variant'>) => {
    return showToast({
      title,
      description,
      variant: 'success',
      ...options
    });
  }, [showToast]);

  const showWarning = useCallback((title: string, description: string, options?: Omit<DebouncedToastOptions, 'title' | 'description' | 'variant'>) => {
    return showToast({
      title,
      description,
      variant: 'warning',
      ...options
    });
  }, [showToast]);

  const showInfo = useCallback((title: string, description: string, options?: Omit<DebouncedToastOptions, 'title' | 'description' | 'variant'>) => {
    return showToast({
      title,
      description,
      variant: 'info',
      ...options
    });
  }, [showToast]);

  return {
    showToast,
    showError,
    showSuccess,
    showWarning,
    showInfo
  };
};
