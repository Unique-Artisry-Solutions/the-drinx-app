
import { supabase } from '@/integrations/supabase/client';
import { PricingService } from '@/services/promotional/PricingService';
import { DemandAnalyticsService } from '@/services/demandAnalyticsService';
import { PricingRule } from '@/types/promotional/PricingTypes';

export interface PricingContext {
  eventId?: string;
  swigCircuitId?: string;
  basePrice: number;
  timeToEvent: number;
  currentInventory: number;
  totalInventory: number;
  competitorPrices?: number[];
}

export interface DynamicPriceResult {
  finalPrice: number;
  originalPrice: number;
  adjustmentPercentage: number;
  appliedRules: string[];
  confidence: number;
  reasoning: string[];
}

export class DynamicPricingEngine {
  // Calculate dynamic price based on all factors
  static async calculateDynamicPrice(context: PricingContext): Promise<DynamicPriceResult> {
    try {
      const appliedRules: string[] = [];
      const reasoning: string[] = [];
      let finalPrice = context.basePrice;
      let totalAdjustment = 0;

      // Get demand analysis
      const demandAnalysis = await DemandAnalyticsService.calculateDemandScore(
        context.eventId,
        context.swigCircuitId
      );

      // Apply time-based pricing
      const timeAdjustment = this.calculateTimeBasedAdjustment(context.timeToEvent);
      if (timeAdjustment !== 0) {
        finalPrice *= (1 + timeAdjustment / 100);
        totalAdjustment += timeAdjustment;
        appliedRules.push('Time-based pricing');
        reasoning.push(`Time to event: ${context.timeToEvent} days (${timeAdjustment > 0 ? '+' : ''}${timeAdjustment}%)`);
      }

      // Apply demand-based pricing
      const demandAdjustment = demandAnalysis.recommendedPriceAdjustment;
      if (Math.abs(demandAdjustment) > 1) {
        finalPrice *= (1 + demandAdjustment / 100);
        totalAdjustment += demandAdjustment;
        appliedRules.push('Demand-based pricing');
        reasoning.push(`Demand score: ${Math.round(demandAnalysis.demandScore)} (${demandAdjustment > 0 ? '+' : ''}${demandAdjustment}%)`);
      }

      // Apply inventory-based pricing
      const inventoryAdjustment = this.calculateInventoryAdjustment(
        context.currentInventory,
        context.totalInventory
      );
      if (inventoryAdjustment !== 0) {
        finalPrice *= (1 + inventoryAdjustment / 100);
        totalAdjustment += inventoryAdjustment;
        appliedRules.push('Inventory-based pricing');
        reasoning.push(`Inventory: ${context.currentInventory}/${context.totalInventory} remaining (${inventoryAdjustment > 0 ? '+' : ''}${inventoryAdjustment}%)`);
      }

      // Apply competitor-based pricing
      if (context.competitorPrices && context.competitorPrices.length > 0) {
        const competitorAdjustment = this.calculateCompetitorAdjustment(
          finalPrice,
          context.competitorPrices
        );
        if (competitorAdjustment !== 0) {
          finalPrice *= (1 + competitorAdjustment / 100);
          totalAdjustment += competitorAdjustment;
          appliedRules.push('Competitor pricing');
          reasoning.push(`Market positioning adjustment (${competitorAdjustment > 0 ? '+' : ''}${competitorAdjustment}%)`);
        }
      }

      // Apply pricing rules from database
      const dbRules = await this.getApplicablePricingRules(context);
      for (const rule of dbRules) {
        const ruleAdjustment = PricingService.calculateAdjustedPrice(finalPrice, rule) - finalPrice;
        const rulePercentage = (ruleAdjustment / finalPrice) * 100;
        
        if (Math.abs(rulePercentage) > 0.5) {
          finalPrice += ruleAdjustment;
          totalAdjustment += rulePercentage;
          appliedRules.push(rule.rule_name);
          reasoning.push(`Rule: ${rule.rule_name} (${rulePercentage > 0 ? '+' : ''}${rulePercentage.toFixed(1)}%)`);
        }
      }

      // Ensure price stays within reasonable bounds
      const minPrice = context.basePrice * 0.5; // Max 50% discount
      const maxPrice = context.basePrice * 2.0; // Max 100% increase
      finalPrice = Math.max(minPrice, Math.min(maxPrice, finalPrice));

      return {
        finalPrice: Math.round(finalPrice * 100) / 100,
        originalPrice: context.basePrice,
        adjustmentPercentage: Math.round(totalAdjustment * 100) / 100,
        appliedRules,
        confidence: demandAnalysis.confidence,
        reasoning
      };
    } catch (error) {
      console.error('Error in dynamic pricing calculation:', error);
      return {
        finalPrice: context.basePrice,
        originalPrice: context.basePrice,
        adjustmentPercentage: 0,
        appliedRules: [],
        confidence: 0,
        reasoning: ['Error in pricing calculation - using base price']
      };
    }
  }

  // Calculate time-based pricing adjustment
  private static calculateTimeBasedAdjustment(timeToEvent: number): number {
    if (timeToEvent <= 1) return 20; // Day of event premium
    if (timeToEvent <= 3) return 15; // Last 3 days premium
    if (timeToEvent <= 7) return 10; // Week before premium
    if (timeToEvent <= 14) return 5;  // Two weeks before
    if (timeToEvent <= 30) return 0;  // Normal pricing
    if (timeToEvent <= 60) return -10; // Early bird discount
    return -20; // Super early bird
  }

  // Calculate inventory-based pricing adjustment
  private static calculateInventoryAdjustment(current: number, total: number): number {
    const percentage = current / total;
    
    if (percentage <= 0.05) return 25; // Almost sold out
    if (percentage <= 0.1) return 15;  // Very low inventory
    if (percentage <= 0.2) return 8;   // Low inventory
    if (percentage <= 0.5) return 0;   // Normal inventory
    if (percentage >= 0.9) return -5;  // High inventory
    return 0;
  }

  // Calculate competitor-based pricing adjustment
  private static calculateCompetitorAdjustment(currentPrice: number, competitorPrices: number[]): number {
    const avgCompetitorPrice = competitorPrices.reduce((a, b) => a + b) / competitorPrices.length;
    const priceDifference = (currentPrice - avgCompetitorPrice) / avgCompetitorPrice;
    
    // If we're significantly higher than competitors, reduce price
    if (priceDifference > 0.2) return -5;
    // If we're significantly lower, we can increase
    if (priceDifference < -0.2) return 3;
    
    return 0;
  }

  // Get applicable pricing rules from database
  private static async getApplicablePricingRules(context: PricingContext): Promise<PricingRule[]> {
    try {
      let rules: PricingRule[] = [];
      
      if (context.eventId) {
        rules = await PricingService.getEventRules(context.eventId);
      } else if (context.swigCircuitId) {
        rules = await PricingService.getCircuitRules(context.swigCircuitId);
      }
      
      // Filter rules based on current conditions
      return rules.filter(rule => {
        const now = new Date();
        const effectiveFrom = new Date(rule.effective_from);
        const effectiveUntil = rule.effective_until ? new Date(rule.effective_until) : null;
        
        return rule.is_active && 
               now >= effectiveFrom && 
               (!effectiveUntil || now <= effectiveUntil);
      });
    } catch (error) {
      console.error('Error fetching pricing rules:', error);
      return [];
    }
  }

  // Get recommended pricing strategy
  static async getRecommendedStrategy(
    eventId?: string,
    swigCircuitId?: string
  ): Promise<{
    currentStrategy: string;
    recommendations: string[];
    expectedImpact: string;
  }> {
    try {
      const demandAnalysis = await DemandAnalyticsService.calculateDemandScore(eventId, swigCircuitId);
      const recommendations: string[] = [];
      let currentStrategy = 'Standard pricing';
      let expectedImpact = 'Maintain current sales velocity';

      if (demandAnalysis.demandScore > 80) {
        currentStrategy = 'Premium pricing';
        recommendations.push('Increase prices by 10-15% due to high demand');
        recommendations.push('Consider creating VIP tiers');
        expectedImpact = 'Maximize revenue while maintaining sales';
      } else if (demandAnalysis.demandScore < 30) {
        currentStrategy = 'Promotional pricing';
        recommendations.push('Reduce prices by 10-20% to stimulate demand');
        recommendations.push('Create limited-time offers');
        recommendations.push('Bundle with other events or perks');
        expectedImpact = 'Boost sales volume and reach wider audience';
      } else if (demandAnalysis.salesVelocity < 5) {
        recommendations.push('Implement urgency campaigns');
        recommendations.push('Create early bird discounts for future bookings');
        expectedImpact = 'Increase booking momentum';
      }

      return {
        currentStrategy,
        recommendations,
        expectedImpact
      };
    } catch (error) {
      console.error('Error getting pricing strategy:', error);
      return {
        currentStrategy: 'Standard pricing',
        recommendations: ['Monitor demand and adjust accordingly'],
        expectedImpact: 'Maintain steady sales'
      };
    }
  }
}
