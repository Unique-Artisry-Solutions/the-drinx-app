
// Core detection engine
export class FeatureDetectionEngine {
  detect(feature: any): string {
    // Simple keyword-based detection
    const name = feature.name?.toLowerCase() || '';
    const description = feature.description?.toLowerCase() || '';
    
    if (name.includes('user') || name.includes('profile')) return 'user_management';
    if (name.includes('auth') || name.includes('login')) return 'authentication';
    if (name.includes('admin') || name.includes('dashboard')) return 'admin';
    if (name.includes('analytics') || name.includes('metrics')) return 'analytics';
    if (name.includes('notification') || name.includes('alert')) return 'notifications';
    if (name.includes('reward') || name.includes('loyalty')) return 'rewards';
    if (name.includes('promoter') || name.includes('promotion')) return 'promoter';
    if (name.includes('establishment') || name.includes('venue')) return 'establishment';
    if (name.includes('content') || name.includes('moderation')) return 'content';
    if (name.includes('ai') || name.includes('suggestion')) return 'ai_features';
    
    return 'other';
  }
}

// Export the instance
export const featureDetectionEngine = new FeatureDetectionEngine();

// Unified detection - simplified
export const unifiedDetection = {
  categorize: (feature: any) => featureDetectionEngine.detect(feature),
  isComplete: (feature: any) => (feature.implementationProgress || 0) >= 100
};

export type CoreFeatureCategory = 
  | 'user_management' 
  | 'authentication' 
  | 'admin' 
  | 'analytics' 
  | 'notifications' 
  | 'rewards' 
  | 'promoter' 
  | 'establishment' 
  | 'content' 
  | 'ai_features' 
  | 'other';

// Legacy compatibility functions - simplified keyword-based detection
export const isUserManagementFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('user') || feature.name?.toLowerCase().includes('profile');

export const isAuthFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('auth') || feature.name?.toLowerCase().includes('login');

export const isProfileFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('profile');

export const isContentFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('content');

export const isContentModerationFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('moderation');

export const isPhotoFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('photo');

export const isPhotoModerationFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('photo') && feature.name?.toLowerCase().includes('moderation');

export const isAnalyticsFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('analytics') || feature.name?.toLowerCase().includes('metrics');

export const isDashboardFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('dashboard');

export const isSystemBreakdownFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('system') && feature.name?.toLowerCase().includes('breakdown');

export const isSocialFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('social');

export const isExplorationFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('explore') || feature.name?.toLowerCase().includes('discovery');

export const isNotificationFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('notification') || feature.name?.toLowerCase().includes('alert');

export const isPromotionFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('promotion');

export const isRewardProgramFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('reward') || feature.name?.toLowerCase().includes('loyalty');

export const isAIFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('ai') || feature.name?.toLowerCase().includes('machine learning');

export const isMocktailSuggestionFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('mocktail') && feature.name?.toLowerCase().includes('suggestion');

export const isMocktailTrendsFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('mocktail') && feature.name?.toLowerCase().includes('trend');

export const isIngredientPairingFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('ingredient') && feature.name?.toLowerCase().includes('pairing');

export const isRecipeFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('recipe');

export const isEstablishmentManagementFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('establishment') && feature.name?.toLowerCase().includes('management');

export const isVisitTrackingFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('visit') && feature.name?.toLowerCase().includes('tracking');

export const isBarCrawlFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('bar') && feature.name?.toLowerCase().includes('crawl');

export const isSwigCircuitFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('swig') && feature.name?.toLowerCase().includes('circuit');

export const isMapFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('map');

export const isSystemConfigurationFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('system') && feature.name?.toLowerCase().includes('configuration');

export const isThemeFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('theme');

export const isThemeConfigurationFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('theme') && feature.name?.toLowerCase().includes('configuration');

export const isAccessibilityFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('accessibility');

export const isSignatureFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('signature');

export const isFeatureFlagRelated = (feature: any) => 
  feature.name?.toLowerCase().includes('feature') && feature.name?.toLowerCase().includes('flag');

export const isAudienceRelationshipFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('audience') && feature.name?.toLowerCase().includes('relationship');

export const isAudienceInfluencerFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('audience') && feature.name?.toLowerCase().includes('influencer');

export const isCrossSegmentEngagementFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('segment') && feature.name?.toLowerCase().includes('engagement');

export const isAudienceVisualizationFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('audience') && feature.name?.toLowerCase().includes('visualization');

export const isPromoterCommunicationFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('promoter') && feature.name?.toLowerCase().includes('communication');

export const isBrandConnectionFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('brand') && feature.name?.toLowerCase().includes('connection');

export const isPromoterAnalyticsFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('promoter') && feature.name?.toLowerCase().includes('analytics');

export const isEventManagementFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('event') && feature.name?.toLowerCase().includes('management');

export const isPromoterDashboardFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('promoter') && feature.name?.toLowerCase().includes('dashboard');

export const isCustomPromotionFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('custom') && feature.name?.toLowerCase().includes('promotion');

export const isPromoterNotificationFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('promoter') && feature.name?.toLowerCase().includes('notification');

export const isTicketManagementFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('ticket') && feature.name?.toLowerCase().includes('management');

export const isPromotionAnalyticsFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('promotion') && feature.name?.toLowerCase().includes('analytics');

export const isPromotionSecurityFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('promotion') && feature.name?.toLowerCase().includes('security');

export const isPromotionNotificationFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('promotion') && feature.name?.toLowerCase().includes('notification');

export const isPromotionCreationFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('promotion') && feature.name?.toLowerCase().includes('creation');

export const isPromotionManagementFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('promotion') && feature.name?.toLowerCase().includes('management');

export const isPromotionRedemptionFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('promotion') && feature.name?.toLowerCase().includes('redemption');

export const isPromotionReportingFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('promotion') && feature.name?.toLowerCase().includes('reporting');

export const isPromotionValidationFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('promotion') && feature.name?.toLowerCase().includes('validation');

export const isPromotionSchedulingFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('promotion') && feature.name?.toLowerCase().includes('scheduling');

export const isPromotionIntegrationFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('promotion') && feature.name?.toLowerCase().includes('integration');

export const isPromotionAIFeature = (feature: any) => 
  feature.name?.toLowerCase().includes('promotion') && feature.name?.toLowerCase().includes('ai');
