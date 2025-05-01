
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

// Stable and consistent mock data cache
const mockDataCache: Record<string, {
  promoterAnalytics: PromoterAnalytics[];
  eventPerformance: EventPerformance[];
  campaignPerformance: CampaignPerformance[];
  audienceMetrics: AudienceMetric[];
  trends: TrendDataPoint[];
}> = {};

/**
 * Generate a deterministic random number based on a seed string and index
 * This ensures consistent mock data between renders
 */
function seededRandom(seed: string, index: number): number {
  // Convert seed string to a numeric value
  const seedValue = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  // Combine with index for different values within the same seed
  const combinedSeed = seedValue + index * 137;
  // Use sine function to generate a pseudo-random value between 0-1
  const x = Math.sin(combinedSeed) * 10000;
  return x - Math.floor(x);
}

/**
 * Format a date as ISO string (YYYY-MM-DD)
 */
const formatDateString = (date: Date): string => {
  try {
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error("Error formatting date:", error);
    return new Date().toISOString().split('T')[0]; // Fallback to today
  }
};

/**
 * Generate consistent mock data for testing and preview environments
 */
const createMockData = (promoterId: string) => {
  // Return cached data if available to ensure consistency
  if (mockDataCache[promoterId]) {
    return mockDataCache[promoterId];
  }

  try {
    // Generate a consistent set of mock data based on the promoterId
    const currentDate = new Date();
    const today = formatDateString(currentDate);

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

    // Campaign names for consistency
    const campaignNames = [
      'Summer Sobriety',
      'Weekend Wellness',
      'Mindful Monday',
      'Thirsty Thursday Alternative',
      'Friday Night Clarity'
    ];

    // 1. Generate promoter analytics (daily data for 30 days)
    const promoterAnalytics: PromoterAnalytics[] = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - 30 + i);
      const dateString = formatDateString(date);
      
      const rand = seededRandom(promoterId, i);
      const prevRand = seededRandom(promoterId, i - 1);
      
      // Use previous day's data with small variations for realistic trends
      const baseSubs = i > 0 ? 50 + i : 50;
      const subGrowth = i > 0 ? Math.floor(rand * 5) : 0;
      
      return {
        id: `pa-${promoterId}-${i}`,
        date: dateString,
        total_events: Math.floor(rand * 3) + 1,
        active_campaigns: Math.floor(rand * 2) + 1,
        subscriber_count: baseSubs + subGrowth,
        engagement_rate: Math.round((rand * 30 + 10) * 100) / 100, // 10-40%
        revenue: Math.round(rand * 500) + 200
      };
    });

    // 2. Generate event performance data
    const eventPerformance: EventPerformance[] = Array.from({ length: 5 }, (_, i) => {
      const date = new Date(currentDate);
      // Spread events over past/future 30 days
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

    // 3. Generate campaign performance data
    const campaignPerformance: CampaignPerformance[] = Array.from({ length: 3 }, (_, i) => {
      // Create realistic campaign date ranges
      const startDate = new Date(currentDate);
      startDate.setDate(startDate.getDate() - Math.floor(seededRandom(promoterId, i + 300) * 30) - 10);
      const startDateString = formatDateString(startDate);
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Math.floor(seededRandom(promoterId, i + 400) * 14) + 7);
      const endDateString = formatDateString(endDate);
      
      const rand = seededRandom(promoterId, i + 500);
      const reach = Math.floor(rand * 500) + 100;
      const engagement = Math.floor(reach * (0.1 + rand * 0.3));
      
      // Determine status based on dates
      const status = 
        endDate > currentDate ? 'active' : 
        seededRandom(promoterId, i + 600) > 0.7 ? 'completed' : 'scheduled';
      
      return {
        id: `cp-${promoterId}-${i}`,
        name: campaignNames[i % campaignNames.length],
        start_date: startDateString,
        end_date: endDateString,
        reach,
        engagement,
        conversion_rate: Math.round((engagement / reach) * 1000) / 10,
        status
      };
    });

    // 4. Generate audience metrics for different demographics
    const segments = {
      'gender': ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
      'age': ['18-24', '25-34', '35-44', '45+'],
      'location': ['Urban', 'Suburban', 'Rural', 'College Campus'],
      'interests': ['Health', 'Social', 'Culinary', 'Wellness', 'Nightlife']
    };
    
    const audienceMetrics: AudienceMetric[] = [];
    
    // Generate metrics for each segment type
    Object.entries(segments).forEach(([metricName, segmentValues], metricIndex) => {
      // Create a total value to distribute
      const totalValue = 100;
      let remainingValue = totalValue;
      
      // Distribute values across segments
      segmentValues.forEach((segment, i) => {
        const isLast = i === segmentValues.length - 1;
        const rand = seededRandom(`${promoterId}-${metricName}`, i);
        
        // Last segment gets remaining value, others get random portion
        const value = isLast 
          ? remainingValue 
          : Math.round(remainingValue * (0.1 + rand * 0.5));
        
        remainingValue -= value;
        
        audienceMetrics.push({
          metric_name: metricName,
          metric_value: value,
          timestamp: today,
          segment
        });
      });
    });

    // 5. Generate trend data (subscriber and engagement)
    const trends: TrendDataPoint[] = [];

    // Subscriber growth trend (30 days)
    for (let i = 0; i < 30; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - 30 + i);
      const dateString = formatDateString(date);
      
      const rand = seededRandom(promoterId, i + 700);
      const prevValue = i > 0 ? trends.find(t => 
        t.date === formatDateString(new Date(date.getTime() - 86400000)) && 
        t.metric_name === 'subscriber_growth'
      )?.metric_value : 50;
      
      // Create a growth trend that builds on previous days
      const growth = Math.floor(rand * 5); // 0-5 new subscribers per day
      const newValue = (prevValue || 50) + growth;
      
      trends.push({
        date: dateString,
        metric_value: newValue,
        metric_name: 'subscriber_growth'
      });
    }

    // Engagement rate trend (30 days)
    for (let i = 0; i < 30; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - 30 + i);
      const dateString = formatDateString(date);
      
      const rand = seededRandom(promoterId, i + 800);
      const prevValue = i > 0 ? trends.find(t => 
        t.date === formatDateString(new Date(date.getTime() - 86400000)) && 
        t.metric_name === 'engagement_rate'
      )?.metric_value : 15;
      
      // Create fluctuating engagement with slight trend
      const change = (rand - 0.5) * 5; // -2.5 to +2.5 % change
      const newValue = Math.min(Math.max((prevValue || 15) + change, 5), 40); // Keep between 5-40%
      
      trends.push({
        date: dateString,
        metric_value: Math.round(newValue * 10) / 10,
        metric_name: 'engagement_rate'
      });
    }

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
  } catch (error) {
    console.error("Error generating mock data:", error);
    
    // Return empty data on error
    return {
      promoterAnalytics: [],
      eventPerformance: [],
      campaignPerformance: [],
      audienceMetrics: [],
      trends: []
    };
  }
};

/**
 * Fetches general promoter analytics
 */
export async function fetchPromoterAnalytics(
  promoterId: string, 
  range: AnalyticsDateRange
): Promise<PromoterAnalytics[]> {
  try {
    // Always use mock data in preview environment
    if (isPreviewEnvironment()) {
      console.log("Using mock promoter analytics data in preview environment");
      const { promoterAnalytics } = createMockData(promoterId);
      
      // Filter by date range with safety checks
      return promoterAnalytics.filter(data => {
        try {
          if (!data.date) return false;
          const dataDate = new Date(data.date);
          return !isNaN(dataDate.getTime()) && 
                 dataDate >= range.startDate && 
                 dataDate <= range.endDate;
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
    // Use mock data in preview environment
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
        id: item.event_id || `gen-${Math.random().toString(36).substr(2, 9)}`,
        name: item.event_name || 'Unnamed Event',
        date: item.date || formatDateString(new Date()),
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
    // Use mock data in preview environment
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
      // Transform database data to match the expected format with safety checks
      return data.map(item => ({
        id: item.campaign_id || `gen-${Math.random().toString(36).substr(2, 9)}`,
        name: item.campaign_name || 'Unnamed Campaign',
        start_date: item.start_date || formatDateString(new Date()),
        end_date: item.end_date || formatDateString(new Date(Date.now() + 7 * 86400000)),
        reach: item.total_impressions || 0,
        engagement: item.total_clicks || 0,
        conversion_rate: item.conversion_rate || 0,
        status: new Date(item.end_date || Date.now()) < new Date() ? 'completed' : 'active'
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
    // Use mock data in preview environment
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
        metric_name: item.metric_name || 'unknown',
        metric_value: item.metric_value || 0,
        timestamp: item.created_at || formatDateString(new Date()),
        segment: item.segment || 'Unknown'
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
    // Use mock data in preview environment
    if (isPreviewEnvironment()) {
      console.log(`Using mock trend data for ${metricName} in preview environment`);
      const { trends } = createMockData(promoterId);
      
      // Filter by metric name and date range
      return trends
        .filter(t => t.metric_name === metricName)
        .filter(data => {
          try {
            if (!data.date) return false;
            const dataDate = new Date(data.date);
            return !isNaN(dataDate.getTime()) &&
                   dataDate >= range.startDate && 
                   dataDate <= range.endDate;
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
    console.log("Using mock event detailed analytics data");
    
    // Find the specific event from mock data
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
    try {
      const eventDate = event.date ? new Date(event.date) : new Date();
      const today = new Date();
      
      if (!isNaN(eventDate.getTime()) && eventDate <= today) {
        const eventDayData = result.find(data => data.date === event.date);
        if (eventDayData) {
          eventDayData.attendees = event.attendees || 0;
        }
      }
    } catch (error) {
      console.error("Error setting event day attendance:", error);
    }
    
    return result;
  } catch (error) {
    console.error('Error creating event detailed analytics:', error);
    return [];
  }
}
