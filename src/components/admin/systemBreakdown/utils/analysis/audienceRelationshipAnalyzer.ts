
import { FeatureItem } from '../../types';
import { isAudienceInfluencerFeature, isAudienceRelationshipFeature } from '../featureDetection';

/**
 * Analyze audience relationship features and update their status
 */
export function analyzeAudienceRelationshipSystem(features: FeatureItem[]): FeatureItem[] {
  // Get all audience relationship features
  const audienceFeatures = features.filter(feature => 
    isAudienceRelationshipFeature(feature) || 
    isAudienceInfluencerFeature(feature)
  );
  
  // If we have no audience features, return the original list
  if (audienceFeatures.length === 0) {
    return features;
  }
  
  // Clone the features array to avoid mutating the original
  const updatedFeatures = [...features];
  
  // Update each audience feature
  audienceFeatures.forEach(audienceFeature => {
    const index = updatedFeatures.findIndex(f => f.id === audienceFeature.id);
    if (index !== -1) {
      const updated = { ...updatedFeatures[index] };
      
      // Add audience-specific analytics
      if (!updated.databaseAnalysis) {
        updated.databaseAnalysis = "Audience relationship feature requires user profile data and interaction metrics.";
      }
      
      // Update database status for implemented features
      if (updated.status === 'implemented' && updated.databaseStatus !== 'completed') {
        updated.databaseStatus = 'completed';
        updated.statusUpdated = true;
      }
      
      // Add testing steps if not already present
      if (!updated.testSteps || updated.testSteps.length === 0) {
        updated.testSteps = [
          "Verify audience segmentation logic",
          "Test user connection mapping",
          "Validate influence metrics calculation",
          "Check relationship tracking system"
        ];
      }
      
      updatedFeatures[index] = updated;
    }
  });
  
  return updatedFeatures;
}

// Export a function to get all audience-related features
export function getAudienceRelationshipFeatures(features: FeatureItem[]): FeatureItem[] {
  return features.filter(feature => 
    isAudienceRelationshipFeature(feature) || 
    isAudienceInfluencerFeature(feature)
  );
}
