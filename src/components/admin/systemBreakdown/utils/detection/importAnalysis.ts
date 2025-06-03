
/**
 * Import Analysis for Legacy Detection Function Migration
 * 
 * This file analyzes how legacy detection functions are imported and used
 * across the codebase to plan safe migration steps.
 */

// IMPORT MAPPING ANALYSIS
export const IMPORT_ANALYSIS = {
  // Files that import from the main detection index
  MAIN_INDEX_IMPORTS: {
    'src/components/admin/systemBreakdown/utils/featureShowcase/featureTransformation.ts': [
      'isRewardProgramFeature',
      'isPromotionFeature', 
      'isAIFeature',
      'isAnalyticsFeature',
      'isVisitTrackingFeature',
      'isMapFeature',
      'isSocialFeature',
      'isMocktailSuggestionFeature',
      'isIngredientPairingFeature',
      'isThemeFeature'
    ],
    
    'src/components/admin/systemBreakdown/utils/featureShowcase/categoryDetection.ts': [
      'isAIFeature',
      'isMocktailSuggestionFeature',
      'isMocktailTrendsFeature',
      'isSocialFeature',
      'isBarCrawlFeature',
      'isAnalyticsFeature',
      'isDashboardFeature',
      'isVisitTrackingFeature',
      'isExplorationFeature',
      'isUserManagementFeature',
      'isEstablishmentManagementFeature',
      'isSystemBreakdownFeature',
      'isThemeFeature',
      'isRewardProgramFeature',
      'isPromotionFeature'
    ],

    'src/components/admin/systemBreakdown/utils/featureShowcase/iconSelection.ts': [
      'isAIFeature',
      'isBarCrawlFeature',
      'isMocktailSuggestionFeature',
      'isVisitTrackingFeature',
      'isRewardProgramFeature',
      'isThemeFeature',
      'isPromotionFeature',
      'isAnalyticsFeature',
      'isMapFeature',
      'isSocialFeature',
      'isRecipeFeature',
      'isNotificationFeature',
      'isUserManagementFeature',
      'isPromoterCommunicationFeature',
      'isEventManagementFeature',
      'isPromoterDashboardFeature',
      'isPromoterAnalyticsFeature',
      'isCustomPromotionFeature',
      'isBrandConnectionFeature'
    ],

    'src/components/admin/systemBreakdown/utils/featureShowcase/marketingUtils.ts': [
      'isAIFeature',
      'isBarCrawlFeature',
      'isMocktailSuggestionFeature',
      'isVisitTrackingFeature',
      'isRewardProgramFeature',
      'isThemeFeature',
      'isPromotionFeature',
      'isAnalyticsFeature'
    ]
  },

  // Files that import from featureDetection.ts directly
  FEATURE_DETECTION_IMPORTS: {
    'src/components/admin/systemBreakdown/utils/featureShowcaseUtils.ts': [
      'isAIFeature',
      'isAnalyticsFeature',
      'isMapFeature',
      'isExplorationFeature',
      'isIngredientPairingFeature',
      'isMocktailSuggestionFeature',
      'isMocktailTrendsFeature',
      'isNotificationFeature',
      'isPromotionFeature',
      'isRewardProgramFeature',
      'isSignatureFeature',
      'isSocialFeature',
      'isSystemBreakdownFeature',
      'isThemeFeature',
      'isDashboardFeature',
      'isVisitTrackingFeature',
      'isBarCrawlFeature',
      'isEstablishmentManagementFeature'
    ]
  }
};

// MIGRATION STEPS ANALYSIS
export const MIGRATION_STEPS = {
  PHASE_2B_TARGETS: [
    {
      file: 'src/components/admin/systemBreakdown/utils/featureShowcase/featureTransformation.ts',
      priority: 'HIGH',
      risk: 'LOW',
      functions_to_migrate: 10,
      estimated_time: '2 minutes'
    },
    {
      file: 'src/components/admin/systemBreakdown/utils/featureShowcase/categoryDetection.ts', 
      priority: 'HIGH',
      risk: 'LOW',
      functions_to_migrate: 15,
      estimated_time: '3 minutes'
    },
    {
      file: 'src/components/admin/systemBreakdown/utils/featureShowcase/iconSelection.ts',
      priority: 'MEDIUM',
      risk: 'LOW', 
      functions_to_migrate: 17,
      estimated_time: '3 minutes'
    },
    {
      file: 'src/components/admin/systemBreakdown/utils/featureShowcase/marketingUtils.ts',
      priority: 'MEDIUM',
      risk: 'LOW',
      functions_to_migrate: 8,
      estimated_time: '2 minutes'
    }
  ],

  PHASE_2C_TARGETS: [
    {
      file: 'src/components/admin/systemBreakdown/utils/featureShowcaseUtils.ts',
      action: 'CONSOLIDATE_OR_REMOVE',
      reason: 'Duplicate of .tsx file',
      risk: 'MEDIUM'
    }
  ]
};

// COMPATIBILITY REQUIREMENTS
export const COMPATIBILITY_REQUIREMENTS = {
  // Functions that must remain available for external use
  MUST_MAINTAIN: [
    'isSignatureFeature',
    'isPromotionFeature',
    'isRewardProgramFeature', 
    'isAnalyticsFeature',
    'isAIFeature',
    'isThemeFeature'
  ],

  // Functions that can be migrated immediately
  CAN_MIGRATE_IMMEDIATELY: [
    'isUserManagementFeature',
    'isEstablishmentManagementFeature',
    'isSystemBreakdownFeature',
    'isMapFeature',
    'isSocialFeature',
    'isNotificationFeature'
  ],

  // Functions that need careful testing
  NEEDS_TESTING: [
    'isBarCrawlFeature',
    'isSwigCircuitFeature',
    'isVisitTrackingFeature',
    'isExplorationFeature'
  ]
};

/**
 * Get next safe migration target
 */
export function getNextMigrationTarget(): {
  file: string;
  functions: string[];
  risk: string;
} | null {
  const targets = MIGRATION_STEPS.PHASE_2B_TARGETS.filter(t => t.risk === 'LOW');
  
  if (targets.length === 0) return null;
  
  const target = targets[0];
  const functions = IMPORT_ANALYSIS.MAIN_INDEX_IMPORTS[target.file] || [];
  
  return {
    file: target.file,
    functions,
    risk: target.risk
  };
}

export default IMPORT_ANALYSIS;
