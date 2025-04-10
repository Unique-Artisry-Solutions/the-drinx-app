
import { useToast } from '@/hooks/use-toast';
import { FeatureItem } from '../types';
import { mapFeaturesToReleaseFeatures } from '../utils';
import { getDateMonthsFromNow } from '../utils';

/**
 * Hook to handle feature-to-release conversion
 */
export const useReleaseFeatures = (
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[],
  setActiveTab: (tab: string) => void
) => {
  const { toast } = useToast();

  const handleCreateReleaseFromFeatures = () => {
    // Create a simulated release from ready features
    const releaseDate = getDateMonthsFromNow(1);
    
    // Get all ready features (implemented >= 80%)
    const readyFeatures = [
      ...adminFeatures,
      ...establishmentFeatures,
      ...individualFeatures,
      ...promoterFeatures
    ].filter(
      feature => (feature.implementationProgress || 0) >= 80 && 
      (feature.status === 'in_progress' || feature.status === 'implemented')
    );
    
    // Map features to release features format - fix the argument count
    const releaseFeatures = mapFeaturesToReleaseFeatures(readyFeatures, releaseDate);
    
    // In a real implementation, this would save to Supabase
    console.log('Creating release with features:', releaseFeatures);
    
    toast({
      title: "Release Created",
      description: `Created a new release with ${readyFeatures.length} features`,
    });
    
    // Navigate to releases tab
    setActiveTab('releases');
  };

  return {
    handleCreateReleaseFromFeatures
  };
};
