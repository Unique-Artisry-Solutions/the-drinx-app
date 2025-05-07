
// Import directly from shadcn's toast components
import { useToast as useShadcnToast } from "@/components/ui/use-toast";
import { toast as shadcnToast } from "@/components/ui/use-toast";

// Re-export them
export const useToast = useShadcnToast;
export const toast = shadcnToast;
