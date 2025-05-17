
import { useState, useEffect } from 'react';
import { ProgressSnapshot, MonthlyProgressData, FeatureItem } from '../types';
import { createProgressSnapshot, validateProgressData } from '../utils';
import { generateHistoricalProgressData } from '../utils/historicalData';

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
    
    const validationResult = validateProgressData(initialSnapshot);
    setDataValidation(validationResult);
    
    generateHistoricalProgressDataAndUpdate(initialSnapshot);
  }, [adminFeatures, establishmentFeatures, individualFeatures, promoterFeatures]);
  
  const updateProgressTracking = () => {
    const newSnapshot = createProgressSnapshot(
      adminFeatures,
      establishmentFeatures,
      individualFeatures,
      promoterFeatures
    );
    
    const validationResult = validateProgressData(newSnapshot);
    setDataValidation(validationResult);
    
    setCurrentSnapshot(newSnapshot);
    
    setProgressHistory(prevHistory => [...prevHistory, newSnapshot]);
    
    generateHistoricalProgressDataAndUpdate(newSnapshot, [...progressHistory, newSnapshot]);
    
    return {
      snapshot: newSnapshot,
      validation: validationResult
    };
  };

  const generateHistoricalProgressDataAndUpdate = (
    snapshot: ProgressSnapshot,
    history: ProgressSnapshot[] = []
  ) => {
    generateHistoricalProgressData(snapshot, history)
      .then((data: MonthlyProgressData[]) => {
        setMonthlyProgressData(data);
      })
      .catch(error => {
        console.error("Error generating historical progress data:", error);
        // Use basic fallback data if generation fails
        const currentMonth = new Date().getMonth();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const fallbackData: MonthlyProgressData[] = Array.from({ length: currentMonth + 1 }, (_, i) => {
          const progressRatio = (i + 1) / (currentMonth + 1);
          const implementedRatio = progressRatio * 0.8; // 80% of progress
          
          return {
            month: monthNames[i],
            totalImplemented: Math.round(snapshot.implementedFeatures * implementedRatio),
            adminImplemented: Math.round((snapshot.adminFeatureCount || 0) * implementedRatio * 0.7),
            establishmentImplemented: Math.round((snapshot.establishmentFeatureCount || 0) * implementedRatio * 0.6),
            individualImplemented: Math.round((snapshot.individualFeatureCount || 0) * implementedRatio * 0.8),
            promoterImplemented: Math.round((snapshot.promoterFeatureCount || 0) * implementedRatio * 0.5),
            frontend: Math.round((snapshot.frontendProgress || 0) * progressRatio),
            backend: Math.round((snapshot.backendProgress || 0) * progressRatio * 0.85)
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
