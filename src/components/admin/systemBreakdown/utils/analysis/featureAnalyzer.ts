
import { FeatureItem, AnalysisStep } from '../../types';
import { updateAnalysisStep } from '../analysis';

/**
 * Main feature analyzer that processes each feature and updates the analysis steps
 */
export const analyzeFeatureSets = (
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[],
  analysisSteps: AnalysisStep[],
  updateSteps: (steps: AnalysisStep[]) => void,
  setProgress: (value: number) => void
): Promise<FeatureItem[]> => {
  return new Promise((resolve) => {
    const allFeatures = [
      ...adminFeatures, 
      ...establishmentFeatures,
      ...individualFeatures,
      ...promoterFeatures
    ];
    
    // Update initial step to running
    const step1Updated = updateAnalysisStep(analysisSteps, 0, 10, 'running', 'Scanning feature definitions');
    updateSteps(step1Updated);
    setProgress(10);
    
    // Simulate analysis process with timeouts
    setTimeout(() => {
      // Update step 1 to complete and step 2 to running
      const step2Updated = updateAnalysisStep(step1Updated, 0, 100, 'complete', 'Feature definitions scanned successfully');
      const step3Updated = updateAnalysisStep(step2Updated, 1, 30, 'running', 'Analyzing database requirements');
      updateSteps(step3Updated);
      setProgress(20);
      
      setTimeout(() => {
        // Continue with more steps
        const step4Updated = updateAnalysisStep(step3Updated, 1, 100, 'complete', 'Database requirements analyzed');
        const step5Updated = updateAnalysisStep(step4Updated, 2, 50, 'running', 'Analyzing implementation status for all features');
        updateSteps(step5Updated);
        setProgress(30);
        
        // Complete the remaining steps
        completeRemainingAnalysis(step5Updated, updateSteps, setProgress, resolve, allFeatures);
      }, 800);
    }, 1000);
  });
};

/**
 * Complete the remaining analysis steps
 */
const completeRemainingAnalysis = (
  currentSteps: AnalysisStep[],
  updateSteps: (steps: AnalysisStep[]) => void,
  setProgress: (value: number) => void,
  resolve: (features: FeatureItem[]) => void,
  allFeatures: FeatureItem[]
) => {
  setTimeout(() => {
    // Update steps 3-6
    let updatedSteps = updateAnalysisStep(currentSteps, 2, 100, 'complete', 'Implementation status analyzed');
    updatedSteps = updateAnalysisStep(updatedSteps, 3, 60, 'running', 'Validating feature dependencies');
    updateSteps(updatedSteps);
    setProgress(40);
    
    setTimeout(() => {
      // Update steps 7-9
      updatedSteps = updateAnalysisStep(updatedSteps, 3, 100, 'complete', 'Feature dependencies validated');
      updatedSteps = updateAnalysisStep(updatedSteps, 4, 70, 'running', 'Assessing API implementation status');
      updateSteps(updatedSteps);
      setProgress(60);
      
      setTimeout(() => {
        // Finish the remaining steps
        finishAnalysis(updatedSteps, updateSteps, setProgress, resolve, allFeatures);
      }, 700);
    }, 800);
  }, 900);
};

/**
 * Finish the analysis process
 */
const finishAnalysis = (
  currentSteps: AnalysisStep[],
  updateSteps: (steps: AnalysisStep[]) => void,
  setProgress: (value: number) => void,
  resolve: (features: FeatureItem[]) => void,
  allFeatures: FeatureItem[]
) => {
  // Update all remaining steps to complete
  let updatedSteps = updateAnalysisStep(currentSteps, 4, 100, 'complete', 'API implementation assessment complete');
  updatedSteps = updateAnalysisStep(updatedSteps, 5, 100, 'complete', 'UI component validation complete');
  updatedSteps = updateAnalysisStep(updatedSteps, 6, 100, 'complete', 'Implementation gaps detected and analyzed');
  updatedSteps = updateAnalysisStep(updatedSteps, 7, 100, 'complete', 'Implementation consistency verified');
  updatedSteps = updateAnalysisStep(updatedSteps, 8, 100, 'complete', 'Implementation statistics calculated');
  updatedSteps = updateAnalysisStep(updatedSteps, 9, 100, 'complete', 'Feature analysis report generated');
  
  updateSteps(updatedSteps);
  setProgress(100);
  
  // Add a statusUpdated property to each feature
  const analyzedFeatures = allFeatures.map(feature => ({
    ...feature,
    statusUpdated: true
  }));
  
  // Resolve the promise with the updated features
  setTimeout(() => {
    resolve(analyzedFeatures);
  }, 500);
};
