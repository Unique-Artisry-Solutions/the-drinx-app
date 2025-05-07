
import { ABTestResult, ReferralSource } from '@/types/EventTypes';
import { NotificationPriority } from '@/types/CampaignSegmentTypes';

/**
 * Converts raw data to an ABTestResult object
 */
export const convertToABTestResult = (data: any): ABTestResult => {
  if (!data) {
    return {
      variants: [],
      winner: null,
      variantA: undefined,
      variantB: undefined,
      improvement: 0,
      significantResult: false
    };
  }
  
  const variants = data.variants || [];
  
  return {
    variants: variants,
    winner: data.winner || null,
    variantA: data.variantA || variants[0],
    variantB: data.variantB || variants[1],
    improvement: data.improvement || 0,
    significantResult: data.significantResult || false
  };
};

/**
 * Converts raw data to a ReferralSource object
 */
export const convertToReferralSource = (data: any): ReferralSource => {
  if (!data) {
    return {
      source: 'unknown',
      name: 'Unknown',
      count: 0,
      visits: 0,
      percentage: 0,
      conversionRate: 0,
      conversions: 0
    };
  }
  
  return {
    source: data.source || 'unknown',
    name: data.name || data.source || 'Unknown',
    count: data.count || 0,
    visits: data.visits || data.count || 0,
    percentage: data.percentage || 0,
    conversionRate: data.conversionRate || 0,
    conversions: data.conversions || 0
  };
};

/**
 * Validates and normalizes notification priority
 */
export const validateNotificationPriority = (
  priority: string | undefined
): NotificationPriority => {
  const validPriorities: NotificationPriority[] = ['low', 'medium', 'high', 'urgent'];
  
  if (!priority || !validPriorities.includes(priority as NotificationPriority)) {
    return 'medium'; // Default priority
  }
  
  return priority as NotificationPriority;
};
