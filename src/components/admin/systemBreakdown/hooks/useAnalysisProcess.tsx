
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
  promoterFeatures: FeatureItem[],
  setAdminFeatures: (features: FeatureItem[]) => void,
  setEstablishmentFeatures: (features: FeatureItem[]) => void,
  setIndividualFeatures: (features: FeatureItem[]) => void,
  setPromoterFeatures: (features: FeatureItem[]) => void
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
      { name: 'Frontend component implementation check', completed: false },
      { name: 'Promoter notification system', completed: false } // Added promoter notification system check
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
      // Apply the actual analysis to the features
      const analyzedFeatures = analyzeAllFeatures(
        adminFeatures,
        establishmentFeatures,
        individualFeatures,
        promoterFeatures // Pass promoter features to be analyzed
      );
      
      // Important: Update the state with the analyzed features
      setAdminFeatures([...analyzedFeatures.adminFeatures]);
      setEstablishmentFeatures([...analyzedFeatures.establishmentFeatures]);
      setIndividualFeatures([...analyzedFeatures.individualFeatures]);
      setPromoterFeatures([...analyzedFeatures.promoterFeatures]); // Update promoter features
      setAnalysisSteps(analyzedFeatures.completedSteps);
      
      const totalUpdated = [
        ...analyzedFeatures.adminFeatures,
        ...analyzedFeatures.establishmentFeatures,
        ...analyzedFeatures.individualFeatures,
        ...analyzedFeatures.promoterFeatures
      ].filter(feature => feature.statusUpdated).length;
      
      // Show a toast notification about the analysis results
      toast({
        title: "Analysis Complete",
        description: `${totalUpdated} feature status${totalUpdated !== 1 ? 'es' : ''} updated based on database implementation.`,
        duration: 5000,
      });
      
      // Set analyzing to false to remove the progress bar
      setAnalyzing(false);
      
      // Call the callback if provided
      if (onAnalysisComplete) {
        onAnalysisComplete(totalUpdated);
      }
    };
  };

  return {
    analyzing,
    analysisProgress,
    analysisSteps,
    handleAnalyzeFeatures
  };
};
