
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DynamicPricingEngine, PricingContext, DynamicPriceResult } from '@/services/pricing/DynamicPricingEngine';
import { DemandAnalyticsService, DemandAnalysisResult } from '@/services/demandAnalyticsService';

export const useDynamicPricing = (
  eventId?: string,
  swigCircuitId?: string,
  basePrice?: number
) => {
  const [pricingContext, setPricingContext] = useState<PricingContext | null>(null);

  // Get demand analysis
  const {
    data: demandAnalysis,
    isLoading: demandLoading,
    error: demandError
  } = useQuery({
    queryKey: ['demandAnalysis', eventId, swigCircuitId],
    queryFn: () => DemandAnalyticsService.calculateDemandScore(eventId, swigCircuitId),
    enabled: !!(eventId || swigCircuitId),
    refetchInterval: 5 * 60 * 1000 // Refresh every 5 minutes
  });

  // Get dynamic pricing
  const {
    data: dynamicPricing,
    isLoading: pricingLoading,
    error: pricingError,
    refetch: refetchPricing
  } = useQuery({
    queryKey: ['dynamicPricing', pricingContext],
    queryFn: () => pricingContext ? DynamicPricingEngine.calculateDynamicPrice(pricingContext) : null,
    enabled: !!pricingContext
  });

  // Get pricing strategy recommendations
  const {
    data: pricingStrategy,
    isLoading: strategyLoading
  } = useQuery({
    queryKey: ['pricingStrategy', eventId, swigCircuitId],
    queryFn: () => DynamicPricingEngine.getRecommendedStrategy(eventId, swigCircuitId),
    enabled: !!(eventId || swigCircuitId),
    refetchInterval: 30 * 60 * 1000 // Refresh every 30 minutes
  });

  // Update pricing context when parameters change
  useEffect(() => {
    if ((eventId || swigCircuitId) && basePrice && demandAnalysis) {
      const context: PricingContext = {
        eventId,
        swigCircuitId,
        basePrice,
        timeToEvent: 30, // This should be calculated from event date
        currentInventory: 100, // This should come from ticket inventory
        totalInventory: 100, // This should come from ticket inventory
        competitorPrices: [] // This could be fetched from external sources
      };
      setPricingContext(context);
    }
  }, [eventId, swigCircuitId, basePrice, demandAnalysis]);

  // Function to update demand metrics
  const updateDemandMetrics = async (metrics: {
    pageViews?: number;
    uniqueVisitors?: number;
    cartAdditions?: number;
    cartAbandonments?: number;
    salesInLast24h?: number;
  }) => {
    await DemandAnalyticsService.updateDemandMetrics(eventId, swigCircuitId, metrics);
    // Refetch demand analysis after update
    setTimeout(() => {
      refetchPricing();
    }, 1000);
  };

  return {
    // Data
    demandAnalysis,
    dynamicPricing,
    pricingStrategy,
    
    // Loading states
    isLoading: demandLoading || pricingLoading || strategyLoading,
    demandLoading,
    pricingLoading,
    strategyLoading,
    
    // Errors
    error: demandError || pricingError,
    demandError,
    pricingError,
    
    // Actions
    updateDemandMetrics,
    refetchPricing,
    
    // Computed values
    recommendedPrice: dynamicPricing?.finalPrice || basePrice,
    priceAdjustment: dynamicPricing?.adjustmentPercentage || 0,
    confidence: demandAnalysis?.confidence || 0
  };
};
