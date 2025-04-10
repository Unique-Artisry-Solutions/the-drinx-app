
import { useReleaseManagement } from './useReleaseManagement';
import { FeatureItem } from '../types';
import { useToast } from '@/hooks/use-toast';
import { mapFeaturesToReleaseFeatures, getDateMonthsFromNow } from '../utils';

/**
 * Hook for managing release creation from features
 */
export const useReleaseFeatures = (
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  setActiveTab: (tab: string) => void
) => {
  const { toast } = useToast();
  const releaseManagement = useReleaseManagement();

  // Function to create a release from features
  const handleCreateReleaseFromFeatures = () => {
    // Get all features except for "planned" status as these might be for future releases
    const allFeatures = [
      ...adminFeatures,
      ...establishmentFeatures,
      ...individualFeatures
    ].filter(feature => ['implemented', 'partial', 'not_started'].includes(feature.status));
    
    // If there are no features to include, show a message
    if (allFeatures.length === 0) {
      toast({
        title: "No Features Available",
        description: "There are no features with implemented, partial, or not started status to include in a release.",
        variant: "destructive"
      });
      return;
    }
    
    // Convert features to release features
    const releaseFeatures = mapFeaturesToReleaseFeatures(allFeatures);
    
    // Create a release planned for one month from now
    const plannedDate = getDateMonthsFromNow(1);
    
    // Count features by status for the release name
    const completedCount = releaseFeatures.filter(f => f.status === 'completed').length;
    const inProgressCount = releaseFeatures.filter(f => f.status === 'in_progress').length;
    const pendingCount = releaseFeatures.filter(f => f.status === 'pending').length;
    
    // Create the release
    const releaseName = `Feature Consolidation Release`;
    const releaseDescription = 
      `This release includes ${allFeatures.length} features:\n` +
      `- ${completedCount} completed features\n` +
      `- ${inProgressCount} in-progress features\n` +
      `- ${pendingCount} pending features\n\n` +
      `Generated from system features on ${new Date().toLocaleDateString()}`;
    
    // Use the release management to create the release
    const newReleaseId = releaseManagement.createRelease({
      version: releaseManagement.getNextVersionNumber('minor'),
      name: releaseName,
      type: 'minor',
      status: 'planned',
      plannedReleaseDate: plannedDate,
      description: releaseDescription,
      features: releaseFeatures,
      releaseNotes: [],
      team: [],
      tags: ['auto-generated', 'feature-consolidation']
    });
    
    // Switch to the release tab and select the new release
    setActiveTab('releases');
    
    // Need a small delay to ensure the tab has switched before selecting the release
    setTimeout(() => {
      releaseManagement.setSelectedReleaseId(newReleaseId);
    }, 100);
    
    toast({
      title: "Release Created",
      description: `Successfully created a new release with ${allFeatures.length} features scheduled for ${new Date(plannedDate).toLocaleDateString()}.`
    });
  };

  return { handleCreateReleaseFromFeatures };
};
