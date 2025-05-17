
import { useState, useCallback, useEffect } from 'react';
import { useFeatureStatus } from './useFeatureStatus';
import { useAnalysisProcess } from './useAnalysisProcess';
import { useProgressTracking } from './useProgressTracking';
import { analyzeAllFeatures } from '../utils/analysis/featureAnalyzer';
import { AnalysisStep, FeatureItem, ProgressSnapshot, MonthlyProgressData } from '../types';
import { generateCSV } from '../utils/exportUtils';
import { useReleaseManagement } from './useReleaseManagement';

export const useSystemBreakdown = () => {
  // Tab navigation state
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
  
  // Analysis process state - matching the actual return values from useAnalysisProcess
  const {
    analyzing,
    analysisProgress,
    analysisSteps,
    handleAnalyzeFeatures,
    updateAnalysisStep
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
  
  // Release management - adjust to use the correct properties
  const { createReleaseFromFeatures } = useReleaseManagement();
  
  // Export all data as CSV
  const handleExportCSV = useCallback(() => {
    const allFeatures = [
      ...adminFeatures,
      ...establishmentFeatures,
      ...individualFeatures,
      ...promoterFeatures
    ];
    
    generateCSV(adminFeatures, establishmentFeatures, individualFeatures);
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
    // Ensure we're not returning functions that don't exist
    handleCreateReleaseFromFeatures: createReleaseFromFeatures,
    monthlyProgressData,
    currentSnapshot,
    dataValidation
  };
};
