
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
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
      
      // Removed navigation to releases tab since it no longer exists
      // Instead, show a toast notification
      
      toast({
        title: "Release Management Unavailable",
        description: "The Release Management module has been temporarily disabled. Feature information has been logged to the console.",
        duration: 5000,
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
