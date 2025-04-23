
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
    }, debounceMs);
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
    }, debounceMs);
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
    }, debounceMs);
  },

  // Clear all pending toasts
  clear: () => {
    Object.keys(toastTimeouts).forEach(key => {
      clearTimeout(toastTimeouts[key]);
      delete toastTimeouts[key];
    });
  }
};
