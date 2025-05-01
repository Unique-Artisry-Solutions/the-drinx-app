
import { supabase } from '@/lib/supabase';
import { AnalyticsDateRange } from '@/services/establishmentAnalyticsService';

export interface PromoterAnalytics {
  id: string;
  date: string;
  total_events: number;
  active_campaigns: number;
  subscriber_count: number;
  engagement_rate: number;
  revenue: number;
}

export interface EventPerformance {
  id: string;
  name: string;
  date: string;
  attendees: number;
  ticket_sales: number;
  revenue: number;
  venue_name: string;
}

export interface CampaignPerformance {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  reach: number;
  engagement: number;
  conversion_rate: number;
  status: string;
}

export interface AudienceMetric {
  metric_name: string;
  metric_value: number;
  timestamp: string;
  segment: string;
}

export interface TrendDataPoint {
  date: string;
  metric_value: number;
  metric_name: string;
}

// Cache for mock data to ensure consistency between renders
const mockDataCache: Record<string, {
  promoterAnalytics: PromoterAnalytics[];
  eventPerformance: EventPerformance[];
  campaignPerformance: CampaignPerformance[];
  audienceMetrics: AudienceMetric[];
  trends: TrendDataPoint[];
}> = {};

// Stable random function using seed to generate consistent mock data
function seededRandom(seed: string, index: number): number {
  const seedValue = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const combinedSeed = seedValue + index * 137;
  const x = Math.sin(combinedSeed) * 10000;
  return x - Math.floor(x);
}

// Create mock data for development
const createMockData = (promoterId: string) => {
  // Check if we already have cached mock data for this promoter
  if (mockDataCache[promoterId]) {
    return mockDataCache[promoterId];
  }

  // Mock promoter analytics data
  const promoterAnalytics: PromoterAnalytics[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 30 + i);
    
    // Use seeded random to create stable but random-looking data
    const rand = seededRandom(promoterId, i);
    
    return {
      id: `pa-${promoterId}-${i}`,
      date: date.toISOString().split('T')[0],
      total_events: Math.floor(rand * 3) + 1,
      active_campaigns: Math.floor(rand * 2) + 1,
      subscriber_count: Math.floor(rand * 25) + 50 + i,
      engagement_rate: Math.round((rand * 30 + 10) * 100) / 100, // 10-40%
      revenue: Math.round(rand * 500) + 200
    };
  });

  // Event names for consistency
  const eventNames = [
    'Mocktail Masterclass',
    'Sober Social Mixer',
    'Zero-Proof Tasting',
    'Craft Mocktail Party',
    'Alcohol-Free Brunch'
  ];

  // Venue names for consistency
  const venueNames = [
    'The Sober Spot',
    'Abstinence Lounge',
    'Clear Mind Bar',
    'Zero Proof Club',
    'Mindful Mixers'
  ];

  // Mock event performance
  const eventPerformance: EventPerformance[] = Array.from({ length: 5 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(seededRandom(promoterId, i + 100) * 14) - 1);
    
    const rand = seededRandom(promoterId, i + 200);
    const attendees = Math.floor(rand * 50) + 20;
    const ticketPrice = Math.floor(rand * 15) + 10;
    
    return {
      id: `ep-${promoterId}-${i}`,
      name: eventNames[i % eventNames.length],
      date: date.toISOString().split('T')[0],
      attendees,
      ticket_sales: Math.floor(attendees * (0.8 + rand * 0.2)),
      revenue: Math.floor(attendees * ticketPrice * (0.8 + rand * 0.2)),
      venue_name: venueNames[i % venueNames.length]
    };
  });

  // Campaign names for consistency
  const campaignNames = [
    'Summer Sobriety',
    'Weekend Wellness',
    'Mindful Monday',
    'Thirsty Thursday Alternative',
    'Friday Night Clarity'
  ];

  // Mock campaign performance
  const campaignPerformance: CampaignPerformance[] = Array.from({ length: 3 }, (_, i) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Math.floor(seededRandom(promoterId, i + 300) * 30) - 10);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.floor(seededRandom(promoterId, i + 400) * 14) + 7);
    
    const rand = seededRandom(promoterId, i + 500);
    const reach = Math.floor(rand * 500) + 100;
    const engagement = Math.floor(reach * (0.1 + rand * 0.3));
    
    const statuses = ['active', 'completed', 'scheduled'];
    
    return {
      id: `cp-${promoterId}-${i}`,
      name: campaignNames[i % campaignNames.length],
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      reach,
      engagement,
      conversion_rate: Math.round((engagement / reach) * 1000) / 10,
      status: statuses[i % statuses.length]
    };
  });

  // Mock audience metrics
  const segments = ['age_18_24', 'age_25_34', 'age_35_44', 'age_45_plus'];
  const metricTypes = ['gender', 'location', 'interests'];
  
  const audienceMetrics: AudienceMetric[] = [];
  
  segments.forEach((segment, i) => {
    metricTypes.forEach((metricName, j) => {
      const rand = seededRandom(promoterId, i * 10 + j + 600);
      
      audienceMetrics.push({
        metric_name: metricName,
        metric_value: Math.round(rand * 100),
        timestamp: new Date().toISOString(),
        segment
      });
    });
  });

  // Mock trend data
  const trends: TrendDataPoint[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 30 + i);
    
    const rand = seededRandom(promoterId, i + 700);
    
    return {
      date: date.toISOString().split('T')[0],
      metric_value: Math.floor(rand * 50) + i/2,
      metric_name: 'subscriber_growth'
    };
  });

  // Cache the generated data
  const mockData = {
    promoterAnalytics,
    eventPerformance,
    campaignPerformance,
    audienceMetrics,
    trends
  };
  
  mockDataCache[promoterId] = mockData;
  return mockData;
};

/**
 * Fetches general promoter analytics
 */
export async function fetchPromoterAnalytics(
  promoterId: string, 
  range: AnalyticsDateRange
): Promise<PromoterAnalytics[]> {
  try {
    // For now, use mock data
    // In production, this would query the database for real analytics data
    const { promoterAnalytics } = createMockData(promoterId);
    
    return promoterAnalytics.filter(data => {
      const dataDate = new Date(data.date);
      return dataDate >= range.startDate && dataDate <= range.endDate;
    });
  } catch (error) {
    console.error('Error fetching promoter analytics:', error);
    return [];
  }
}

/**
 * Fetches event performance metrics
 */
export async function fetchEventPerformance(
  promoterId: string
): Promise<EventPerformance[]> {
  try {
    // For now, use mock data
    const { eventPerformance } = createMockData(promoterId);
    return eventPerformance;
  } catch (error) {
    console.error('Error fetching event performance:', error);
    return [];
  }
}

/**
 * Fetches campaign performance metrics
 */
export async function fetchCampaignPerformance(
  promoterId: string
): Promise<CampaignPerformance[]> {
  try {
    // For now, use mock data
    const { campaignPerformance } = createMockData(promoterId);
    return campaignPerformance;
  } catch (error) {
    console.error('Error fetching campaign performance:', error);
    return [];
  }
}

/**
 * Fetches audience metrics
 */
export async function fetchAudienceMetrics(
  promoterId: string
): Promise<AudienceMetric[]> {
  try {
    // For now, use mock data
    const { audienceMetrics } = createMockData(promoterId);
    return audienceMetrics;
  } catch (error) {
    console.error('Error fetching audience metrics:', error);
    return [];
  }
}

/**
 * Fetches trend data for specific metrics
 */
export async function fetchTrendData(
  promoterId: string,
  metricName: string,
  range: AnalyticsDateRange
): Promise<TrendDataPoint[]> {
  try {
    // For now, use mock data
    const { trends } = createMockData(promoterId);
    
    return trends
      .filter(t => t.metric_name === metricName)
      .filter(data => {
        const dataDate = new Date(data.date);
        return dataDate >= range.startDate && dataDate <= range.endDate;
      });
  } catch (error) {
    console.error('Error fetching trend data:', error);
    return [];
  }
}
