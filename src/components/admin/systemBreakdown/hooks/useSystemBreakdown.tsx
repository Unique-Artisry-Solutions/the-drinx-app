import { useState } from 'react';
import { useAuthCheck } from './useAuthCheck';
import { useFeatureStatus } from './useFeatureStatus';
import { useProgressTracking } from './useProgressTracking';
import { useAnalysisProcess } from './useAnalysisProcess';
import { useReleaseFeatures } from './useReleaseFeatures';
import { useExportFunctions } from './useExportFunctions';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';

export const useSystemBreakdown = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
    (tab: string) => navigate(`/admin/system-breakdown?tab=${tab}`, { replace: true })
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

  const setActiveTab = (tab: string) => {
    // Use navigate with replace: true to avoid browser history stacking
    navigate(`/admin/system-breakdown?tab=${tab}`, { replace: true });
  };

  return {
    activeTab,
    setActiveTab,
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
