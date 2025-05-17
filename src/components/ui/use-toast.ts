
import { useToast as useToastOriginal } from "@/components/ui/toast";

export { useToast };

// Re-export the hook to make it available 
function useToast() {
  return useToastOriginal();
}
