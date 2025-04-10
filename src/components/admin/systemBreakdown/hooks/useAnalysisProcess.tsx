
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AnalysisStep, FeatureItem } from '../types';
import { analyzeAllFeatures } from '../utils';

/**
 * Hook to manage feature analysis process
 */
export const useAnalysisProcess = (
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  setAdminFeatures: (features: FeatureItem[]) => void,
  setEstablishmentFeatures: (features: FeatureItem[]) => void,
  setIndividualFeatures: (features: FeatureItem[]) => void
) => {
  const { toast } = useToast();
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([]);

  const handleAnalyzeFeatures = (onAnalysisComplete?: (totalUpdated: number) => void) => {
    setAnalyzing(true);
    setAnalysisProgress(0);
    
    // Create initial database tasks array with default states
    const initialDatabaseTasks: AnalysisStep[] = [
      { name: 'Database schema verification', completed: false },
      { name: 'API endpoints validation', completed: false },
      { name: 'Authentication flow check', completed: false },
      { name: 'User permissions validation', completed: false },
      { name: 'Content moderation implementation', completed: false },
      { name: 'Storage bucket configuration', completed: false },
      { name: 'Database trigger functions verification', completed: false },
      { name: 'Frontend component implementation check', completed: false }
    ];
    setAnalysisSteps(initialDatabaseTasks);
    
    // Simulate progress updates for each task
    let currentStep = 0;
    const totalSteps = initialDatabaseTasks.length;
    
    const progressInterval = setInterval(() => {
      if (currentStep < totalSteps) {
        const updatedSteps = [...initialDatabaseTasks];
        
        // Mark the current task as completed
        updatedSteps[currentStep].completed = true;
        setAnalysisSteps(updatedSteps);
        
        currentStep++;
        setAnalysisProgress((currentStep / totalSteps) * 100);
        
        // If we've completed all steps, complete the analysis
        if (currentStep >= totalSteps) {
          clearInterval(progressInterval);
          
          // Slight delay before completing the analysis to show 100% progress
          setTimeout(completeAnalysis, 500);
        }
      }
    }, 600); // Update every 600ms
    
    const completeAnalysis = () => {
      const analyzedFeatures = analyzeAllFeatures(
        adminFeatures,
        establishmentFeatures,
        individualFeatures
      );
      
      setAdminFeatures(analyzedFeatures.adminFeatures);
      setEstablishmentFeatures(analyzedFeatures.establishmentFeatures);
      setIndividualFeatures(analyzedFeatures.individualFeatures);
      setAnalysisSteps(analyzedFeatures.completedSteps);
      
      const totalUpdated = [
        ...analyzedFeatures.adminFeatures,
        ...analyzedFeatures.establishmentFeatures,
        ...analyzedFeatures.individualFeatures
      ].filter(feature => feature.statusUpdated).length;
      
      if (onAnalysisComplete) {
        onAnalysisComplete(totalUpdated);
      }
      
      setAnalyzing(false);
    };
  };

  return {
    analyzing,
    analysisProgress,
    analysisSteps,
    handleAnalyzeFeatures
  };
};
