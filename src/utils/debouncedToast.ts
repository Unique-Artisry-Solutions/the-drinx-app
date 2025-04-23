import { toast } from '@/hooks/use-toast';

// Create a debounced toast system to prevent duplicate toasts
const toastTimeouts: Record<string, NodeJS.Timeout> = {};

export const debouncedToast = {
  error: (title: string, description: string, debounceMs = 5000) => {
    const key = `${title}-${description}`;
    if (toastTimeouts[key]) clearTimeout(toastTimeouts[key]);
    toastTimeouts[key] = setTimeout(() => {
      toast({
        title,
        description,
        variant: "destructive"
      });
      delete toastTimeouts[key];
    }, 100);
  },
  success: (title: string, description: string, debounceMs = 5000) => {
    const key = `${title}-${description}`;
    if (toastTimeouts[key]) clearTimeout(toastTimeouts[key]);
    toastTimeouts[key] = setTimeout(() => {
      toast({
        title,
        description,
      });
      delete toastTimeouts[key];
    }, 100);
  },
  info: (title: string, description: string, debounceMs = 5000) => {
    const key = `${title}-${description}`;
    if (toastTimeouts[key]) clearTimeout(toastTimeouts[key]);
    toastTimeouts[key] = setTimeout(() => {
      toast({
        title,
        description,
        variant: "default"
      });
      delete toastTimeouts[key];
    }, 100);
  },
  // Clear all pending toasts
  clear: () => {
    Object.keys(toastTimeouts).forEach(key => {
      clearTimeout(toastTimeouts[key]);
      delete toastTimeouts[key];
    });
  }
};
