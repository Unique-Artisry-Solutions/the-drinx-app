
// Re-export relevant venue-related detection functions from their specific modules
export { isSwigCircuitFeature, isBarCrawlFeature, isVipFeature } from './circuitDetection';
export { isAIFeature } from './aiDetection';
export { isAnalyticsFeature, isDashboardFeature, isSystemBreakdownFeature } from './analyticsDetection';
export { isMapFeature } from './mapDetection';
export { isExplorationFeature, isNotificationFeature, isSocialFeature, isRewardProgramFeature } from './engagementDetection';
export { isRecipeFeature } from './recipeDetection';
export { isThemeFeature } from './themeDetection';
export { isEstablishmentManagementFeature, isVisitTrackingFeature } from './establishmentDetection';
export { isSignatureFeature } from './signatureFeatureDetection';

// Re-export the isPromoterFeature function from the promoterFeatures module
export { isPromoterFeature } from '../../features/promoterFeatures';
