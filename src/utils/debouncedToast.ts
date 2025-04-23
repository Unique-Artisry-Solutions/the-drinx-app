
import { toast } from '@/hooks/use-toast';

// Create a debounced toast system to prevent duplicate toasts
const toastTimeouts: Record<string, NodeJS.Timeout> = {};

export const debouncedToast = {
  error: (title: string, description: string, debounceMs = 5000) => {
    const key = `${title}-${description}`;
    
    // Clear existing timeout for the same message if it exists
    if (toastTimeouts[key]) {
      clearTimeout(toastTimeouts[key]);
    }
    
    // Set new timeout
    toastTimeouts[key] = setTimeout(() => {
      toast({
        title,
        description,
        variant: "destructive"
      });
      
      // Clean up after showing
      delete toastTimeouts[key];
    }, 100); // Short delay to debounce multiple quick calls
  },
  
  success: (title: string, description: string, debounceMs = 5000) => {
    const key = `${title}-${description}`;
    
    // Clear existing timeout for the same message if it exists
    if (toastTimeouts[key]) {
      clearTimeout(toastTimeouts[key]);
    }
    
    // Set new timeout
    toastTimeouts[key] = setTimeout(() => {
      toast({
        title,
        description,
      });
      
      // Clean up after showing
      delete toastTimeouts[key];
    }, 100); // Short delay to debounce multiple quick calls
  },
  
  // Clear all pending toasts
  clear: () => {
    Object.keys(toastTimeouts).forEach(key => {
      clearTimeout(toastTimeouts[key]);
      delete toastTimeouts[key];
    });
  }
};
