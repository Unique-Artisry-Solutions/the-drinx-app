
import { useState, useCallback, useEffect } from 'react';
import { FeatureItem, ProgressSnapshot, MonthlyProgressData } from '../types';
import { 
  createProgressSnapshot, 
  validateProgressData, 
  generateHistoricalProgressData 
} from '../utils';

export function useProgressTracking(
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[]
) {
  // State for tracking progress
  const [currentSnapshot, setCurrentSnapshot] = useState<ProgressSnapshot | null>(null);
  const [monthlyProgressData, setMonthlyProgressData] = useState<MonthlyProgressData[]>([]);
  const [dataValidation, setDataValidation] = useState<{ isValid: boolean; issues: string[] }>({ 
    isValid: true, 
    issues: [] 
  });
  
  // Create a new progress snapshot
  const createSnapshot = useCallback(() => {
    const newSnapshot = createProgressSnapshot(
      adminFeatures,
      establishmentFeatures,
      individualFeatures,
      promoterFeatures,
      true
    );
    
    setCurrentSnapshot(newSnapshot);
    
    // Also validate the data
    const validationResult = validateProgressData(
      adminFeatures,
      establishmentFeatures,
      individualFeatures,
      promoterFeatures,
      newSnapshot
    );
    
    setDataValidation(validationResult);
    
    return newSnapshot;
  }, [adminFeatures, establishmentFeatures, individualFeatures, promoterFeatures]);
  
  // Generate historical data for charts
  const generateHistoricalData = useCallback(() => {
    const data = generateHistoricalProgressData(6);
    setMonthlyProgressData(data);
    return data;
  }, []);
  
  // Initialize data on mount
  useEffect(() => {
    createSnapshot();
    generateHistoricalData();
  }, [createSnapshot, generateHistoricalData]);
  
  return {
    currentSnapshot,
    monthlyProgressData,
    dataValidation,
    createSnapshot,
    generateHistoricalData
  };
}
