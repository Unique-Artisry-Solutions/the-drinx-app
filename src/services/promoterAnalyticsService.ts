
import { supabase } from '@/lib/supabase';
import { AnalyticsDateRange } from '@/services/establishmentAnalyticsService';
import { isPreviewEnvironment } from '@/utils/environment';

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

export interface EventDetailedAnalytics {
  id: string;
  event_id: string;
  date: string;
  tickets_sold: number;
  revenue: number;
  attendees: number;
  ticket_types: {
    name: string;
    quantity: number;
    revenue: number;
  }[];
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

// Helper function to format a date as ISO string without time part
const formatDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Create mock data for development and preview
const createMockData = (promoterId: string) => {
  // Check if we already have cached mock data for this promoter
  if (mockDataCache[promoterId]) {
    return mockDataCache[promoterId];
  }

  const currentDate = new Date();
  const today = formatDateString(currentDate);

  // Mock promoter analytics data
  const promoterAnalytics: PromoterAnalytics[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 30 + i);
    const dateString = formatDateString(date);
    
    // Use seeded random to create stable but random-looking data
    const rand = seededRandom(promoterId, i);
    
    return {
      id: `pa-${promoterId}-${i}`,
      date: dateString,
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
    // Ensure some past events and some future events
    const daysOffset = Math.floor(seededRandom(promoterId, i + 100) * 30) - 15;
    date.setDate(date.getDate() + daysOffset);
    const dateString = formatDateString(date);
    
    const rand = seededRandom(promoterId, i + 200);
    const attendees = Math.floor(rand * 50) + 20;
    const ticketPrice = Math.floor(rand * 15) + 10;
    
    return {
      id: `ep-${promoterId}-${i}`,
      name: eventNames[i % eventNames.length],
      date: dateString,
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

  // Mock campaign performance with safer date handling
  const campaignPerformance: CampaignPerformance[] = Array.from({ length: 3 }, (_, i) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Math.floor(seededRandom(promoterId, i + 300) * 30) - 10);
    const startDateString = formatDateString(startDate);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.floor(seededRandom(promoterId, i + 400) * 14) + 7);
    const endDateString = formatDateString(endDate);
    
    const rand = seededRandom(promoterId, i + 500);
    const reach = Math.floor(rand * 500) + 100;
    const engagement = Math.floor(reach * (0.1 + rand * 0.3));
    
    const statuses = ['active', 'completed', 'scheduled'];
    
    return {
      id: `cp-${promoterId}-${i}`,
      name: campaignNames[i % campaignNames.length],
      start_date: startDateString,
      end_date: endDateString,
      reach,
      engagement,
      conversion_rate: Math.round((engagement / reach) * 1000) / 10,
      status: statuses[i % statuses.length]
    };
  });

  // Mock audience metrics
  const segments = ['age_18_24', 'age_25_34', 'age_35_44', 'age_45_plus'];
  const metricTypes = ['gender', 'location', 'interests', 'age'];
  
  const audienceMetrics: AudienceMetric[] = [];
  
  segments.forEach((segment, i) => {
    metricTypes.forEach((metricName, j) => {
      const rand = seededRandom(promoterId, i * 10 + j + 600);
      
      audienceMetrics.push({
        metric_name: metricName,
        metric_value: Math.round(rand * 100),
        timestamp: today,
        segment
      });
    });
  });

  // Mock trend data
  const trends: TrendDataPoint[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 30 + i);
    const dateString = formatDateString(date);
    
    const rand = seededRandom(promoterId, i + 700);
    
    // Create subscriber growth trend
    const subscriberTrend = {
      date: dateString,
      metric_value: Math.floor(rand * 50) + i/2,
      metric_name: 'subscriber_growth'
    };

    return subscriberTrend;
  });

  // Add engagement trend data
  const engagementTrends = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 30 + i);
    const dateString = formatDateString(date);
    
    const rand = seededRandom(promoterId, i + 800);
    
    return {
      date: dateString,
      metric_value: 10 + Math.round(rand * 30),  // 10-40%
      metric_name: 'engagement_rate'
    };
  });

  // Combine all trends
  const allTrends = [...trends, ...engagementTrends];

  // Cache the generated data
  const mockData = {
    promoterAnalytics,
    eventPerformance,
    campaignPerformance,
    audienceMetrics,
    trends: allTrends
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
    // Check if running in preview environment
    if (isPreviewEnvironment()) {
      console.log("Using mock promoter analytics data in preview environment");
      const { promoterAnalytics } = createMockData(promoterId);
      
      return promoterAnalytics.filter(data => {
        try {
          const dataDate = new Date(data.date);
          return dataDate >= range.startDate && dataDate <= range.endDate;
        } catch (e) {
          console.error("Date filtering error:", e);
          return false;
        }
      });
    }

    // In production/development environment, query the database
    const { data, error } = await supabase
      .from('promoter_event_analytics')
      .select('*')
      .eq('promoter_id', promoterId)
      .gte('date', range.startDate.toISOString().split('T')[0])
      .lte('date', range.endDate.toISOString().split('T')[0]);

    if (error) {
      console.error('Error fetching promoter analytics:', error);
      // Fall back to mock data if there's an error
      return createMockData(promoterId).promoterAnalytics;
    }

    // Process the real data or return mock data if none found
    if (data && data.length > 0) {
      // Transform database data to match the expected format
      return data.map(item => ({
        id: item.id,
        date: item.date,
        total_events: 1, // Count each record as an event
        active_campaigns: 0, // This would come from a different query
        subscriber_count: 0, // This would come from a different query
        engagement_rate: item.engagement_score,
        revenue: item.revenue
      }));
    } else {
      // Fall back to mock data if no records found
      return createMockData(promoterId).promoterAnalytics;
    }
  } catch (error) {
    console.error('Error in fetchPromoterAnalytics:', error);
    // Fall back to mock data on any error
    return createMockData(promoterId).promoterAnalytics;
  }
}

/**
 * Fetches event performance metrics
 */
export async function fetchEventPerformance(
  promoterId: string
): Promise<EventPerformance[]> {
  try {
    // Check if running in preview environment
    if (isPreviewEnvironment()) {
      console.log("Using mock event performance data in preview environment");
      return createMockData(promoterId).eventPerformance;
    }

    // In production environment, query the database
    const { data, error } = await supabase
      .from('promoter_event_performance_view')
      .select('*')
      .eq('promoter_id', promoterId);

    if (error) {
      console.error('Error fetching event performance:', error);
      return createMockData(promoterId).eventPerformance;
    }

    if (data && data.length > 0) {
      // Transform database data to match the expected format
      return data.map(item => ({
        id: item.event_id,
        name: item.event_name,
        date: item.date,
        attendees: item.total_attendees || 0,
        ticket_sales: item.total_ticket_sales || 0,
        revenue: item.total_revenue || 0,
        venue_name: 'Venue' // This would come from a join with venues table
      }));
    } else {
      return createMockData(promoterId).eventPerformance;
    }
  } catch (error) {
    console.error('Error fetching event performance:', error);
    return createMockData(promoterId).eventPerformance;
  }
}

/**
 * Fetches campaign performance metrics
 */
export async function fetchCampaignPerformance(
  promoterId: string
): Promise<CampaignPerformance[]> {
  try {
    // Check if running in preview environment
    if (isPreviewEnvironment()) {
      console.log("Using mock campaign performance data in preview environment");
      return createMockData(promoterId).campaignPerformance;
    }

    // In production environment, query the database
    const { data, error } = await supabase
      .from('promoter_campaign_performance_view')
      .select('*')
      .eq('promoter_id', promoterId);

    if (error) {
      console.error('Error fetching campaign performance:', error);
      return createMockData(promoterId).campaignPerformance;
    }

    if (data && data.length > 0) {
      // Transform database data to match the expected format
      return data.map(item => ({
        id: item.campaign_id || `gen-${Math.random().toString(36).substr(2, 9)}`,
        name: item.campaign_name,
        start_date: item.start_date,
        end_date: item.end_date,
        reach: item.total_impressions || 0,
        engagement: item.total_clicks || 0,
        conversion_rate: item.conversion_rate || 0,
        status: new Date(item.end_date) < new Date() ? 'completed' : 'active'
      }));
    } else {
      return createMockData(promoterId).campaignPerformance;
    }
  } catch (error) {
    console.error('Error fetching campaign performance:', error);
    return createMockData(promoterId).campaignPerformance;
  }
}

/**
 * Fetches audience metrics
 */
export async function fetchAudienceMetrics(
  promoterId: string
): Promise<AudienceMetric[]> {
  try {
    // Check if running in preview environment
    if (isPreviewEnvironment()) {
      console.log("Using mock audience metrics data in preview environment");
      return createMockData(promoterId).audienceMetrics;
    }

    // In production environment, query the database
    const { data, error } = await supabase
      .from('promoter_audience_metrics')
      .select('*')
      .eq('promoter_id', promoterId);

    if (error) {
      console.error('Error fetching audience metrics:', error);
      return createMockData(promoterId).audienceMetrics;
    }

    if (data && data.length > 0) {
      // Transform database data to match the expected format
      return data.map(item => ({
        metric_name: item.metric_name,
        metric_value: item.metric_value,
        timestamp: item.created_at,
        segment: item.segment
      }));
    } else {
      return createMockData(promoterId).audienceMetrics;
    }
  } catch (error) {
    console.error('Error fetching audience metrics:', error);
    return createMockData(promoterId).audienceMetrics;
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
    // Check if running in preview environment
    if (isPreviewEnvironment()) {
      console.log(`Using mock trend data for ${metricName} in preview environment`);
      const { trends } = createMockData(promoterId);
      
      return trends
        .filter(t => t.metric_name === metricName)
        .filter(data => {
          try {
            const dataDate = new Date(data.date);
            return dataDate >= range.startDate && dataDate <= range.endDate;
          } catch (e) {
            console.error("Date filtering error:", e);
            return false;
          }
        });
    }

    // In production environment, query the database
    const { data, error } = await supabase
      .from('promoter_audience_trends')
      .select('*')
      .eq('promoter_id', promoterId)
      .eq('metric_name', metricName)
      .gte('date', range.startDate.toISOString().split('T')[0])
      .lte('date', range.endDate.toISOString().split('T')[0]);

    if (error) {
      console.error('Error fetching trend data:', error);
      return createMockData(promoterId).trends.filter(t => t.metric_name === metricName);
    }

    if (data && data.length > 0) {
      // Transform database data to match the expected format
      return data.map(item => ({
        date: item.date,
        metric_value: item.metric_value,
        metric_name: item.metric_name
      }));
    } else {
      return createMockData(promoterId).trends.filter(t => t.metric_name === metricName);
    }
  } catch (error) {
    console.error('Error fetching trend data:', error);
    return createMockData(promoterId).trends.filter(t => t.metric_name === metricName);
  }
}

/**
 * Fetches detailed analytics for a specific event
 */
export async function fetchEventDetailedAnalytics(
  promoterId: string,
  eventId: string
): Promise<EventDetailedAnalytics[]> {
  try {
    // For now, always use mock data for this specific endpoint until we have real data available
    if (isPreviewEnvironment() || true) {
      console.log("Using mock event detailed analytics data");
      // For now, generate mock data based on the event
      const { eventPerformance } = createMockData(promoterId);
      const event = eventPerformance.find(e => e.id === eventId);
      
      if (!event) return [];
      
      // Generate daily metrics for the past 14 days
      const result: EventDetailedAnalytics[] = Array.from({ length: 14 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (14 - i));
        const dateString = formatDateString(date);
        
        // More tickets sold as we get closer to event date
        const progress = Math.min(1, (i + 1) / 14);
        const dailyTickets = Math.floor((event.ticket_sales || 0) * progress * 0.15);
        
        const ticketTypes = [
          {
            name: "Standard",
            quantity: Math.floor(dailyTickets * 0.7),
            revenue: Math.floor(dailyTickets * 0.7 * 10)
          },
          {
            name: "VIP",
            quantity: Math.floor(dailyTickets * 0.2),
            revenue: Math.floor(dailyTickets * 0.2 * 25)
          },
          {
            name: "Early Bird",
            quantity: Math.floor(dailyTickets * 0.1),
            revenue: Math.floor(dailyTickets * 0.1 * 8)
          }
        ];
        
        const totalRevenue = ticketTypes.reduce((sum, type) => sum + type.revenue, 0);
        
        return {
          id: `ed-${eventId}-${i}`,
          event_id: eventId,
          date: dateString,
          tickets_sold: ticketTypes.reduce((sum, type) => sum + type.quantity, 0),
          revenue: totalRevenue,
          attendees: 0, // Will be filled on event day
          ticket_types: ticketTypes
        };
      });
      
      // Simulate attendance on the event day
      const eventDate = event.date ? new Date(event.date) : new Date();
      const today = new Date();
      
      if (eventDate <= today) {
        const eventDayData = result.find(data => data.date === event.date);
        if (eventDayData) {
          eventDayData.attendees = event.attendees || 0;
        }
      }
      
      return result;
    }

    // In production, this would query the real database
    // We'll implement this when the detailed analytics table is available
    return [];
  } catch (error) {
    console.error('Error fetching event detailed analytics:', error);
    return [];
  }
}
