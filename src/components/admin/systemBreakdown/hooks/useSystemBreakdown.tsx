
import { useState, useCallback, useEffect } from 'react';
import { useFeatureStatus } from './useFeatureStatus';
import { useAnalysisProcess } from './useAnalysisProcess';
import { useProgressTracking } from './useProgressTracking';
import { AnalysisStep, FeatureItem, ProgressSnapshot, MonthlyProgressData } from '../types';
import { generateCSV, exportFeaturesAsCSV } from '../utils/exportUtils';
import { useReleaseManagement } from './useReleaseManagement';

export const useSystemBreakdown = () => {
  // Tab navigation state - Remove 'releases' from default tabs
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Get features from feature status hook
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
  
  // Get progress tracking data
  const {
    currentSnapshot,
    monthlyProgressData,
    dataValidation,
    createSnapshot,
    generateHistoricalData
  } = useProgressTracking(
    adminFeatures,
    establishmentFeatures,
    individualFeatures,
    promoterFeatures
  );
  
  // Analysis process state
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
  
  // Using our stub implementation
  const { createReleaseFromFeatures } = useReleaseManagement();
  
  // Export all data as CSV
  const handleExportCSV = useCallback(() => {
    exportFeaturesAsCSV(adminFeatures, establishmentFeatures, individualFeatures, promoterFeatures);
  }, [adminFeatures, establishmentFeatures, individualFeatures, promoterFeatures]);
  
  // Mock logout function
  const handleLogout = () => {
    console.log("Logout");
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
    handleAnalyzeFeatures,
    handleCreateReleaseFromFeatures: createReleaseFromFeatures,
    monthlyProgressData,
    currentSnapshot,
    dataValidation
  };
};
