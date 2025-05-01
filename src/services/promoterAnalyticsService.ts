
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
  clicks?: number;
  ctr?: string;
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

// New interfaces for enhanced analytics
export interface EventDetails {
  id: string;
  name: string;
  date: string;
  venue_name: string;
  total_attendees: number;
  total_revenue: number;
  ticket_breakdown: TicketBreakdown[];
  historical_comparison: HistoricalComparison;
  attendance_demographics: AttendanceDemographic[];
}

export interface TicketBreakdown {
  ticket_type: string;
  quantity_sold: number;
  price: number;
  revenue: number;
  percentage: number;
}

export interface HistoricalComparison {
  event_name: string;
  previous_date: string;
  previous_attendees: number;
  previous_revenue: number;
  attendee_growth: number;
  revenue_growth: number;
}

export interface AttendanceDemographic {
  category: string;
  value: number;
  percentage: number;
}

export interface AudienceDemographicData {
  name: string;
  value: number;
}

export interface AudienceRetentionData {
  cohort: string;
  month0: number;
  month1: number;
  month2: number;
  month3: number;
}

export interface CampaignROIData {
  id: string;
  name: string;
  total_cost: number;
  total_revenue: number;
  roi_percentage: number;
  breakdown: CampaignROIBreakdown[];
  channel_performance: ChannelPerformance[];
}

export interface CampaignROIBreakdown {
  category: string;
  cost: number;
  revenue: number;
  roi: number;
}

export interface ChannelPerformance {
  channel: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cvr: number;
  cost: number;
  cpc: number;
  revenue: number;
}

// Cache for mock data to ensure consistency between renders
const mockDataCache: Record<string, {
  promoterAnalytics: PromoterAnalytics[];
  eventPerformance: EventPerformance[];
  campaignPerformance: CampaignPerformance[];
  audienceMetrics: AudienceMetric[];
  trends: TrendDataPoint[];
  eventDetails: Record<string, EventDetails>;
  audienceDemographics: AudienceDemographicData[];
  audienceRetention: AudienceRetentionData[];
  campaignROI: Record<string, CampaignROIData>;
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
    const clicks = Math.floor(reach * (0.1 + rand * 0.2));
    const ctr = ((clicks / reach) * 100).toFixed(1);
    
    const statuses = ['active', 'completed', 'scheduled'];
    
    return {
      id: `cp-${promoterId}-${i}`,
      name: campaignNames[i % campaignNames.length],
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      reach,
      engagement,
      clicks,
      ctr,
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

  // Generate event details for each event
  const eventDetails: Record<string, EventDetails> = {};

  eventPerformance.forEach((event, idx) => {
    const rand = seededRandom(event.id, idx);
    
    // Generate ticket breakdown
    const ticketTypes = ['General Admission', 'VIP', 'Early Bird', 'Group'];
    const ticketBreakdown = ticketTypes.map((type, i) => {
      const typeSeed = seededRandom(event.id, i * 10);
      const price = Math.floor(typeSeed * 20) + 10;
      const quantity = Math.floor(typeSeed * 30) + 5;
      const revenue = price * quantity;
      const percentage = Math.floor(typeSeed * 30) + 10;
      
      return {
        ticket_type: type,
        quantity_sold: quantity,
        price: price,
        revenue: revenue,
        percentage: percentage
      };
    });
    
    // Historical comparison
    const historicalComparison = {
      event_name: event.name,
      previous_date: new Date(new Date(event.date).getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      previous_attendees: Math.floor(event.attendees * 0.8),
      previous_revenue: Math.floor(event.revenue * 0.75),
      attendee_growth: 25,
      revenue_growth: 33
    };
    
    // Demographics
    const demographics = [
      { category: '18-24', value: Math.floor(rand * 25) + 10, percentage: Math.floor(rand * 30) + 15 },
      { category: '25-34', value: Math.floor(rand * 35) + 15, percentage: Math.floor(rand * 30) + 25 },
      { category: '35-44', value: Math.floor(rand * 20) + 5, percentage: Math.floor(rand * 20) + 15 },
      { category: '45+', value: Math.floor(rand * 15) + 5, percentage: Math.floor(rand * 15) + 10 }
    ];
    
    eventDetails[event.id] = {
      id: event.id,
      name: event.name,
      date: event.date,
      venue_name: event.venue_name,
      total_attendees: event.attendees,
      total_revenue: event.revenue,
      ticket_breakdown: ticketBreakdown,
      historical_comparison: historicalComparison,
      attendance_demographics: demographics
    };
  });
  
  // Generate campaign ROI data
  const campaignROI: Record<string, CampaignROIData> = {};
  
  campaignPerformance.forEach((campaign, idx) => {
    const rand = seededRandom(campaign.id, idx);
    
    // Cost components
    const adSpend = Math.floor(rand * 300) + 200;
    const creativeDesign = Math.floor(rand * 200) + 100;
    const eventStaffing = Math.floor(rand * 250) + 150;
    const totalCost = adSpend + creativeDesign + eventStaffing;
    
    // Revenue components based on campaign reach and conversion
    const ticketRevenue = Math.floor(campaign.reach * campaign.conversion_rate * 0.01 * 25);
    const merchandiseRevenue = Math.floor(campaign.reach * campaign.conversion_rate * 0.01 * 10);
    const totalRevenue = ticketRevenue + merchandiseRevenue;
    
    // ROI breakdown
    const breakdown = [
      { category: 'Ad Spend', cost: adSpend, revenue: ticketRevenue * 0.7, roi: ((ticketRevenue * 0.7 / adSpend) - 1) * 100 },
      { category: 'Creative Design', cost: creativeDesign, revenue: ticketRevenue * 0.2, roi: ((ticketRevenue * 0.2 / creativeDesign) - 1) * 100 },
      { category: 'Event Staffing', cost: eventStaffing, revenue: ticketRevenue * 0.1 + merchandiseRevenue, roi: ((ticketRevenue * 0.1 + merchandiseRevenue) / eventStaffing - 1) * 100 }
    ];
    
    // Channel performance
    const channels = ['Social Media', 'Email', 'Paid Search', 'Direct'];
    const channelPerformance = channels.map((channel, i) => {
      const channelSeed = seededRandom(campaign.id, i * 11);
      
      const impressions = Math.floor(channelSeed * campaign.reach * 0.5) + Math.floor(campaign.reach * 0.1);
      const clicks = Math.floor(impressions * (0.02 + channelSeed * 0.04));
      const conversions = Math.floor(clicks * (0.05 + channelSeed * 0.15));
      const ctr = (clicks / impressions) * 100;
      const cvr = (conversions / clicks) * 100;
      const cost = Math.floor(channelSeed * totalCost * 0.4) + Math.floor(totalCost * 0.1);
      const cpc = cost / clicks;
      const revenue = conversions * (20 + Math.floor(channelSeed * 15));
      
      return {
        channel,
        impressions,
        clicks,
        conversions,
        ctr,
        cvr,
        cost,
        cpc,
        revenue
      };
    });
    
    campaignROI[campaign.id] = {
      id: campaign.id,
      name: campaign.name,
      total_cost: totalCost,
      total_revenue: totalRevenue,
      roi_percentage: ((totalRevenue / totalCost) - 1) * 100,
      breakdown,
      channel_performance: channelPerformance
    };
  });

  // Audience demographics
  const audienceDemographics: AudienceDemographicData[] = [
    { name: '18-24', value: 25 },
    { name: '25-34', value: 35 },
    { name: '35-44', value: 20 },
    { name: '45+', value: 20 }
  ];
  
  // Audience retention cohort analysis
  const audienceRetention: AudienceRetentionData[] = [
    { cohort: 'Jan 2025', month0: 100, month1: 75, month2: 60, month3: 45 },
    { cohort: 'Feb 2025', month0: 100, month1: 70, month2: 55, month3: 0 },
    { cohort: 'Mar 2025', month0: 100, month1: 80, month2: 0, month3: 0 },
    { cohort: 'Apr 2025', month0: 100, month1: 0, month2: 0, month3: 0 }
  ];

  // Cache the generated data
  const mockData = {
    promoterAnalytics,
    eventPerformance,
    campaignPerformance,
    audienceMetrics,
    trends,
    eventDetails,
    audienceDemographics,
    audienceRetention,
    campaignROI
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

/**
 * Fetches detailed event information
 */
export async function fetchEventDetails(eventId: string): Promise<EventDetails | null> {
  try {
    // Find the cached data across all promoters
    for (const promoterId in mockDataCache) {
      const cache = mockDataCache[promoterId];
      if (cache.eventDetails && cache.eventDetails[eventId]) {
        return cache.eventDetails[eventId];
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching event details:', error);
    return null;
  }
}

/**
 * Fetches audience demographics data
 */
export async function fetchAudienceDemographics(promoterId: string): Promise<AudienceDemographicData[]> {
  try {
    const { audienceDemographics } = createMockData(promoterId);
    return audienceDemographics;
  } catch (error) {
    console.error('Error fetching audience demographics:', error);
    return [];
  }
}

/**
 * Fetches audience retention data
 */
export async function fetchAudienceRetention(promoterId: string): Promise<AudienceRetentionData[]> {
  try {
    const { audienceRetention } = createMockData(promoterId);
    return audienceRetention;
  } catch (error) {
    console.error('Error fetching audience retention data:', error);
    return [];
  }
}

/**
 * Fetches campaign ROI data
 */
export async function fetchCampaignROI(campaignId: string): Promise<CampaignROIData | null> {
  try {
    // Find the cached data across all promoters
    for (const promoterId in mockDataCache) {
      const cache = mockDataCache[promoterId];
      if (cache.campaignROI && cache.campaignROI[campaignId]) {
        return cache.campaignROI[campaignId];
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching campaign ROI data:', error);
    return null;
  }
}
