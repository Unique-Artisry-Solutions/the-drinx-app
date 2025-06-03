
/**
 * Phase 2A: Legacy Detection Function Audit & Mapping
 * 
 * This file documents all legacy detection functions and their current usage
 * to ensure safe migration to the unified detection system.
 */

// LEGACY DETECTION FUNCTIONS AUDIT
export const LEGACY_DETECTION_AUDIT = {
  // Core legacy functions that need to be maintained for compatibility
  CORE_LEGACY_FUNCTIONS: [
    'isUserManagementFeature',
    'isAuthFeature', 
    'isProfileFeature',
    'isContentFeature',
    'isContentModerationFeature',
    'isPhotoFeature',
    'isPhotoModerationFeature',
    'isAnalyticsFeature',
    'isDashboardFeature',
    'isSystemBreakdownFeature',
    'isSocialFeature',
    'isExplorationFeature',
    'isNotificationFeature',
    'isPromotionFeature',
    'isRewardProgramFeature',
    'isAIFeature',
    'isMocktailSuggestionFeature',
    'isMocktailTrendsFeature',
    'isIngredientPairingFeature',
    'isRecipeFeature',
    'isEstablishmentManagementFeature',
    'isVisitTrackingFeature',
    'isBarCrawlFeature',
    'isSwigCircuitFeature',
    'isMapFeature',
    'isSystemConfigurationFeature',
    'isThemeFeature',
    'isAccessibilityFeature',
    'isSignatureFeature'
  ],

  // Promoter-specific functions
  PROMOTER_FUNCTIONS: [
    'isAudienceInfluencerFeature',
    'isCrossSegmentEngagementFeature', 
    'isAudienceVisualizationFeature',
    'isPromoterCommunicationFeature',
    'isBrandConnectionFeature',
    'isPromoterAnalyticsFeature',
    'isEventManagementFeature',
    'isPromoterDashboardFeature',
    'isCustomPromotionFeature',
    'isPromoterNotificationFeature',
    'isTicketManagementFeature'
  ],

  // Promotion-specific functions  
  PROMOTION_FUNCTIONS: [
    'isPromotionAnalyticsFeature',
    'isPromotionSecurityFeature',
    'isPromotionNotificationFeature',
    'isPromotionCreationFeature',
    'isPromotionManagementFeature',
    'isPromotionRedemptionFeature',
    'isPromotionReportingFeature',
    'isPromotionValidationFeature',
    'isPromotionSchedulingFeature',
    'isPromotionIntegrationFeature',
    'isPromotionAIFeature'
  ],

  // Theme-related functions
  THEME_FUNCTIONS: [
    'isThemeConfigurationFeature'
  ],

  // Files that import legacy functions (need gradual migration)
  FILES_USING_LEGACY_FUNCTIONS: [
    'src/components/admin/systemBreakdown/utils/featureDetection.ts',
    'src/components/admin/systemBreakdown/utils/index.tsx',
    'src/components/admin/systemBreakdown/utils/featureShowcase/featureTransformation.ts',
    'src/components/admin/systemBreakdown/utils/featureShowcase/categoryDetection.ts',
    'src/components/admin/systemBreakdown/utils/featureShowcase/iconSelection.ts',
    'src/components/admin/systemBreakdown/utils/featureShowcase/marketingUtils.ts',
    'src/components/admin/systemBreakdown/utils/featureShowcaseUtils.tsx',
    'src/components/admin/systemBreakdown/utils/featureShowcaseUtils.ts'
  ],

  // Duplicate files that need consolidation
  DUPLICATE_FILES: [
    {
      file1: 'src/components/admin/systemBreakdown/utils/featureShowcaseUtils.tsx',
      file2: 'src/components/admin/systemBreakdown/utils/featureShowcaseUtils.ts',
      issue: 'Both files exist with similar functionality'
    }
  ],

  // Legacy detection files that can be safely removed after migration
  LEGACY_FILES_TO_REMOVE: [
    // Will be determined after import analysis
  ],

  // Current unified detection system files
  UNIFIED_DETECTION_FILES: [
    'src/components/admin/systemBreakdown/utils/detection/FeatureDetectionEngine.ts',
    'src/components/admin/systemBreakdown/utils/detection/unifiedDetection.ts',
    'src/components/admin/systemBreakdown/utils/detection/categoryMapping.ts'
  ]
};

// MIGRATION STRATEGY MAPPING
export const MIGRATION_STRATEGY = {
  // Step 1: Update imports to use unified detection where possible
  IMMEDIATE_MIGRATION_CANDIDATES: [
    'featureShowcase/featureTransformation.ts',
    'featureShowcase/categoryDetection.ts', 
    'featureShowcase/iconSelection.ts',
    'featureShowcase/marketingUtils.ts'
  ],

  // Step 2: Maintain compatibility wrappers for heavily used functions
  COMPATIBILITY_WRAPPERS_NEEDED: [
    'isSignatureFeature',
    'isPromotionFeature', 
    'isRewardProgramFeature',
    'isAnalyticsFeature',
    'isAIFeature'
  ],

  // Step 3: Files that need careful review before changes
  HIGH_RISK_FILES: [
    'src/components/admin/systemBreakdown/utils/index.tsx',
    'src/components/admin/systemBreakdown/utils/featureDetection.ts'
  ]
};

// CURRENT STATE ANALYSIS
export const CURRENT_STATE = {
  DETECTION_SYSTEM_STATUS: 'DUAL_SYSTEM', // Both legacy and unified exist
  MIGRATION_PHASE: 'AUDIT_COMPLETE',
  NEXT_PHASE: 'GRADUAL_IMPORT_UPDATES',
  
  RISK_ASSESSMENT: {
    BUILD_ERRORS: 'HIGH_RISK', // Previous attempt caused many errors
    FUNCTIONALITY_IMPACT: 'MEDIUM_RISK', // Some functions may break
    COMPATIBILITY: 'LOW_RISK' // Unified system is designed for compatibility
  },

  RECOMMENDATIONS: [
    'Update imports one file at a time',
    'Test after each file change',
    'Keep compatibility wrappers until all files migrated',
    'Remove duplicate featureShowcaseUtils files',
    'Consolidate detection logic gradually'
  ]
};

/**
 * Utility function to check if a detection function is safe to migrate
 */
export function isSafeToMigrate(functionName: string): boolean {
  const safeFunctions = [
    ...LEGACY_DETECTION_AUDIT.CORE_LEGACY_FUNCTIONS.slice(0, 5), // First 5 core functions
    ...LEGACY_DETECTION_AUDIT.THEME_FUNCTIONS
  ];
  
  return safeFunctions.includes(functionName);
}

/**
 * Get migration priority for a function
 */
export function getMigrationPriority(functionName: string): 'HIGH' | 'MEDIUM' | 'LOW' {
  if (MIGRATION_STRATEGY.IMMEDIATE_MIGRATION_CANDIDATES.some(file => 
    file.includes(functionName.replace('is', '').replace('Feature', '').toLowerCase())
  )) {
    return 'HIGH';
  }
  
  if (MIGRATION_STRATEGY.COMPATIBILITY_WRAPPERS_NEEDED.includes(functionName)) {
    return 'MEDIUM';
  }
  
  return 'LOW';
}

export default LEGACY_DETECTION_AUDIT;
