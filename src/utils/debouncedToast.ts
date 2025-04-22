
import { toast } from '@/hooks/use-toast';

// Create a map to track recent toasts by their message to prevent duplicates
const recentToasts = new Map<string, number>();
const TOAST_DEBOUNCE_TIME = 3000; // 3 seconds

const debouncedToast = {
  success: (title: string, description: string) => {
    const key = `success:${title}:${description}`;
    if (shouldShowToast(key)) {
      toast({
        title,
        description,
      });
    }
  },
  
  error: (title: string, description: string) => {
    const key = `error:${title}:${description}`;
    if (shouldShowToast(key)) {
      toast({
        title,
        description,
        variant: "destructive"
      });
    }
  },
  
  info: (title: string, description: string) => {
    const key = `info:${title}:${description}`;
    if (shouldShowToast(key)) {
      toast({
        title,
        description,
      });
    }
  }
};

function shouldShowToast(key: string): boolean {
  const now = Date.now();
  
  // Check if we've shown this toast recently
  const lastShown = recentToasts.get(key);
  if (lastShown && (now - lastShown) < TOAST_DEBOUNCE_TIME) {
    return false;
  }
  
  // Update the last shown time
  recentToasts.set(key, now);
  
  // Clean up old entries
  cleanupOldToasts(now);
  
  return true;
}

function cleanupOldToasts(now: number) {
  // Remove entries older than 1 minute to prevent memory leaks
  const CLEANUP_TIME = 60000; // 1 minute
  
  for (const [key, timestamp] of recentToasts.entries()) {
    if ((now - timestamp) > CLEANUP_TIME) {
      recentToasts.delete(key);
    }
  }
}

export { debouncedToast };
