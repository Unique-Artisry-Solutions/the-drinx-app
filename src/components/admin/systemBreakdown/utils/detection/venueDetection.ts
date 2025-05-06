
// This file is needed to re-export the detection functions from their respective modules
// to maintain backward compatibility with existing code

import { isAnalyticsFeature as originalIsAnalyticsFeature } from './analyticsDetection';
import { isDashboardFeature as originalIsDashboardFeature } from './analyticsDetection';
import { isSystemBreakdownFeature as originalIsSystemBreakdownFeature } from './analyticsDetection';
import { isAIFeature as originalIsAIFeature } from './aiDetection';
import { isExplorationFeature as originalIsExplorationFeature } from './engagementDetection';
import { isNotificationFeature as originalIsNotificationFeature } from './engagementDetection';
import { isRewardProgramFeature as originalIsRewardProgramFeature } from './engagementDetection';
import { isSocialFeature as originalIsSocialFeature } from './engagementDetection';
import { isThemeFeature as originalIsThemeFeature } from './themeDetection';
import { isMapFeature as originalIsMapFeature } from './mapDetection';
import { isSignatureFeature as originalIsSignatureFeature } from './signatureFeatureDetection';
import { isBarCrawlFeature as originalIsBarCrawlFeature } from './circuitDetection';
import { isSwigCircuitFeature as originalIsSwigCircuitFeature } from './circuitDetection';
import { isVisitTrackingFeature as originalIsVisitTrackingFeature } from './establishmentDetection';

// Re-export all detection functions
export const isAnalyticsFeature = originalIsAnalyticsFeature;
export const isDashboardFeature = originalIsDashboardFeature;
export const isSystemBreakdownFeature = originalIsSystemBreakdownFeature;
export const isAIFeature = originalIsAIFeature;
export const isExplorationFeature = originalIsExplorationFeature;
export const isNotificationFeature = originalIsNotificationFeature;
export const isRewardProgramFeature = originalIsRewardProgramFeature;
export const isSocialFeature = originalIsSocialFeature;
export const isThemeFeature = originalIsThemeFeature;
export const isMapFeature = originalIsMapFeature;
export const isSignatureFeature = originalIsSignatureFeature;
export const isBarCrawlFeature = originalIsBarCrawlFeature;
export const isSwigCircuitFeature = originalIsSwigCircuitFeature;
export const isVisitTrackingFeature = originalIsVisitTrackingFeature;
