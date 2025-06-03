
import { useState, useEffect } from 'react';
import { ProgressSnapshot, MonthlyProgressData, FeatureItem } from '../types';
import { createProgressSnapshot, validateProgressData, generateHistoricalProgressData } from '../utils/statisticsUtils';

export const useProgressTracking = (
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[]
) => {
  const [progressHistory, setProgressHistory] = useState<ProgressSnapshot[]>([]);
  const [monthlyProgressData, setMonthlyProgressData] = useState<MonthlyProgressData[]>([]);
  const [currentSnapshot, setCurrentSnapshot] = useState<ProgressSnapshot | null>(null);
  const [dataValidation, setDataValidation] = useState<{ isValid: boolean, issues: string[] }>({ isValid: true, issues: [] });
  
  // Initialize project status on mount and when features change
  useEffect(() => {
    const initialSnapshot = createProgressSnapshot(
      adminFeatures,
      establishmentFeatures,
      individualFeatures,
      promoterFeatures
    );
    
    setCurrentSnapshot(initialSnapshot);
    
    const validationResult = validateProgressData([initialSnapshot]);
    setDataValidation(validationResult);
    
    // Generate monthly progress data
    const monthlyData = generateHistoricalProgressData();
    setMonthlyProgressData(monthlyData);
  }, [adminFeatures, establishmentFeatures, individualFeatures, promoterFeatures]);
  
  const updateProgressTracking = () => {
    const newSnapshot = createProgressSnapshot(
      adminFeatures,
      establishmentFeatures,
      individualFeatures,
      promoterFeatures
    );
    
    const newHistory = [...progressHistory, newSnapshot];
    const validationResult = validateProgressData(newHistory);
    setDataValidation(validationResult);
    
    setCurrentSnapshot(newSnapshot);
    setProgressHistory(newHistory);
    
    return {
      snapshot: newSnapshot,
      validation: validationResult
    };
  };

  return {
    progressHistory,
    monthlyProgressData,
    currentSnapshot,
    dataValidation,
    updateProgressTracking
  };
};
