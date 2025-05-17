
import { useToast } from '@/hooks/use-toast';

// Simplified stub implementation with no release management functionality
export function useReleaseManagement() {
  const { toast } = useToast();
  
  // Create stub functions with no actual functionality
  const showFeatureUnavailableToast = () => {
    toast({
      title: "Feature Unavailable",
      description: "The Release Management module has been removed from the system.",
    });
  };
  
  return {
    releases: [],
    releaseProgress: [],
    createRelease: showFeatureUnavailableToast,
    updateRelease: showFeatureUnavailableToast,
    deleteRelease: showFeatureUnavailableToast,
    selectRelease: showFeatureUnavailableToast,
    createReleaseFromFeatures: showFeatureUnavailableToast
  };
}
