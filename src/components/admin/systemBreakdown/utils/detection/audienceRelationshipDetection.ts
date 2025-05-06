
/**
 * Detection functions for audience relationship features
 */

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

/**
 * Detect if a feature is related to audience influencer identification
 */
export function isAudienceInfluencerFeature(feature: any): boolean {
  if (!feature) return false;
  
  const name = (feature.name || '').toLowerCase();
  const description = (feature.description || '').toLowerCase();
  
  const influencerKeywords = [
    'influencer', 'opinion leader', 'key customer', 'brand ambassador',
    'high impact user', 'social capital', 'influence score'
  ];
  
  return influencerKeywords.some(keyword => 
    name.includes(keyword) || description.includes(keyword)
  );
}

/**
 * Detect if a feature is related to cross-segment engagement
 */
export function isCrossSegmentEngagementFeature(feature: any): boolean {
  if (!feature) return false;
  
  const name = (feature.name || '').toLowerCase();
  const description = (feature.description || '').toLowerCase();
  
  const crossSegmentKeywords = [
    'cross-segment', 'cross segment', 'segment interaction', 
    'audience overlap', 'segment bridge', 'demographic crossover'
  ];
  
  return crossSegmentKeywords.some(keyword => 
    name.includes(keyword) || description.includes(keyword)
  );
}

/**
 * Detect if a feature is related to audience visualization
 */
export function isAudienceVisualizationFeature(feature: any): boolean {
  if (!feature) return false;
  
  const name = (feature.name || '').toLowerCase();
  const description = (feature.description || '').toLowerCase();
  
  const visualizationKeywords = [
    'visualization', 'heatmap', 'network graph', 'relationship matrix',
    'audience map', 'connection diagram', 'segment visualization'
  ];
  
  return visualizationKeywords.some(keyword => 
    name.includes(keyword) || description.includes(keyword)
  );
}
