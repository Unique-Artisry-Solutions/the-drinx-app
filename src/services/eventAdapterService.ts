
import { safeJsonToRecord } from '@/utils/typeGuards';

// Adapt campaign data for A/B testing display
export const adaptToABTestingData = (campaignData: any) => {
  if (!campaignData || !campaignData.metrics) {
    return {
      controlData: { conversionRate: 0, traffic: 0 },
      testData: { conversionRate: 0, traffic: 0 }
    };
  }

  const metrics = safeJsonToRecord(campaignData.metrics);
  const abTest = metrics.abTest || {};
  
  // Get control variant data
  const controlVariant = abTest.variantA || {};
  const controlImpressions = controlVariant.impressions || 0;
  const controlConversions = controlVariant.conversions || 0;
  const controlConversionRate = controlImpressions > 0 
    ? (controlConversions / controlImpressions) * 100 
    : 0;
    
  // Get test variant data
  const testVariant = abTest.variantB || {};
  const testImpressions = testVariant.impressions || 0;
  const testConversions = testVariant.conversions || 0;
  const testConversionRate = testImpressions > 0 
    ? (testConversions / testImpressions) * 100 
    : 0;

  return {
    controlData: {
      conversionRate: controlConversionRate,
      traffic: controlImpressions
    },
    testData: {
      conversionRate: testConversionRate,
      traffic: testImpressions
    }
  };
};

// Additional adapter functions...
