
import { ABTestResult, ReferralSource } from '@/types/EventTypes';
import { safeJsonToRecord } from '@/utils/typeGuards';
import { NotificationChannel } from '@/types/CampaignSegmentTypes';

/**
 * Converts raw campaign data to frontend ABTestResult
 */
export function convertToABTestResult(data: any): ABTestResult {
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

  const variants = Array.isArray(data.variants) ? data.variants : [];
  let variantA = undefined;
  let variantB = undefined;
  let improvement = 0;

  if (variants.length >= 1) {
    variantA = variants[0];
  }
  
  if (variants.length >= 2) {
    variantB = variants[1];
    
    if (variantA && variantB && variantA.conversionRate > 0) {
      improvement = ((variantB.conversionRate - variantA.conversionRate) / variantA.conversionRate) * 100;
    }
  }

  return {
    variants,
    winner: data.winner || null,
    variantA,
    variantB,
    improvement,
    significantResult: data.significantResult || Math.abs(improvement) > 10
  };
}

/**
 * Converts raw referral source data to consistent ReferralSource format
 */
export function convertToReferralSource(data: any): ReferralSource {
  if (!data) {
    return {
      source: '',
      count: 0,
      percentage: 0,
      name: '',
      visits: 0,
      conversions: 0,
      conversionRate: 0
    };
  }
  
  // Create consistent object with both frontend and backend properties
  return {
    // Frontend properties
    source: data.source || data.name || '',
    count: data.count || data.visits || 0,
    percentage: data.percentage || data.conversionRate || 0,
    
    // Backend properties
    name: data.name || data.source || '',
    visits: data.visits || data.count || 0,
    conversions: data.conversions || 0,
    conversionRate: data.conversionRate || data.percentage || 0
  };
}

/**
 * Validates and converts string array to notification channels
 */
export function convertToNotificationChannels(channels: string[]): NotificationChannel[] {
  const validChannels: NotificationChannel[] = [];
  const validOptions: NotificationChannel[] = ['email', 'in_app', 'push'];
  
  channels.forEach(channel => {
    if (validOptions.includes(channel as NotificationChannel)) {
      validChannels.push(channel as NotificationChannel);
    }
  });
  
  // Default to in_app if no valid channels
  return validChannels.length > 0 ? validChannels : ['in_app'];
}

/**
 * Converts metric value to the appropriate type for DB storage
 */
export function convertMetricValue(value: any, defaultValue: number = 0): number {
  if (typeof value === 'number') {
    return value;
  }
  
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  
  return defaultValue;
}
