
import { supabase } from '@/integrations/supabase/client';

export interface AttendanceForecast {
  eventId: string;
  predictedAttendance: number;
  confidenceLevel: number;
  factors: {
    historicalTrend: number;
    seasonality: number;
    marketingImpact: number;
    competition: number;
  };
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export interface RevenuePrediction {
  eventId: string;
  predictedRevenue: number;
  scenarios: {
    optimistic: number;
    realistic: number;
    pessimistic: number;
  };
  factors: {
    ticketPricing: number;
    attendanceForecast: number;
    marketConditions: number;
    historicalPerformance: number;
  };
}

export interface PricingRecommendation {
  eventId: string;
  recommendedPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  reasoning: {
    demandLevel: 'low' | 'medium' | 'high';
    competitorPricing: number;
    elasticity: number;
    revenueImpact: number;
  };
  strategy: 'penetration' | 'skimming' | 'competitive' | 'value-based';
}

export interface EarlyWarning {
  id: string;
  eventId: string;
  type: 'low_sales' | 'poor_engagement' | 'inventory_risk' | 'competition_threat';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  recommendations: string[];
  triggeredAt: string;
  metrics: {
    currentValue: number;
    threshold: number;
    trend: 'improving' | 'stable' | 'declining';
  };
}

export interface PredictiveModel {
  modelType: 'attendance' | 'revenue' | 'pricing' | 'churn';
  accuracy: number;
  lastTrained: string;
  features: string[];
  performance: {
    mape: number; // Mean Absolute Percentage Error
    rmse: number; // Root Mean Square Error
    r2Score: number; // R-squared
  };
}

// Attendance Forecasting
export async function generateAttendanceForecast(eventId: string): Promise<AttendanceForecast> {
  try {
    // Get historical event data
    const { data: historicalEvents } = await supabase
      .from('events')
      .select(`
        *,
        event_attendees(count),
        event_analytics(*)
      `)
      .eq('created_by', eventId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get current event details
    const { data: currentEvent } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (!currentEvent) {
      throw new Error('Event not found');
    }

    // Calculate factors
    const historicalAvg = calculateHistoricalAverage(historicalEvents || []);
    const seasonalityFactor = calculateSeasonality(currentEvent.date);
    const marketingImpact = await calculateMarketingImpact(eventId);
    const competitionFactor = await calculateCompetitionImpact(currentEvent);

    // Generate prediction using weighted factors
    const basePrediction = historicalAvg;
    const seasonalAdjustment = basePrediction * (seasonalityFactor - 1);
    const marketingBoost = basePrediction * (marketingImpact - 1);
    const competitionAdjustment = basePrediction * (competitionFactor - 1);

    const predictedAttendance = Math.max(0, Math.round(
      basePrediction + seasonalAdjustment + marketingBoost + competitionAdjustment
    ));

    const confidenceLevel = calculateConfidenceLevel(historicalEvents?.length || 0, [
      seasonalityFactor,
      marketingImpact,
      competitionFactor
    ]);

    return {
      eventId,
      predictedAttendance,
      confidenceLevel,
      factors: {
        historicalTrend: historicalAvg,
        seasonality: seasonalityFactor,
        marketingImpact,
        competition: competitionFactor
      },
      dateRange: {
        startDate: currentEvent.date,
        endDate: currentEvent.date
      }
    };
  } catch (error) {
    console.error('Error generating attendance forecast:', error);
    return {
      eventId,
      predictedAttendance: 0,
      confidenceLevel: 0,
      factors: {
        historicalTrend: 0,
        seasonality: 1,
        marketingImpact: 1,
        competition: 1
      },
      dateRange: {
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString()
      }
    };
  }
}

// Revenue Prediction
export async function generateRevenuePrediction(eventId: string): Promise<RevenuePrediction> {
  try {
    const attendanceForecast = await generateAttendanceForecast(eventId);
    
    const { data: ticketTypes } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('event_id', eventId);

    const { data: historicalRevenue } = await supabase
      .from('event_analytics')
      .select('revenue')
      .eq('event_id', eventId)
      .order('date', { ascending: false })
      .limit(30);

    const averageTicketPrice = ticketTypes?.reduce((sum, ticket) => 
      sum + ticket.price, 0) / (ticketTypes?.length || 1) || 0;

    const baseRevenue = attendanceForecast.predictedAttendance * averageTicketPrice;
    
    // Calculate scenarios
    const optimistic = baseRevenue * 1.3; // 30% upside
    const realistic = baseRevenue;
    const pessimistic = baseRevenue * 0.7; // 30% downside

    const marketConditions = calculateMarketConditions();
    const historicalPerformance = calculateHistoricalPerformance(historicalRevenue || []);

    return {
      eventId,
      predictedRevenue: realistic,
      scenarios: {
        optimistic,
        realistic,
        pessimistic
      },
      factors: {
        ticketPricing: averageTicketPrice,
        attendanceForecast: attendanceForecast.predictedAttendance,
        marketConditions,
        historicalPerformance
      }
    };
  } catch (error) {
    console.error('Error generating revenue prediction:', error);
    return {
      eventId,
      predictedRevenue: 0,
      scenarios: { optimistic: 0, realistic: 0, pessimistic: 0 },
      factors: {
        ticketPricing: 0,
        attendanceForecast: 0,
        marketConditions: 1,
        historicalPerformance: 1
      }
    };
  }
}

// Pricing Recommendations
export async function generatePricingRecommendation(eventId: string): Promise<PricingRecommendation> {
  try {
    const revenuePrediction = await generateRevenuePrediction(eventId);
    const attendanceForecast = await generateAttendanceForecast(eventId);
    
    const { data: similarEvents } = await supabase
      .from('events')
      .select(`
        *,
        event_ticket_types(*)
      `)
      .neq('id', eventId)
      .limit(5);

    const competitorAvgPrice = calculateCompetitorAveragePrice(similarEvents || []);
    const demandLevel = assessDemandLevel(attendanceForecast);
    const elasticity = calculatePriceElasticity(eventId);

    let recommendedPrice = competitorAvgPrice;
    let strategy: PricingRecommendation['strategy'] = 'competitive';

    // Adjust based on demand and elasticity
    if (demandLevel === 'high' && elasticity < 0.5) {
      recommendedPrice = competitorAvgPrice * 1.2;
      strategy = 'skimming';
    } else if (demandLevel === 'low') {
      recommendedPrice = competitorAvgPrice * 0.8;
      strategy = 'penetration';
    }

    return {
      eventId,
      recommendedPrice: Math.round(recommendedPrice),
      priceRange: {
        min: Math.round(recommendedPrice * 0.8),
        max: Math.round(recommendedPrice * 1.3)
      },
      reasoning: {
        demandLevel,
        competitorPricing: competitorAvgPrice,
        elasticity,
        revenueImpact: calculateRevenueImpact(recommendedPrice, attendanceForecast.predictedAttendance)
      },
      strategy
    };
  } catch (error) {
    console.error('Error generating pricing recommendation:', error);
    return {
      eventId,
      recommendedPrice: 0,
      priceRange: { min: 0, max: 0 },
      reasoning: {
        demandLevel: 'medium',
        competitorPricing: 0,
        elasticity: 1,
        revenueImpact: 0
      },
      strategy: 'competitive'
    };
  }
}

// Early Warning Systems
export async function generateEarlyWarnings(promoterId: string): Promise<EarlyWarning[]> {
  try {
    const warnings: EarlyWarning[] = [];
    
    // Get promoter's active events
    const { data: events } = await supabase
      .from('events')
      .select(`
        *,
        event_attendees(count),
        event_analytics(*),
        event_ticket_types(*)
      `)
      .eq('created_by', promoterId)
      .eq('status', 'published');

    for (const event of events || []) {
      // Check low sales
      const salesWarning = checkLowSales(event);
      if (salesWarning) warnings.push(salesWarning);

      // Check poor engagement
      const engagementWarning = checkPoorEngagement(event);
      if (engagementWarning) warnings.push(engagementWarning);

      // Check inventory risk
      const inventoryWarning = checkInventoryRisk(event);
      if (inventoryWarning) warnings.push(inventoryWarning);
    }

    return warnings;
  } catch (error) {
    console.error('Error generating early warnings:', error);
    return [];
  }
}

// Helper functions
function calculateHistoricalAverage(events: any[]): number {
  if (events.length === 0) return 50; // Default fallback
  
  const attendanceCounts = events.map(event => 
    event.event_attendees?.length || 0
  );
  
  return attendanceCounts.reduce((sum, count) => sum + count, 0) / attendanceCounts.length;
}

function calculateSeasonality(eventDate: string): number {
  const date = new Date(eventDate);
  const month = date.getMonth();
  
  // Simple seasonality model (can be enhanced with historical data)
  const seasonalityFactors = {
    0: 0.8,  // January
    1: 0.9,  // February
    2: 1.0,  // March
    3: 1.1,  // April
    4: 1.2,  // May
    5: 1.3,  // June
    6: 1.2,  // July
    7: 1.1,  // August
    8: 1.0,  // September
    9: 1.1,  // October
    10: 1.2, // November
    11: 1.3  // December
  };
  
  return seasonalityFactors[month as keyof typeof seasonalityFactors] || 1.0;
}

async function calculateMarketingImpact(eventId: string): Promise<number> {
  const { data: campaigns } = await supabase
    .from('event_marketing_campaigns')
    .select('*')
    .eq('event_id', eventId)
    .eq('status', 'active');

  const campaignCount = campaigns?.length || 0;
  return Math.min(1.5, 1 + (campaignCount * 0.1)); // Cap at 50% boost
}

async function calculateCompetitionImpact(event: any): Promise<number> {
  const eventDate = new Date(event.date);
  const weekBefore = new Date(eventDate.getTime() - (7 * 24 * 60 * 60 * 1000));
  const weekAfter = new Date(eventDate.getTime() + (7 * 24 * 60 * 60 * 1000));

  const { data: competingEvents } = await supabase
    .from('events')
    .select('*')
    .neq('id', event.id)
    .gte('date', weekBefore.toISOString())
    .lte('date', weekAfter.toISOString());

  const competitionLevel = competingEvents?.length || 0;
  return Math.max(0.7, 1 - (competitionLevel * 0.1)); // Max 30% reduction
}

function calculateConfidenceLevel(dataPoints: number, factors: number[]): number {
  const baseConfidence = Math.min(0.9, 0.5 + (dataPoints * 0.05));
  const factorStability = factors.reduce((sum, factor) => {
    return sum + Math.abs(factor - 1);
  }, 0) / factors.length;
  
  return Math.max(0.3, baseConfidence - factorStability);
}

function calculateMarketConditions(): number {
  // Simplified market conditions assessment
  // In a real implementation, this would use economic indicators
  return 1.0;
}

function calculateHistoricalPerformance(revenueData: any[]): number {
  if (revenueData.length === 0) return 1.0;
  
  const avgRevenue = revenueData.reduce((sum, data) => sum + (data.revenue || 0), 0) / revenueData.length;
  return Math.min(2.0, Math.max(0.5, avgRevenue / 1000)); // Normalize to reasonable range
}

function calculateCompetitorAveragePrice(events: any[]): number {
  if (events.length === 0) return 50; // Default price
  
  const prices = events.flatMap(event => 
    event.event_ticket_types?.map((ticket: any) => ticket.price) || []
  );
  
  return prices.reduce((sum, price) => sum + price, 0) / prices.length;
}

function assessDemandLevel(forecast: AttendanceForecast): 'low' | 'medium' | 'high' {
  if (forecast.predictedAttendance < 50) return 'low';
  if (forecast.predictedAttendance < 150) return 'medium';
  return 'high';
}

function calculatePriceElasticity(eventId: string): number {
  // Simplified elasticity calculation
  // In reality, this would analyze historical price/demand relationships
  return 0.8; // Default moderate elasticity
}

function calculateRevenueImpact(price: number, attendance: number): number {
  return price * attendance;
}

function checkLowSales(event: any): EarlyWarning | null {
  const salesTarget = event.capacity * 0.7; // 70% capacity target
  const currentSales = event.event_attendees?.length || 0;
  const daysToEvent = Math.ceil((new Date(event.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  if (daysToEvent <= 7 && currentSales < salesTarget * 0.5) {
    return {
      id: `low_sales_${event.id}`,
      eventId: event.id,
      type: 'low_sales',
      severity: 'high',
      message: `Event "${event.name}" has low ticket sales with only ${currentSales} tickets sold (${Math.round((currentSales/salesTarget)*100)}% of target)`,
      recommendations: [
        'Consider increasing marketing spend',
        'Launch targeted promotional campaigns',
        'Review ticket pricing strategy',
        'Engage with past attendees'
      ],
      triggeredAt: new Date().toISOString(),
      metrics: {
        currentValue: currentSales,
        threshold: salesTarget,
        trend: 'declining'
      }
    };
  }
  
  return null;
}

function checkPoorEngagement(event: any): EarlyWarning | null {
  const analytics = event.event_analytics?.[0];
  if (!analytics) return null;
  
  const engagementRate = analytics.social_shares || 0;
  const threshold = 20; // Minimum expected shares
  
  if (engagementRate < threshold) {
    return {
      id: `poor_engagement_${event.id}`,
      eventId: event.id,
      type: 'poor_engagement',
      severity: 'medium',
      message: `Event "${event.name}" has low social engagement with only ${engagementRate} shares`,
      recommendations: [
        'Create shareable content',
        'Engage with community influencers',
        'Launch social media contests',
        'Improve event description and visuals'
      ],
      triggeredAt: new Date().toISOString(),
      metrics: {
        currentValue: engagementRate,
        threshold,
        trend: 'stable'
      }
    };
  }
  
  return null;
}

function checkInventoryRisk(event: any): EarlyWarning | null {
  const ticketTypes = event.event_ticket_types || [];
  const lowInventoryTypes = ticketTypes.filter((ticket: any) => {
    const sold = event.event_attendees?.filter((a: any) => a.ticket_type_id === ticket.id).length || 0;
    const remaining = ticket.quantity - sold;
    return remaining <= ticket.quantity * 0.1; // Less than 10% remaining
  });
  
  if (lowInventoryTypes.length > 0) {
    return {
      id: `inventory_risk_${event.id}`,
      eventId: event.id,
      type: 'inventory_risk',
      severity: 'medium',
      message: `Event "${event.name}" has low inventory for ${lowInventoryTypes.length} ticket type(s)`,
      recommendations: [
        'Consider adding more ticket tiers',
        'Implement waitlist functionality',
        'Adjust pricing for remaining tickets',
        'Create urgency messaging'
      ],
      triggeredAt: new Date().toISOString(),
      metrics: {
        currentValue: lowInventoryTypes.length,
        threshold: 0,
        trend: 'stable'
      }
    };
  }
  
  return null;
}

export async function getModelPerformance(): Promise<PredictiveModel[]> {
  // Return mock model performance data
  // In a real implementation, this would fetch actual model metrics
  return [
    {
      modelType: 'attendance',
      accuracy: 0.85,
      lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      features: ['historical_attendance', 'seasonality', 'marketing_budget', 'competition'],
      performance: {
        mape: 12.5,
        rmse: 15.2,
        r2Score: 0.78
      }
    },
    {
      modelType: 'revenue',
      accuracy: 0.82,
      lastTrained: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      features: ['attendance_forecast', 'ticket_pricing', 'market_conditions', 'historical_revenue'],
      performance: {
        mape: 15.3,
        rmse: 250.8,
        r2Score: 0.75
      }
    },
    {
      modelType: 'pricing',
      accuracy: 0.79,
      lastTrained: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      features: ['demand_level', 'competitor_pricing', 'elasticity', 'market_segment'],
      performance: {
        mape: 18.7,
        rmse: 8.5,
        r2Score: 0.72
      }
    }
  ];
}
