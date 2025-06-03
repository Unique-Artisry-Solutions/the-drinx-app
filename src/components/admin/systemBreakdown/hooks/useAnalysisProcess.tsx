
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FeatureItem, AnalysisStep } from '../types';
import { analyzeAllFeatures } from '../utils/analysis';

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
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([]);
  const { toast } = useToast();

  const handleAnalyzeFeatures = (onComplete?: (updatedCount: number) => void) => {
    setAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisSteps([]);

    // Simulate analysis progress
    const steps: AnalysisStep[] = [
      { name: 'Analyzing database requirements', completed: false },
      { name: 'Checking implementation status', completed: false },
      { name: 'Updating feature progress', completed: false },
      { name: 'Calculating statistics', completed: false }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        steps[currentStep].completed = true;
        setAnalysisSteps([...steps]);
        setAnalysisProgress(((currentStep + 1) / steps.length) * 100);
        currentStep++;
      } else {
        clearInterval(interval);
        
        // Perform actual analysis
        const result = analyzeAllFeatures(
          adminFeatures,
          establishmentFeatures,
          individualFeatures,
          promoterFeatures
        );

        // Update features with analysis results
        setAdminFeatures(result.adminFeatures);
        setEstablishmentFeatures(result.establishmentFeatures);
        setIndividualFeatures(result.individualFeatures);
        setPromoterFeatures(result.promoterFeatures);

        // Calculate updated features count
        const updatedCount = result.adminFeatures.filter(f => f.statusUpdated).length +
                           result.establishmentFeatures.filter(f => f.statusUpdated).length +
                           result.individualFeatures.filter(f => f.statusUpdated).length +
                           result.promoterFeatures.filter(f => f.statusUpdated).length;

        setAnalyzing(false);
        
        toast({
          title: "Analysis Complete",
          description: `Updated ${updatedCount} features based on implementation analysis`,
        });

        if (onComplete) {
          onComplete(updatedCount);
        }
      }
    }, 800);
  };

  return {
    analyzing,
    analysisProgress,
    analysisSteps,
    handleAnalyzeFeatures
  };
};
