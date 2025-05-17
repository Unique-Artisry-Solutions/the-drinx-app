
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AnalysisStep, FeatureItem } from '../types';
import { analyzeAllFeatures } from '../utils';

export const useAnalysisProcess = (
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[],
  setAdminFeatures: React.Dispatch<React.SetStateAction<FeatureItem[]>>,
  setEstablishmentFeatures: React.Dispatch<React.SetStateAction<FeatureItem[]>>,
  setIndividualFeatures: React.Dispatch<React.SetStateAction<FeatureItem[]>>,
  setPromoterFeatures: React.Dispatch<React.SetStateAction<FeatureItem[]>>
) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const { toast } = useToast();
  
  const initialAnalysisSteps: AnalysisStep[] = [
    {
      name: 'Preparing system analysis',
      description: 'Setting up analysis environment',
      status: 'pending',
      progressPercentage: 0
    },
    {
      name: 'Analyzing admin features',
      description: 'Checking implementation status and database requirements',
      status: 'pending',
      progressPercentage: 0,
      completed: false
    },
    {
      name: 'Analyzing establishment features',
      description: 'Checking implementation status',
      status: 'pending',
      progressPercentage: 0,
      completed: false
    },
    {
      name: 'Analyzing individual user features',
      description: 'Checking implementation status',
      status: 'pending',
      progressPercentage: 0,
      completed: false
    },
    {
      name: 'Analyzing promoter features',
      description: 'Checking implementation status and campaign tools',
      status: 'pending',
      progressPercentage: 0,
      completed: false
    },
    {
      name: 'Analyzing database requirements',
      description: 'Verifying database schema compatibility',
      status: 'pending',
      progressPercentage: 0,
      completed: false
    },
    {
      name: 'Analyzing Swig Circuit integration',
      description: 'Checking venue management and check-in features',
      status: 'pending',
      progressPercentage: 0,
      completed: false
    },
    {
      name: 'Analyzing reward program integration',
      description: 'Checking points system and redemption functionality',
      status: 'pending',
      progressPercentage: 0,
      completed: false
    },
    {
      name: 'Analyzing feature dependencies',
      description: 'Creating relationship matrix between features',
      status: 'pending',
      progressPercentage: 0,
      completed: false
    },
    {
      name: 'Checking for code consistency',
      description: 'Verifying naming conventions and patterns',
      status: 'pending',
      progressPercentage: 0,
      completed: false
    },
    {
      name: 'Analyzing overall implementation status',
      description: 'Calculating implementation percentages and statistics',
      status: 'pending',
      progressPercentage: 0,
      completed: false
    },
    {
      name: 'Generating progress insights',
      description: 'Creating visualizations and recommendations',
      status: 'pending',
      progressPercentage: 0,
      completed: false
    },
    {
      name: 'Finalizing system breakdown',
      description: 'Preparing final report on system state',
      status: 'pending',
      progressPercentage: 0,
      completed: false
    }
  ];
  
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>(initialAnalysisSteps);
  
  const updateStepStatus = useCallback((stepIndex: number, status: AnalysisStep['status'], progress: number) => {
    setAnalysisSteps(prevSteps => {
      const updatedSteps = [...prevSteps];
      updatedSteps[stepIndex] = {
        ...updatedSteps[stepIndex],
        status,
        progressPercentage: progress,
        completed: status === 'completed'
      };
      return updatedSteps;
    });
  }, []);
  
  const handleAnalyzeFeatures = useCallback((onComplete?: () => void) => {
    setAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisSteps(initialAnalysisSteps);
    
    // Use setTimeout to allow the UI to update
    setTimeout(() => {
      // Simulate progress for preparing system analysis
      updateStepStatus(0, 'in_progress', 50);
      
      // Start with a small delay to show the progress animation
      setTimeout(() => {
        try {
          // Mark first step as completed
          updateStepStatus(0, 'completed', 100);
          setAnalysisProgress(5);
        
          // Run the actual analysis
          const result = analyzeAllFeatures(
            adminFeatures,
            establishmentFeatures,
            individualFeatures,
            promoterFeatures
          );
          
          // Update all features with analysis results
          setAdminFeatures(result.adminFeatures);
          setEstablishmentFeatures(result.establishmentFeatures);
          setIndividualFeatures(result.individualFeatures);
          setPromoterFeatures(result.promoterFeatures);
          
          // Update analysis steps with the completed steps from the result
          const updatedSteps = [...analysisSteps];
          result.completedSteps.forEach(step => {
            const stepIndex = updatedSteps.findIndex(s => s.name.toLowerCase().includes(step.name.toLowerCase()));
            if (stepIndex !== -1) {
              updatedSteps[stepIndex] = {
                ...updatedSteps[stepIndex],
                status: 'completed',
                progressPercentage: 100,
                completed: true,
                message: step.details
              };
            }
          });
          
          // Mark all steps as completed
          const finalSteps = updatedSteps.map(step => ({
            ...step,
            status: step.status === 'pending' ? 'completed' : step.status,
            progressPercentage: step.progressPercentage < 100 ? 100 : step.progressPercentage,
            completed: true
          }));
          
          setAnalysisSteps(finalSteps);
          setAnalysisProgress(100);
          
          toast({
            title: "Analysis completed",
            description: `Analyzed ${adminFeatures.length + establishmentFeatures.length + individualFeatures.length + promoterFeatures.length} features`
          });
          
          // Use a timeout to show the completed state before setting analyzing to false
          setTimeout(() => {
            setAnalyzing(false);
            if (onComplete) onComplete();
          }, 500);
        } catch (error) {
          console.error('Error during analysis:', error);
          toast({
            title: "Analysis failed",
            description: "There was a problem analyzing the features.",
            variant: "destructive"
          });
          setAnalyzing(false);
        }
      }, 500);
    }, 100);
  }, [
    adminFeatures,
    establishmentFeatures,
    individualFeatures,
    promoterFeatures,
    setAdminFeatures,
    setEstablishmentFeatures,
    setIndividualFeatures,
    setPromoterFeatures,
    analysisSteps,
    updateStepStatus,
    toast,
    initialAnalysisSteps
  ]);
  
  return {
    analyzing,
    analysisProgress,
    analysisSteps,
    handleAnalyzeFeatures
  };
};
