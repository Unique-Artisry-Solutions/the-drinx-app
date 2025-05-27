
import { supabase } from '@/integrations/supabase/client';
import { DemandMetrics } from '@/types/promotional/PricingTypes';

export interface DemandAnalysisResult {
  demandScore: number;
  salesVelocity: number;
  popularityRank: number;
  recommendedPriceAdjustment: number;
  confidence: number;
}

export interface RealTimeMetrics {
  pageViews: number;
  uniqueVisitors: number;
  cartAdditions: number;
  cartAbandonments: number;
  salesInLast24h: number;
  timeToEvent: number;
}

export class DemandAnalyticsService {
  // Calculate demand score based on multiple factors
  static async calculateDemandScore(
    eventId?: string,
    swigCircuitId?: string
  ): Promise<DemandAnalysisResult> {
    try {
      const metrics = await this.getRealTimeMetrics(eventId, swigCircuitId);
      const historicalData = await this.getHistoricalDemand(eventId, swigCircuitId);
      
      // Weighted demand scoring algorithm
      const viewsScore = Math.min((metrics.pageViews / 1000) * 20, 100);
      const conversionScore = metrics.cartAdditions > 0 
        ? (metrics.cartAdditions / metrics.pageViews) * 100 
        : 0;
      const abandonmentPenalty = metrics.cartAbandonments > 0 
        ? (metrics.cartAbandonments / metrics.cartAdditions) * -20 
        : 0;
      const velocityScore = this.calculateVelocityScore(metrics.salesInLast24h, metrics.timeToEvent);
      
      const demandScore = Math.max(0, Math.min(100, 
        (viewsScore * 0.3) + 
        (conversionScore * 0.4) + 
        (velocityScore * 0.3) + 
        abandonmentPenalty
      ));

      const recommendedAdjustment = this.calculatePriceAdjustment(demandScore, metrics.timeToEvent);
      
      return {
        demandScore,
        salesVelocity: metrics.salesInLast24h,
        popularityRank: await this.calculatePopularityRank(eventId, swigCircuitId),
        recommendedPriceAdjustment: recommendedAdjustment,
        confidence: this.calculateConfidence(metrics, historicalData)
      };
    } catch (error) {
      console.error('Error calculating demand score:', error);
      return {
        demandScore: 50,
        salesVelocity: 0,
        popularityRank: 50,
        recommendedPriceAdjustment: 0,
        confidence: 0
      };
    }
  }

  // Get real-time metrics for demand analysis
  static async getRealTimeMetrics(
    eventId?: string,
    swigCircuitId?: string
  ): Promise<RealTimeMetrics> {
    const today = new Date().toISOString().split('T')[0];
    
    // Get metrics from demand_metrics table
    const { data: metrics, error } = await supabase
      .from('demand_metrics')
      .select('*')
      .eq('metric_date', today)
      .eq(eventId ? 'event_id' : 'swig_circuit_id', eventId || swigCircuitId)
      .single();

    if (error || !metrics) {
      return {
        pageViews: 0,
        uniqueVisitors: 0,
        cartAdditions: 0,
        cartAbandonments: 0,
        salesInLast24h: 0,
        timeToEvent: 30 // Default to 30 days
      };
    }

    // Get event/circuit date to calculate time to event
    let eventDate: Date;
    if (eventId) {
      const { data: event } = await supabase
        .from('events')
        .select('date')
        .eq('id', eventId)
        .single();
      eventDate = new Date(event?.date || Date.now());
    } else {
      const { data: circuit } = await supabase
        .from('swig_circuits')
        .select('start_date')
        .eq('id', swigCircuitId)
        .single();
      eventDate = new Date(circuit?.start_date || Date.now());
    }

    const timeToEvent = Math.max(0, Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

    return {
      pageViews: metrics.page_views,
      uniqueVisitors: metrics.unique_visitors,
      cartAdditions: metrics.cart_additions,
      cartAbandonments: metrics.cart_abandonments,
      salesInLast24h: metrics.sales_velocity,
      timeToEvent
    };
  }

  // Calculate sales velocity score
  private static calculateVelocityScore(salesLast24h: number, timeToEvent: number): number {
    if (timeToEvent <= 0) return 0;
    
    const dailyTarget = this.getExpectedDailySales(timeToEvent);
    const velocityRatio = salesLast24h / Math.max(dailyTarget, 1);
    
    return Math.min(100, velocityRatio * 50);
  }

  // Get expected daily sales based on time to event
  private static getExpectedDailySales(timeToEvent: number): number {
    if (timeToEvent <= 7) return 20; // High urgency period
    if (timeToEvent <= 30) return 10; // Normal period
    return 5; // Early bird period
  }

  // Calculate popularity rank compared to similar events
  static async calculatePopularityRank(
    eventId?: string,
    swigCircuitId?: string
  ): Promise<number> {
    try {
      const { data: allMetrics, error } = await supabase
        .from('demand_metrics')
        .select('demand_score')
        .order('demand_score', { ascending: false });

      if (error || !allMetrics) return 50;

      const currentScore = await this.getCurrentDemandScore(eventId, swigCircuitId);
      const betterScores = allMetrics.filter(m => m.demand_score > currentScore).length;
      
      return Math.round((1 - (betterScores / allMetrics.length)) * 100);
    } catch (error) {
      console.error('Error calculating popularity rank:', error);
      return 50;
    }
  }

  // Get current demand score from database
  private static async getCurrentDemandScore(
    eventId?: string,
    swigCircuitId?: string
  ): Promise<number> {
    const { data, error } = await supabase
      .from('demand_metrics')
      .select('demand_score')
      .eq(eventId ? 'event_id' : 'swig_circuit_id', eventId || swigCircuitId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return error || !data ? 50 : data.demand_score;
  }

  // Calculate recommended price adjustment percentage
  private static calculatePriceAdjustment(demandScore: number, timeToEvent: number): number {
    let baseAdjustment = 0;

    // Demand-based adjustment
    if (demandScore >= 80) baseAdjustment += 15;
    else if (demandScore >= 60) baseAdjustment += 8;
    else if (demandScore >= 40) baseAdjustment += 0;
    else if (demandScore >= 20) baseAdjustment -= 5;
    else baseAdjustment -= 10;

    // Time-based adjustment
    if (timeToEvent <= 3) baseAdjustment += 10; // Last minute premium
    else if (timeToEvent <= 7) baseAdjustment += 5; // Week before
    else if (timeToEvent >= 60) baseAdjustment -= 15; // Early bird discount

    return Math.max(-25, Math.min(30, baseAdjustment));
  }

  // Calculate confidence in the recommendation
  private static calculateConfidence(
    metrics: RealTimeMetrics,
    historicalData: any[]
  ): number {
    let confidence = 50;

    // More data points increase confidence
    if (metrics.pageViews > 100) confidence += 10;
    if (metrics.uniqueVisitors > 50) confidence += 10;
    if (historicalData.length > 5) confidence += 15;
    if (metrics.cartAdditions > 0) confidence += 15;

    return Math.min(100, confidence);
  }

  // Get historical demand patterns
  private static async getHistoricalDemand(
    eventId?: string,
    swigCircuitId?: string
  ): Promise<DemandMetrics[]> {
    const { data, error } = await supabase
      .from('demand_metrics')
      .select('*')
      .eq(eventId ? 'event_id' : 'swig_circuit_id', eventId || swigCircuitId)
      .order('metric_date', { ascending: false })
      .limit(30);

    return error ? [] : data;
  }

  // Update demand metrics in real-time
  static async updateDemandMetrics(
    eventId: string | undefined,
    swigCircuitId: string | undefined,
    metrics: Partial<RealTimeMetrics>
  ): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('demand_metrics')
        .upsert({
          event_id: eventId,
          swig_circuit_id: swigCircuitId,
          metric_date: today,
          page_views: metrics.pageViews || 0,
          unique_visitors: metrics.uniqueVisitors || 0,
          cart_additions: metrics.cartAdditions || 0,
          cart_abandonments: metrics.cartAbandonments || 0,
          sales_velocity: metrics.salesInLast24h || 0,
          demand_score: (await this.calculateDemandScore(eventId, swigCircuitId)).demandScore
        });

      if (error) {
        console.error('Error updating demand metrics:', error);
      }
    } catch (error) {
      console.error('Error in updateDemandMetrics:', error);
    }
  }
}
