
import { useState, useCallback, useEffect } from 'react';
import { useFeatureStatus } from './useFeatureStatus';
import { useAnalysisProcess } from './useAnalysisProcess';
import { useProgressTracking } from './useProgressTracking';
import { analyzeAllFeatures } from '../utils/analysis/featureAnalyzer';
import { AnalysisStep, FeatureItem, ProgressSnapshot, MonthlyProgressData } from '../types';
import { exportFeaturesAsCSV } from '../utils/exportUtils';
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
  
  // Analysis process state
  const {
    analyzing,
    analysisProgress,
    analysisSteps,
    startAnalysis,
    completeAnalysisStep,
    updateAnalysisProgress,
    setAnalysisSteps
  } = useAnalysisProcess();
  
  // Release management
  const { createReleaseFromFeatures } = useReleaseManagement();
  
  // Handle feature analysis
  const handleAnalyzeFeatures = useCallback(async () => {
    if (analyzing) return;
    
    startAnalysis();
    
    // This would typically be an asynchronous process
    // For now, we'll simulate it with a setTimeout
    setTimeout(() => {
      try {
        const result = analyzeAllFeatures(
          adminFeatures, 
          establishmentFeatures, 
          individualFeatures, 
          promoterFeatures
        );
        
        // Update features with analyzed versions
        setAdminFeatures(result.adminFeatures);
        setEstablishmentFeatures(result.establishmentFeatures);
        setIndividualFeatures(result.individualFeatures);
        setPromoterFeatures(result.promoterFeatures);
        
        // Set completed analysis steps
        setAnalysisSteps(result.completedSteps);
        
        // Create a new progress snapshot
        createSnapshot();
        
        // Generate historical data
        generateHistoricalData();
      } catch (error) {
        console.error('Error analyzing features:', error);
        // Add error step
        completeAnalysisStep({
          name: "Analysis Error",
          description: `Error: ${error}`,
          status: "error",
          progressPercentage: 0,
          details: "An error occurred during analysis"
        });
      }
    }, 1000);
  }, [
    analyzing, startAnalysis, adminFeatures, establishmentFeatures,
    individualFeatures, promoterFeatures, setAdminFeatures,
    setEstablishmentFeatures, setIndividualFeatures, setPromoterFeatures,
    completeAnalysisStep, setAnalysisSteps, createSnapshot, generateHistoricalData
  ]);
  
  // Export all data as CSV
  const handleExportCSV = useCallback(() => {
    const allFeatures = [
      ...adminFeatures,
      ...establishmentFeatures,
      ...individualFeatures,
      ...promoterFeatures
    ];
    
    exportFeaturesAsCSV(allFeatures);
  }, [adminFeatures, establishmentFeatures, individualFeatures, promoterFeatures]);
  
  // Handle create release from features
  const handleCreateReleaseFromFeatures = useCallback(() => {
    const allFeatures = [
      ...adminFeatures,
      ...establishmentFeatures,
      ...individualFeatures,
      ...promoterFeatures
    ];
    
    createReleaseFromFeatures(allFeatures);
  }, [adminFeatures, establishmentFeatures, individualFeatures, promoterFeatures, createReleaseFromFeatures]);
  
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
    handleCreateReleaseFromFeatures,
    monthlyProgressData,
    currentSnapshot,
    dataValidation
  };
};
