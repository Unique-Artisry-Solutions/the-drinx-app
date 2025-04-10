
import { useState, useEffect } from 'react';
import { ProgressSnapshot, MonthlyProgressData, FeatureItem } from '../types';
import { createProgressSnapshot, validateProgressData, generateHistoricalProgressData } from '../utils';

/**
 * Hook to track system implementation progress
 */
export const useProgressTracking = (
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[]
) => {
  // Track progress history for accurate dashboard data
  const [progressHistory, setProgressHistory] = useState<ProgressSnapshot[]>([]);
  const [monthlyProgressData, setMonthlyProgressData] = useState<MonthlyProgressData[]>([]);
  const [currentSnapshot, setCurrentSnapshot] = useState<ProgressSnapshot | null>(null);
  const [dataValidation, setDataValidation] = useState<{ isValid: boolean, issues: string[] }>({ isValid: true, issues: [] });
  
  // Initialize project status on first load
  useEffect(() => {
    // Create initial snapshot without saving to history
    const initialSnapshot = createProgressSnapshot(
      adminFeatures,
      establishmentFeatures,
      individualFeatures,
      promoterFeatures
    );
    
    setCurrentSnapshot(initialSnapshot);
    
    // Generate initial monthly progress data based on current state
    generateHistoricalProgressDataAndUpdate(initialSnapshot);
  }, []);
  
  // Update progress tracking when features change
  const updateProgressTracking = () => {
    // Create a new progress snapshot after analysis
    const newSnapshot = createProgressSnapshot(
      adminFeatures,
      establishmentFeatures,
      individualFeatures,
      promoterFeatures
    );
    
    // Validate the progress data
    const validationResult = validateProgressData(newSnapshot);
    setDataValidation(validationResult);
    
    // Update current snapshot
    setCurrentSnapshot(newSnapshot);
    
    // Add new snapshot to history
    setProgressHistory(prevHistory => [...prevHistory, newSnapshot]);
    
    // Generate updated monthly progress data
    generateHistoricalProgressDataAndUpdate(newSnapshot, [...progressHistory, newSnapshot]);
    
    return {
      snapshot: newSnapshot,
      validation: validationResult
    };
  };

  // Helper function to generate historical data and update state
  const generateHistoricalProgressDataAndUpdate = (
    snapshot: ProgressSnapshot,
    history: ProgressSnapshot[] = []
  ) => {
    // Call the function, which returns a Promise
    generateHistoricalProgressData(snapshot, history)
      .then(data => {
        // Update the state with the resulting data
        setMonthlyProgressData(data);
      })
      .catch(error => {
        console.error("Error generating historical progress data:", error);
        // Fallback with a simple implementation if there's an error
        const currentMonth = new Date().getMonth();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const fallbackData = Array.from({ length: currentMonth + 1 }, (_, i) => {
          const progressRatio = (i + 1) / (currentMonth + 1);
          return {
            month: monthNames[i],
            frontend: Math.round(snapshot.frontendProgress * progressRatio),
            backend: Math.round(snapshot.backendProgress * progressRatio * 0.85)
          };
        });
        
        setMonthlyProgressData(fallbackData);
      });
  };

  return {
    progressHistory,
    monthlyProgressData,
    currentSnapshot,
    dataValidation,
    updateProgressTracking
  };
};
