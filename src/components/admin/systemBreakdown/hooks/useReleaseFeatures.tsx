
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FeatureItem } from '../types';

export const useReleaseFeatures = (
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[],
  setActiveTab: (tab: string) => void
) => {
  const [isCreatingRelease, setIsCreatingRelease] = useState(false);
  const { toast } = useToast();
  
  const handleCreateReleaseFromFeatures = async () => {
    try {
      setIsCreatingRelease(true);
      
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to the releases tab
      setActiveTab('releases');
      
      toast({
        title: "Release Created",
        description: "New release has been created from current feature set.",
      });
    } catch (error) {
      console.error('Failed to create release:', error);
      toast({
        title: "Failed to create release",
        description: "An error occurred while creating the release.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingRelease(false);
    }
  };
  
  return {
    isCreatingRelease,
    handleCreateReleaseFromFeatures
  };
};
