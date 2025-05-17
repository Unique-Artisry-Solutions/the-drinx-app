
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
  
  // Simple stub function that only shows a toast
  const handleCreateReleaseFromFeatures = async () => {
    toast({
      title: "Feature Unavailable",
      description: "The Release Management module has been removed from the system.",
      duration: 5000,
    });
  };
  
  return {
    isCreatingRelease,
    handleCreateReleaseFromFeatures
  };
};
