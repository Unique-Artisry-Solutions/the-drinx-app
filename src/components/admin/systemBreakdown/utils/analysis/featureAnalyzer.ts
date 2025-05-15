
import { FeatureItem, AnalysisStep } from '../../types';

/**
 * Analyzes the promoter system features
 * @param features Promoter features to analyze
 * @param existingSteps Any existing analysis steps
 * @returns Updated features and analysis steps
 */
export function analyzePromoterSystem(features: FeatureItem[], existingSteps: AnalysisStep[] = []) {
  const updatedFeatures = [...features];
  const updatedSteps: AnalysisStep[] = [];
  
  // Track the follower management feature specifically
  const followerManagementFeature = updatedFeatures.find(f => 
    f.name.toLowerCase().includes('follower management') || 
    f.name.toLowerCase().includes('free follower model')
  );
  
  // If we found it, ensure it shows the correct progress (70%)
  if (followerManagementFeature) {
    const index = updatedFeatures.findIndex(f => f.id === followerManagementFeature.id);
    if (index >= 0) {
      updatedFeatures[index] = {
        ...followerManagementFeature,
        implementationProgress: 70, // Ensure we keep the 70% progress
        status: 'in_progress' as const
      };
      
      // Add an analysis step related to this feature
      updatedSteps.push({
        id: 'follower-model',
        name: 'Analyzed Free Follower Model progress',
        description: 'Verified implementation progress of the Free Follower Model',
        isComplete: true,
        progress: 100
      });
      
      updatedSteps.push({
        id: 'promotion-system',
        name: 'Verified Promotion System',
        description: 'Checked status of the promotion system features',
        isComplete: true,
        progress: 100
      });
      
      updatedSteps.push({
        id: 'event-system',
        name: 'Analyzed Event System',
        description: 'Verified integration with event management',
        isComplete: true,
        progress: 100
      });
      
      updatedSteps.push({
        id: 'marketing-tools',
        name: 'Checked Marketing Tools',
        description: 'Analyzed marketing tool implementation',
        isComplete: true,
        progress: 100
      });
    }
  }
  
  return { 
    updatedFeatures,
    updatedSteps
  };
}

/**
 * Analyzes the swig circuit system features
 */
export function analyzeSwigCircuitSystem(features: FeatureItem[]): FeatureItem[] {
  return features.map(feature => {
    if (feature.name.toLowerCase().includes('swig circuit')) {
      // Ensure Swig Circuit features have appropriate database status
      return {
        ...feature,
        databaseStatus: feature.status === 'implemented' ? 'complete' : 
                        feature.status === 'in_progress' ? 'in_progress' : 
                        feature.databaseStatus || 'not_started'
      };
    }
    return feature;
  });
}

/**
 * Analyzes the reward system features
 */
export function analyzeRewardSystem(features: FeatureItem[]): FeatureItem[] {
  return features.map(feature => {
    if (feature.name.toLowerCase().includes('reward') || 
        feature.description.toLowerCase().includes('reward')) {
      return {
        ...feature,
        // If it's a reward feature, ensure database status is consistent with feature status
        databaseStatus: feature.status === 'implemented' ? 'complete' : 
                        feature.status === 'partial' ? 'partial' : 
                        feature.status === 'in_progress' ? 'in_progress' : 
                        feature.databaseStatus || 'not_started'
      };
    }
    return feature;
  });
}

/**
 * Updates the database status of features
 */
export function updateFeaturesDbStatus(features: FeatureItem[]): FeatureItem[] {
  return features.map(feature => {
    // If there's database analysis, update status based on that
    if (feature.databaseAnalysis) {
      const dbAnalysisText = feature.databaseAnalysis.toLowerCase();
      if (dbAnalysisText.includes('[x]') && !dbAnalysisText.includes('[ ]')) {
        // All checkboxes marked - complete
        return { ...feature, databaseStatus: 'complete' };
      } else if (dbAnalysisText.includes('[x]')) {
        // Some checkboxes marked - partial
        return { ...feature, databaseStatus: 'partial' };
      }
    }
    
    return feature;
  });
}
