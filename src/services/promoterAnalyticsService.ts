
import { 
  PromoterAnalytics, 
  EventPerformance, 
  CampaignPerformance,
  AudienceMetric,
  TrendDataPoint,
  AnalyticsDateRange,
  EventDetailedAnalytics
} from '@/hooks/promoter/types';
import { isPreviewEnvironment } from '@/utils/environment';

const MOCK_DELAY = 500;

/**
 * Fetch basic analytics data for a promoter
 */
export async function fetchPromoterAnalytics(
  promoterId: string, 
  dateRange: AnalyticsDateRange
): Promise<PromoterAnalytics[]> {
  if (isPreviewEnvironment()) {
    // Return mock data for preview
    await delay(MOCK_DELAY);
    return generateMockAnalytics(dateRange);
  }
  
  try {
    // Here would be the real API call
    // Example: const { data } = await supabaseClient.from('promoter_analytics')...
    
    // For now returning mock data
    return generateMockAnalytics(dateRange);
  } catch (error) {
    console.error('Error fetching promoter analytics:', error);
    throw error;
  }
}

/**
 * Fetch event performance data
 */
export async function fetchEventPerformance(promoterId: string): Promise<EventPerformance[]> {
  if (isPreviewEnvironment()) {
    await delay(MOCK_DELAY);
    return generateMockEvents();
  }
  
  try {
    // Real API call would go here
    return generateMockEvents();
  } catch (error) {
    console.error('Error fetching event performance:', error);
    throw error;
  }
}

/**
 * Fetch detailed analytics for a specific event
 */
export async function fetchEventDetailedAnalytics(
  promoterId: string, 
  eventId: string
): Promise<EventDetailedAnalytics[]> {
  if (isPreviewEnvironment()) {
    await delay(MOCK_DELAY);
    return generateMockEventDetails(eventId);
  }
  
  try {
    // Real API call would go here
    return generateMockEventDetails(eventId);
  } catch (error) {
    console.error('Error fetching event detailed analytics:', error);
    throw error;
  }
}

/**
 * Fetch campaign performance data
 */
export async function fetchCampaignPerformance(promoterId: string): Promise<CampaignPerformance[]> {
  if (isPreviewEnvironment()) {
    await delay(MOCK_DELAY);
    return generateMockCampaigns();
  }
  
  try {
    // Real API call would go here
    return generateMockCampaigns();
  } catch (error) {
    console.error('Error fetching campaign performance:', error);
    throw error;
  }
}

/**
 * Fetch audience metrics data
 */
export async function fetchAudienceMetrics(promoterId: string): Promise<AudienceMetric[]> {
  if (isPreviewEnvironment()) {
    await delay(MOCK_DELAY);
    return generateMockAudienceMetrics();
  }
  
  try {
    // Real API call would go here
    return generateMockAudienceMetrics();
  } catch (error) {
    console.error('Error fetching audience metrics:', error);
    throw error;
  }
}

/**
 * Fetch trend data for a specific metric
 */
export async function fetchTrendData(
  promoterId: string, 
  trendType: string, 
  dateRange: AnalyticsDateRange
): Promise<TrendDataPoint[]> {
  if (isPreviewEnvironment()) {
    await delay(MOCK_DELAY);
    return generateMockTrendData(trendType, dateRange);
  }
  
  try {
    // Real API call would go here
    return generateMockTrendData(trendType, dateRange);
  } catch (error) {
    console.error(`Error fetching ${trendType} trend:`, error);
    throw error;
  }
}

// Helper to create a delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Mock data generators
function generateMockAnalytics(dateRange: AnalyticsDateRange): PromoterAnalytics[] {
  const { startDate, endDate } = dateRange;
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const result: PromoterAnalytics[] = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    result.push({
      date: date.toISOString().split('T')[0],
      total_views: Math.floor(Math.random() * 500) + 100,
      unique_visitors: Math.floor(Math.random() * 200) + 50,
      engagement_rate: parseFloat((Math.random() * 10 + 5).toFixed(1)),
      conversion_rate: parseFloat((Math.random() * 5 + 1).toFixed(1))
    });
  }
  
  return result;
}

function generateMockEvents(): EventPerformance[] {
  return [
    {
      id: '1',
      name: 'Summer Music Festival',
      date: '2025-06-15',
      venue_name: 'Central Park',
      attendees: 1200,
      revenue: 24000
    },
    {
      id: '2',
      name: 'Jazz Night',
      date: '2025-05-10',
      venue_name: 'Blue Note Club',
      attendees: 150,
      revenue: 3000
    },
    {
      id: '3',
      name: 'Electronic Dance Party',
      date: '2025-04-30',
      venue_name: 'Warehouse 21',
      attendees: 450,
      revenue: 9000
    }
  ];
}

function generateMockEventDetails(eventId: string): EventDetailedAnalytics[] {
  return [
    {
      id: `${eventId}-1`,
      event_id: eventId,
      metric_name: 'ticket_sales',
      metric_value: 450,
      date: '2025-04-30'
    },
    {
      id: `${eventId}-2`,
      event_id: eventId,
      metric_name: 'engagement',
      metric_value: 78,
      date: '2025-04-30'
    },
    {
      id: `${eventId}-3`,
      event_id: eventId,
      metric_name: 'satisfaction',
      metric_value: 92,
      date: '2025-04-30'
    }
  ];
}

function generateMockCampaigns(): CampaignPerformance[] {
  return [
    {
      id: '1',
      name: 'Summer Festival Promo',
      status: 'active',
      reach: 15000,
      engagement: 3200,
      conversion_rate: 8.5,
      start_date: '2025-04-01',
      end_date: '2025-05-15'
    },
    {
      id: '2',
      name: 'Early Bird Tickets',
      status: 'completed',
      reach: 8000,
      engagement: 1800,
      conversion_rate: 12.3,
      start_date: '2025-03-10',
      end_date: '2025-03-31'
    },
    {
      id: '3',
      name: 'VIP Experience',
      status: 'planned',
      reach: 5000,
      engagement: 0,
      conversion_rate: 0,
      start_date: '2025-05-20',
      end_date: '2025-06-10'
    }
  ];
}

function generateMockAudienceMetrics(): AudienceMetric[] {
  return [
    { id: '1', metric_name: 'age_group', metric_value: 35, segment: '18-24' },
    { id: '2', metric_name: 'age_group', metric_value: 25, segment: '25-34' },
    { id: '3', metric_name: 'age_group', metric_value: 20, segment: '35-44' },
    { id: '4', metric_name: 'age_group', metric_value: 20, segment: '45+' },
    { id: '5', metric_name: 'location', metric_value: 45, segment: 'urban' },
    { id: '6', metric_name: 'location', metric_value: 30, segment: 'suburban' },
    { id: '7', metric_name: 'location', metric_value: 25, segment: 'rural' },
    { id: '8', metric_name: 'interests', metric_value: 65, segment: 'music' },
    { id: '9', metric_name: 'interests', metric_value: 45, segment: 'arts' },
    { id: '10', metric_name: 'interests', metric_value: 40, segment: 'nightlife' }
  ];
}

function generateMockTrendData(trendType: string, dateRange: AnalyticsDateRange): TrendDataPoint[] {
  const { startDate, endDate } = dateRange;
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const result: TrendDataPoint[] = [];
  
  // Generate data points for every third day to make the chart less crowded
  for (let i = 0; i < days; i += 3) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    let baseValue;
    let volatility;
    
    if (trendType === 'subscriber_growth') {
      baseValue = 100;
      volatility = 25;
    } else if (trendType === 'engagement_rate') {
      baseValue = 7;
      volatility = 3;
    } else {
      baseValue = 50;
      volatility = 10;
    }
    
    // Create some randomness but with an overall upward trend
    const trendBoost = i / days * 10; // Gradual upward trend factor
    const value = baseValue + trendBoost + (Math.random() * volatility - volatility / 2);
    
    result.push({
      id: `${trendType}-${i}`,
      date: date.toISOString().split('T')[0],
      metric_value: parseFloat(value.toFixed(1))
    });
  }
  
  return result;
}

export {
  type PromoterAnalytics,
  type EventPerformance,
  type CampaignPerformance,
  type AudienceMetric,
  type TrendDataPoint,
  type EventDetailedAnalytics
};
