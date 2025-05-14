
import { useState } from 'react';
import { useAuthCheck } from './useAuthCheck';
import { useFeatureStatus } from './useFeatureStatus';
import { useProgressTracking } from './useProgressTracking';
import { useAnalysisProcess } from './useAnalysisProcess';
import { useReleaseFeatures } from './useReleaseFeatures';
import { useExportFunctions } from './useExportFunctions';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';

export const useSystemBreakdown = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const { toast } = useToast();
  
  // Use our new modular hooks
  const { handleLogout } = useAuthCheck();
  
  const { 
    adminFeatures, 
    establishmentFeatures, 
    individualFeatures,
    promoterFeatures,
    setAdminFeatures,
    setEstablishmentFeatures,
    setIndividualFeatures,
    setPromoterFeatures,
    updatedFeaturesCount 
  } = useFeatureStatus();
  
  const {
    progressHistory,
    monthlyProgressData,
    currentSnapshot,
    dataValidation,
    updateProgressTracking
  } = useProgressTracking(adminFeatures, establishmentFeatures, individualFeatures, promoterFeatures);
  
  const {
    analyzing,
    analysisProgress,
    analysisSteps,
    handleAnalyzeFeatures
  } = useAnalysisProcess(
    adminFeatures, 
    establishmentFeatures, 
    individualFeatures,
    promoterFeatures,
    setAdminFeatures,
    setEstablishmentFeatures,
    setIndividualFeatures,
    setPromoterFeatures
  );
  
  const { handleCreateReleaseFromFeatures } = useReleaseFeatures(
    adminFeatures, 
    establishmentFeatures, 
    individualFeatures,
    promoterFeatures,
    (tab: string) => setSearchParams({ tab })
  );

  const { handleExportCSV } = useExportFunctions();
  
  // Wrap the analysis function to also update progress tracking
  const handleAnalyzeAndUpdateProgress = () => {
    handleAnalyzeFeatures((totalUpdated) => {
      // Update progress tracking with new feature states
      const result = updateProgressTracking();
      
      // Show validation warning if needed
      if (!result.validation.isValid) {
        toast({
          title: "Data Validation Warning",
          description: "Some data inconsistencies were detected in the progress tracking.",
          variant: "destructive"
        });
      }
    });
  };

  return {
    activeTab,
    setActiveTab: (tab: string) => setSearchParams({ tab }),
    adminFeatures,
    establishmentFeatures,
    individualFeatures,
    promoterFeatures,
    analyzing,
    analysisProgress,
    analysisSteps,
    updatedFeaturesCount,
    handleLogout,
    handleExportCSV,
    handleAnalyzeFeatures: handleAnalyzeAndUpdateProgress,
    handleCreateReleaseFromFeatures,
    // Expose additional state for Dashboard
    progressHistory,
    monthlyProgressData,
    currentSnapshot,
    dataValidation
  };
};
