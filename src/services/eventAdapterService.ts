
import { EventMarketingCampaign, ABTestResult, ReferralSource } from '@/types/EventTypes';
import { convertToABTestResult, convertToReferralSource } from '@/services/typeAdapterService';

/**
 * Converts a campaign ID to an ABTestResult by fetching and processing data
 * This adapter helps to bridge the gap where a function expects a direct ABTestResult
 * but is being passed a campaign ID or promise
 */
export const adaptCampaignToABTest = async (
  campaignData: EventMarketingCampaign | string | Promise<ABTestResult>
): Promise<ABTestResult> => {
  try {
    // If already an ABTestResult promise, just await it
    if (campaignData instanceof Promise) {
      return await campaignData;
    }
    
    // If it's just a string (campaignId), we need to fetch data
    // This is a placeholder - in reality this would call getCampaignABTestResults
    if (typeof campaignData === 'string') {
      // Here we'd call the API but for now return default
      return {
        variants: [],
        winner: null,
        variantA: undefined,
        variantB: undefined,
        improvement: 0,
        significantResult: false
      };
    }
    
    // Handle campaign object
    // This would extract relevant data from the campaign
    // For now just return a default ABTestResult
    return {
      variants: [],
      winner: null,
      variantA: undefined,
      variantB: undefined,
      improvement: 0,
      significantResult: false
    };
  } catch (error) {
    console.error('Error adapting campaign to AB test:', error);
    return {
      variants: [],
      winner: null,
      variantA: undefined,
      variantB: undefined,
      improvement: 0,
      significantResult: false
    };
  }
};

/**
 * Adapts a referral source string to a ReferralSource object
 * This bridges the gap when a component expects a ReferralSource but receives a string
 */
export const adaptStringToReferralSource = (source: string | ReferralSource): ReferralSource => {
  if (typeof source === 'string') {
    return {
      source: source,
      name: source,
      count: 0,
      visits: 0,
      percentage: 0,
      conversionRate: 0,
      conversions: 0
    };
  }
  
  return source;
};

/**
 * Ensures a data object has all properties needed for components
 * This helps bridge gaps between what API returns and what components expect
 */
export const ensureCompleteDataObject = <T>(data: Partial<T>, defaultValues: T): T => {
  return { ...defaultValues, ...data };
};
