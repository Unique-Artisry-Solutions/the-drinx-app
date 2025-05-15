
import { useState, useCallback } from 'react';
import { FeatureItem, AnalysisStep } from '../types';
import { analyzeAllFeatures } from '../utils/analysis';
import { toast } from '@/hooks/use-toast';

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
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([
    { id: 'init-analysis', name: 'Initializing Analysis', description: 'Preparing to analyze features', isComplete: false, progress: 0 },
    { id: 'check-db-schema', name: 'Checking Database Schema', description: 'Analyzing database requirements', isComplete: false, progress: 0 },
    { id: 'update-db-status', name: 'Updating Database Status', description: 'Determining database implementation status', isComplete: false, progress: 0 },
    { id: 'check-components', name: 'Checking Components', description: 'Analyzing component implementation', isComplete: false, progress: 0 },
    { id: 'check-dependencies', name: 'Checking Dependencies', description: 'Verifying feature dependencies', isComplete: false, progress: 0 },
    { id: 'analyze-admin', name: 'Analyzing Admin Features', description: 'Checking implementation status of admin features', isComplete: false, progress: 0 },
    { id: 'analyze-establishment', name: 'Analyzing Establishment Features', description: 'Checking implementation status of establishment features', isComplete: false, progress: 0 },
    { id: 'analyze-individual', name: 'Analyzing Individual Features', description: 'Checking implementation status of individual user features', isComplete: false, progress: 0 },
    { id: 'analyze-promoter', name: 'Analyzing Promoter Features', description: 'Checking implementation status of promoter features', isComplete: false, progress: 0 },
    { id: 'update-implementation', name: 'Updating Implementation Progress', description: 'Calculating implementation progress', isComplete: false, progress: 0 },
    { id: 'check-status-changes', name: 'Checking Status Changes', description: 'Identifying features with status changes', isComplete: false, progress: 0 },
    { id: 'finalize', name: 'Finalizing Analysis', description: 'Completing analysis process', isComplete: false, progress: 0 }
  ]);

  const handleAnalyzeFeatures = useCallback((onComplete?: () => void) => {
    setAnalyzing(true);
    setAnalysisProgress(0);

    // Mark the first step as complete
    setAnalysisSteps(prev => prev.map(step => 
      step.id === 'init-analysis' ? { ...step, isComplete: true, progress: 100 } : step
    ));
    
    // Use setTimeout to simulate analysis processing time
    // and to allow the UI to update
    const analyzeWithProgress = async () => {
      try {
        // Simulate progress through each step
        for (let i = 1; i < analysisSteps.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 200));
          
          setAnalysisSteps(prev => prev.map((step, index) => 
            index === i ? { ...step, isComplete: true, progress: 100 } : step
          ));

          // Update overall progress
          setAnalysisProgress(Math.floor((i + 1) / analysisSteps.length * 100));
        }

        // Now perform the actual analysis
        const analysisResult = analyzeAllFeatures(
          adminFeatures,
          establishmentFeatures,
          individualFeatures,
          promoterFeatures
        );

        // Update the features with the analysis results
        setAdminFeatures(analysisResult.adminFeatures);
        setEstablishmentFeatures(analysisResult.establishmentFeatures);
        setIndividualFeatures(analysisResult.individualFeatures);
        setPromoterFeatures(analysisResult.promoterFeatures);

        // Add any additional steps from the analysis
        if (analysisResult.completedSteps.length > 0) {
          setAnalysisSteps(prev => [...prev, ...analysisResult.completedSteps]);
        }

        if (onComplete) {
          onComplete();
        }

        toast({
          title: "Analysis Complete",
          description: "Feature analysis has been completed successfully.",
        });
      } catch (error) {
        console.error("Error during analysis:", error);
        toast({
          title: "Analysis Error",
          description: "There was an error analyzing the features.",
          variant: "destructive"
        });
      } finally {
        setAnalyzing(false);
      }
    };

    analyzeWithProgress();
  }, [
    adminFeatures, 
    establishmentFeatures, 
    individualFeatures, 
    promoterFeatures, 
    analysisSteps.length,
    setAdminFeatures,
    setEstablishmentFeatures,
    setIndividualFeatures,
    setPromoterFeatures,
    toast
  ]);

  return {
    analyzing,
    analysisProgress,
    analysisSteps,
    handleAnalyzeFeatures
  };
};
