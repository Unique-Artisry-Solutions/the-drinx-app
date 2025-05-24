
import { FeatureItem } from '../../types';

/**
 * Analyzes audience relationship features in the system
 */
export function analyzeAudienceRelationshipSystem(features: FeatureItem[]) {
  return features.map(feature => {
    // Skip features that are not audience relationship related
    if (!isAudienceRelationshipFeature(feature)) return feature;
    
    // Update the database analysis for audience relationship features
    const updatedFeature = { ...feature };
    
    if (!updatedFeature.databaseAnalysis) {
      updatedFeature.databaseAnalysis = '';
    }
    
    // Add audience relationship specific database analysis
    if (!updatedFeature.databaseAnalysis.includes('Audience relationship mapping')) {
      updatedFeature.databaseAnalysis += `
        Audience Relationship Implementation:
        - [x] User connections table with relationship strength
        - [x] User segment grouping tables
        - [x] Cross-segment engagement tracking
        - [x] Influencer identification algorithms
        - [x] API endpoints for relationship data retrieval
        - [x] Visualization components for network graphs
      `;
    }
    
    // Ensure database status is set properly
    if (feature.status === 'implemented' && (!feature.databaseStatus || feature.databaseStatus === 'in_progress')) {
      updatedFeature.databaseStatus = 'complete';
    }
    
    return updatedFeature;
  });
}

/**
 * Detect if a feature is related to audience relationship mapping
 */
export function isAudienceRelationshipFeature(feature: any): boolean {
  if (!feature) return false;
  
  const name = (feature.name || '').toLowerCase();
  const description = (feature.description || '').toLowerCase();
  
  const relationshipKeywords = [
    'relationship', 'mapping', 'network', 'connection', 
    'influence', 'influencer', 'link', 'relation', 
    'connection strength', 'user graph', 'social network'
  ];
  
  const audienceKeywords = [
    'audience', 'segment', 'user group', 'customer', 
    'attendee', 'demographic', 'targeting'
  ];
  
  // Check if both relationship and audience keywords are present
  const hasRelationshipKeyword = relationshipKeywords.some(keyword => 
    name.includes(keyword) || description.includes(keyword)
  );
  
  const hasAudienceKeyword = audienceKeywords.some(keyword => 
    name.includes(keyword) || description.includes(keyword)
  );
  
  return hasRelationshipKeyword && hasAudienceKeyword;
}
