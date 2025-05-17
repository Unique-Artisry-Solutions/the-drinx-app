import { FeatureItem, AnalysisStep, DatabaseStatus } from '../types';
import { updateFeaturesDbStatus } from './analysis/databaseStatusUpdater';

/**
 * Analyze features and identify missing fields or inconsistencies
 * @deprecated Use analyzeAllFeatures from './analysis/featureAnalyzer' instead
 */
export const analyzeFeatures = (
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[]
): FeatureItem[] => {
  // Combine all features into a single array for analysis
  const allFeatures = [
    ...adminFeatures,
    ...establishmentFeatures,
    ...individualFeatures,
    ...promoterFeatures
  ];
  
  // Check for common issues across features
  const updatedFeatures = allFeatures.map(feature => {
    // Ensure complexity field exists
    if (!feature.complexity) {
      feature = {
        ...feature,
        complexity: determineComplexity(feature),
        statusUpdated: true
      };
    }
    
    // Ensure databaseStatus is set
    if (!feature.databaseStatus) {
      feature = updateFeaturesDbStatus(feature);
      feature.statusUpdated = true;
    }
    
    // Ensure implementationProgress exists and is consistent with status
    if (feature.implementationProgress === undefined) {
      feature = {
        ...feature,
        implementationProgress: calculateImplementationProgress(feature),
        statusUpdated: true
      };
    }
    
    return feature;
  });
  
  return updatedFeatures;
};

/**
 * Determine complexity based on feature properties
 */
const determineComplexity = (feature: FeatureItem): 'low' | 'medium' | 'high' => {
  if (!feature.description) {
    return 'low';
  }
  
  // Count mentions of technical terms
  const techTerms = ['database', 'schema', 'authentication', 'authorization', 'api', 'integration'];
  const techMentionsCount = techTerms.filter(term => 
    feature.description.toLowerCase().includes(term)).length;
  
  // If feature has dependencies, increase complexity
  if (feature.dependencies && feature.dependencies.length > 3) {
    return 'high';
  } else if (techMentionsCount > 2 || (feature.dependencies && feature.dependencies.length > 0)) {
    return 'medium';
  }
  
  return 'low';
};

/**
 * Calculate implementation progress based on status
 */
const calculateImplementationProgress = (feature: FeatureItem): number => {
  switch (feature.status) {
    case 'implemented':
      return 100;
    case 'partial':
      return 75;
    case 'in_progress':
      return 50;
    case 'planned':
      return 10;
    case 'blocked':
      return 25;
    default:
      return 0;
  }
};

/**
 * Generate analysis steps for a feature analysis process
 */
export const generateAnalysisSteps = (): AnalysisStep[] => {
  return [
    {
      name: "Scanning feature definitions",
      description: "Analyzing feature definitions and structures",
      status: "pending",
      progressPercentage: 0,
      details: "Preparing to scan feature definitions across all user types"
    },
    {
      name: "Checking database requirements",
      description: "Analyzing database requirements and implementation status",
      status: "pending",
      progressPercentage: 0,
      details: "Checking database definitions, schemas, and implementation details"
    },
    {
      name: "Analyzing implementation status",
      description: "Verifying implementation status for each feature",
      status: "pending",
      progressPercentage: 0,
      details: "Comparing status fields with actual implementation details"
    },
    {
      name: "Validating feature dependencies",
      description: "Checking for circular dependencies and missing references",
      status: "pending",
      progressPercentage: 0,
      details: "Analyzing dependencies between features"
    },
    {
      name: "Assessing API implementation status",
      description: "Verifying API endpoints for each feature",
      status: "pending",
      progressPercentage: 0,
      details: "Checking API endpoint availability and implementation"
    },
    {
      name: "Checking UI component status",
      description: "Validating UI components referenced in features",
      status: "pending",
      progressPercentage: 0,
      details: "Analyzing UI component implementation and references"
    },
    {
      name: "Detecting potential implementation gaps",
      description: "Identifying missing implementation details",
      status: "pending",
      progressPercentage: 0,
      details: "Looking for inconsistencies in implementation status"
    },
    {
      name: "Analyzing implementation consistency",
      description: "Checking for consistent implementation across dependencies",
      status: "pending",
      progressPercentage: 0,
      details: "Verifying that dependent features have appropriate implementation status"
    },
    {
      name: "Calculating implementation statistics",
      description: "Generating implementation statistics across user types",
      status: "pending",
      progressPercentage: 0,
      details: "Calculating percentage complete and other metrics"
    },
    {
      name: "Generating feature report",
      description: "Preparing final analysis report",
      status: "pending",
      progressPercentage: 0,
      details: "Aggregating findings into a comprehensive report"
    }
  ];
};

/**
 * Update progress for an analysis step
 */
export const updateAnalysisStep = (
  steps: AnalysisStep[],
  stepIndex: number,
  progress: number,
  status: 'pending' | 'running' | 'complete' | 'error',
  details?: string
): AnalysisStep[] => {
  return steps.map((step, index) => {
    if (index === stepIndex) {
      return {
        ...step,
        progressPercentage: progress,
        status,
        details: details || step.details
      };
    }
    return step;
  });
};
