
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
    
    // Create initial database tasks array with reward system and promoter tasks
    const initialDatabaseTasks: AnalysisStep[] = [
      { 
        name: 'Database schema verification', 
        description: 'Verifying database schemas',
        status: 'pending',
        progressPercentage: 0,
        details: 'Starting database schema verification'
      },
      { 
        name: 'API endpoints validation', 
        description: 'Validating API endpoint implementation',
        status: 'pending',
        progressPercentage: 0,
        details: 'Starting API endpoints validation'
      },
      { 
        name: 'Authentication flow check', 
        description: 'Checking authentication flows',
        status: 'pending',
        progressPercentage: 0,
        details: 'Starting authentication flow check'
      },
      { 
        name: 'User permissions validation', 
        description: 'Validating user permissions',
        status: 'pending',
        progressPercentage: 0,
        details: 'Starting user permissions validation'
      },
      { 
        name: 'Content moderation implementation', 
        description: 'Checking content moderation implementation',
        status: 'pending',
        progressPercentage: 0,
        details: 'Starting content moderation implementation check'
      },
      { 
        name: 'Storage bucket configuration', 
        description: 'Verifying storage configurations',
        status: 'pending',
        progressPercentage: 0,
        details: 'Starting storage bucket configuration check'
      },
      { 
        name: 'Database trigger functions verification', 
        description: 'Checking database triggers',
        status: 'pending',
        progressPercentage: 0,
        details: 'Starting database trigger functions verification'
      },
      { 
        name: 'Frontend component implementation check', 
        description: 'Verifying UI components',
        status: 'pending',
        progressPercentage: 0,
        details: 'Starting frontend component implementation check'
      },
      { 
        name: 'Reward system implementation analysis', 
        description: 'Analyzing reward system',
        status: 'pending',
        progressPercentage: 0,
        details: 'Starting reward system implementation analysis'
      },
      { 
        name: 'Reward program data validation', 
        description: 'Validating reward program data',
        status: 'pending',
        progressPercentage: 0,
        details: 'Starting reward program data validation'
      },
      { 
        name: 'Promoter notification triggers verification', 
        description: 'Checking promoter notifications',
        status: 'pending',
        progressPercentage: 0,
        details: 'Starting promoter notification triggers verification'
      },
      { 
        name: 'Event management system validation', 
        description: 'Validating event system',
        status: 'pending',
        progressPercentage: 0,
        details: 'Starting event management system validation'
      },
      { 
        name: 'Notification delivery system check', 
        description: 'Checking notification delivery',
        status: 'pending',
        progressPercentage: 0,
        details: 'Starting notification delivery system check'
      }
    ];
    setAnalysisSteps(initialDatabaseTasks);
    
    // Simulate progress updates for each task
    let currentStep = 0;
    const totalSteps = initialDatabaseTasks.length;
    
    const progressInterval = setInterval(() => {
      if (currentStep < totalSteps) {
        const updatedSteps = [...initialDatabaseTasks].map((step, index) => {
          if (index < currentStep) {
            return { ...step, status: 'complete' as const, progressPercentage: 100 };
          } else if (index === currentStep) {
            return { ...step, status: 'running' as const, progressPercentage: 50 };
          }
          return step;
        });
        
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
        promoterFeatures
      );
      
      // Important: Update the state with the analyzed features
      setAdminFeatures([...analyzedFeatures.adminFeatures]);
      setEstablishmentFeatures([...analyzedFeatures.establishmentFeatures]);
      setIndividualFeatures([...analyzedFeatures.individualFeatures]);
      setPromoterFeatures([...analyzedFeatures.promoterFeatures]);
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
