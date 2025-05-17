
// Import from the correct location
import { useToast as useToastOriginal } from "@/hooks/use-toast";

// Re-export the hook to make it available 
export function useToast() {
  return useToastOriginal();
}
