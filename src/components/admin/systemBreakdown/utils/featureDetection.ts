
// This is a new file to add the audience relationship feature detection
// The file didn't exist before so we need to create it

/**
 * Detects if a feature is related to audience relationship mapping
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
