
// Import from the correct location
import { useToast as useToastOriginal } from "@/hooks/use-toast";

export { useToast };

// Re-export the hook to make it available 
function useToast() {
  return useToastOriginal();
}
