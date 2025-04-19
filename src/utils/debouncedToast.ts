
import { toast } from "@/hooks/use-toast";
import debounce from "lodash/debounce";

// Map to track when specific types of toasts were last shown
const toastTimestamps = new Map<string, number>();
const TOAST_COOLDOWN = 5000; // 5 seconds cooldown between similar toasts

export const showDebouncedToast = (key: string, config: Parameters<typeof toast>[0]) => {
  const now = Date.now();
  const lastShown = toastTimestamps.get(key);
  
  if (!lastShown || (now - lastShown) > TOAST_COOLDOWN) {
    toastTimestamps.set(key, now);
    toast(config);
  }
};

export const debouncedToast = {
  error: debounce((title: string, description: string) => {
    showDebouncedToast(`error-${title}`, {
      title,
      description,
      variant: "destructive"
    });
  }, 1000, { leading: true, trailing: false }),
  
  success: debounce((title: string, description: string) => {
    showDebouncedToast(`success-${title}`, {
      title,
      description
    });
  }, 1000, { leading: true, trailing: false })
};
